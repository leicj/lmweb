import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "engineering",
  state: {
    // 工程列表
    data: [],
    tags: [],
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
    // 0：工程库，1：工程方案库
    status: "0",
  },
  effects: {
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.engineering.pagination);
        const cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getEngineerings, cond);
        if (data.code == 0) {
          pagination.total = data.total
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rtags', tags: data.tags });
          yield put({ type: 'rpagination', pagination: pagination });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取工程列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postEngineeringsAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增工程失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putEngineeringsEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑工程失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delEngineeringsDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除工程失败！");
      }
    }
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rtags(state, { tags }) { return { ...state, tags } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
    rstatus(state, { status }) { return { ...state, status } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/smart/category') {
          dispatch({ type: "list" });
        }
      });
    },
  },
}

async function getEngineerings(cond) {
  return await axios.get(`${GLOBAL.engineering}?${cond}`);
}

async function postEngineeringsAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.engineering}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putEngineeringsEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.engineering}?_id=${_id}`, data: formData });
}

async function delEngineeringsDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.engineering}?_id=${_id}` });
}