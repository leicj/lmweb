import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "category",
  state: {
    // 对策列表
    data: [],
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    addVisible: false,
    editData: {
      data: {},
      visible: false,
    },
  },
  effects: {
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.category.pagination);
        const cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getCategorys, cond);
        if (data.code == 0) {
          pagination.total = data.total
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取对策列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postCategorysAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增对策失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putCategorysEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑对策失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delCategorysDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除对策失败！");
      }
    }
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
  },
}

async function getCategorys(cond) {
  return await axios.get(`${GLOBAL.category}?${cond}`);
}

async function postCategorysAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.category}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putCategorysEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.category}?_id=${_id}`, data: formData });
}

async function delCategorysDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.category}?_id=${_id}` });
}