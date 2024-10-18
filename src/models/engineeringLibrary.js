import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';


export default {
  namespace: "engineeringLibrary",
  state: {
    // 工程方案列表
    data: [],
    // 工程字典
    engineerings: [],
    mapEngineering: {},
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
        const pagination = yield select(state => state.engineeringLibrary.pagination);
        const cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getEngineeringLibrarys, cond);
        if (data.code == 0) {
          pagination.total = data.total
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取工程方案列表失败！");
      }
    },
    *listEngineering({ }, { select, call, put }) {
      try {
        const cond = 'pageIndex=1&pageSize=99999';
        const { data } = yield call(getEngineerings, cond);
        if (data.code == 0) {
          const mapEngineering = {};
          data.data.forEach(d => {
            mapEngineering[d._id] = d.name;
          });
          yield put({ type: 'rengineerings', engineerings: data.data });
          yield put({ type: 'rmapEngineering', mapEngineering });
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
        const { data } = yield call(postEngineeringLibrarysAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增工程方案失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putEngineeringLibrarysEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑工程方案失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delEngineeringLibrarysDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除工程方案失败！");
      }
    }
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rengineerings(state, { engineerings }) { return { ...state, engineerings } },
    rmapEngineering(state, { mapEngineering }) { return { ...state, mapEngineering } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
  },
}

async function getEngineeringLibrarys(cond) {
  return await axios.get(`${GLOBAL.engineeringLibrary}?${cond}`);
}

async function postEngineeringLibrarysAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.engineeringLibrary}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putEngineeringLibrarysEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.engineeringLibrary}?_id=${_id}`, data: formData });
}

async function delEngineeringLibrarysDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.engineeringLibrary}?_id=${_id}` });
}

async function getEngineerings(cond) {
  return await axios.get(`${GLOBAL.engineering}?${cond}`);
}