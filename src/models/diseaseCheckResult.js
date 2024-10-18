import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "diseaseCheckResult",
  state: {
    // 病害诊断结果列表
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
  },
  effects: {
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.diseaseCheckResult.pagination);
        const cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getDiseaseCheckResults, cond);
        if (data.code == 0) {
          pagination.total = data.total
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
          yield put({ type: 'rtags', tags: data.tags });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取病害诊断结果列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postDiseaseCheckResultsAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增病害诊断结果失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putDiseaseCheckResultsEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑病害诊断结果失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delDiseaseCheckResultsDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除病害诊断结果失败！");
      }
    }
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rtags(state, { tags }) { return { ...state, tags } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
  },
}

async function getDiseaseCheckResults(cond) {
  return await axios.get(`${GLOBAL.diseaseCheckResult}?${cond}`);
}

async function postDiseaseCheckResultsAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.diseaseCheckResult}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putDiseaseCheckResultsEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.diseaseCheckResult}?_id=${_id}`, data: formData });
}

async function delDiseaseCheckResultsDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.diseaseCheckResult}?_id=${_id}` });
}