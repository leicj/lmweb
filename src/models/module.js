import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "module",
  state: {
    // 模块管理
    allData: [], // 用于模块详情的下拉选择
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
    // 字段工程列表：过滤掉无具体字段的数据
    fieldFactoryData: [],

    // 模块配置详情
    moduleFieldFactoryData: [],
    selectFieldFactoryID: "",
    moduleData: [],
    modulePagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    moduleEditData: {
      data: {},
      visible: false,
    },
    selectModuleFactoryID: "",

    // 模块工厂：1，模块详情：2
    selectTable: "1",
  },
  effects: {
    // 模块管理
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.module.pagination);
        let cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getModuleFactorys, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
          if (data.data.length > 0) {
            yield put({ type: 'rselectModuleFactoryID', selectModuleFactoryID: data.data[0]._id });
          }
        } else {
          console.error(data.message);
        }
        // 获取所有数据，用于模块详情的下拉筛选
        cond = `pageIndex=1&pageSize=9999`;
        const r = yield call(getModuleFactorys, cond);
        if (r.data.code == 0 && r.data.data.length > 0) {
          yield put({ type: 'rallData', allData: r.data.data });
        }
      } catch (error) {
        console.error(error);
        message.error("获取模块工厂列表失败！");
      }
    },
    *listFieldFactory({ }, { select, call, put }) {
      try {
        const cond = `pageIndex=1&pageSize=9999&hasField=1`;
        const { data } = yield call(getFieldFactorys, cond);
        if (data.code == 0) {
          yield put({ type: 'rfieldFactoryData', fieldFactoryData: data.data })
        }
      } catch (error) {
        console.error(error);
        message.error("获取字段工厂列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postModuleFactorysAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增模块工厂失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putModuleFactorysEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑模块工厂失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delModuleFactorysDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除模块工厂失败！");
      }
    },

    // 模块详情管理
    *moduleFieldFactoryList({ moduleFactoryID, cb }, { select, call, put }) {
      try {
        const cond = `moduleFactoryID=${moduleFactoryID}`
        const { data } = yield call(getModuleFieldFactory, cond);
        if (data.code == 0) {
          yield put({ type: 'rmoduleFieldFactoryData', moduleFieldFactoryData: data.data });
          if (data.data.length > 0) {
            yield put({ type: 'rselectFieldFactoryID', selectFieldFactoryID: data.data[0]['fieldFactoryID'] })
          }
        } else {
          message.error(error);
          message.error("获取字段工厂列表失败！");
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取字段工厂列表失败！");
      }
    },
    *moduleList({ moduleFactoryID, fieldFactoryID }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.module.modulePagination);
        const selectModuleFactoryID = yield select(state => state.module.selectModuleFactoryID);
        moduleFactoryID = moduleFactoryID || selectModuleFactoryID;
        const selectFieldFactoryID = yield select(state => state.module.selectFieldFactoryID);
        fieldFactoryID = fieldFactoryID || selectFieldFactoryID;
        const cond = `moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getModules, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rmoduleData', moduleData: data.data });
          yield put({ type: 'rmodulePagination', modulePagination: pagination });
        } else {
          message.error("获取模块详情列表失败！");
        }
      } catch (error) {
        console.error(error);
        message.error("获取模块详情列表失败！");
      }
    },
    *moduleedit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putModulesEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑模块详情失败！");
      }
    }
  },

  reducers: {
    rallData(state, { allData }) { return { ...state, allData } },
    rdata(state, { data }) { return { ...state, data } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
    rfieldFactoryData(state, { fieldFactoryData }) { return { ...state, fieldFactoryData } },

    rmoduleFieldFactoryData(state, { moduleFieldFactoryData }) { return { ...state, moduleFieldFactoryData } },
    rselectFieldFactoryID(state, { selectFieldFactoryID }) { return { ...state, selectFieldFactoryID } },
    rmoduleData(state, { moduleData }) { return { ...state, moduleData } },
    rmodulePagination(state, { modulePagination }) { return { ...state, modulePagination } },
    rmoduleEditData(state, { moduleEditData }) { return { ...state, moduleEditData } },
    rselectModuleFactoryID(state, { selectModuleFactoryID }) { return { ...state, selectModuleFactoryID } },

    rselectTable(state, { selectTable }) { return { ...state, selectTable } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/base/moduleFactory') {
          dispatch({ type: "list" });
          dispatch({ type: "listFieldFactory" });
          dispatch({ type: "rselectTable", selectTable: "1" })
        }
      });
    },
  },
}

async function getModuleFactorys(cond) {
  return await axios.get(`${GLOBAL.moduleFactory}?${cond}`);
}

async function postModuleFactorysAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.moduleFactory}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putModuleFactorysEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.moduleFactory}?_id=${_id}`, data: formData });
}

async function delModuleFactorysDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.moduleFactory}?_id=${_id}` });
}

async function getFieldFactorys(cond) {
  return await axios.get(`${GLOBAL.fieldFactory}?${cond}`);
}

async function getModuleFieldFactory(cond) {
  return await axios.get(`${GLOBAL.module}/fieldFactory?${cond}`);
}

async function getModules(cond) {
  return await axios.get(`${GLOBAL.module}?${cond}`);
}

async function putModulesEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.module}?_id=${_id}`, data: formData });
}