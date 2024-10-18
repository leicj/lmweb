import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';
import DownloadFile from '../components/download';

export default {
  namespace: "application",
  state: {
    // 实例管理
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
    moduleFactoryData: [],

    // 实例数据管理
    // 字段工厂的数据
    moduleFieldFactoryData: [],
    // 字段详情的titles和body
    groupData: [],
    fieldTitle: [],
    fieldBody: [],
    fieldPagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    fieldAddVisible: false,
    fieldEditData: {
      data: {},
      visible: false,
    },

    selectApplicationFactory: {
      applicationFactoryID: "",
      moduleFactoryID: "",
      fieldFactoryID: "",
    },

    // 列字段控制
    columnsEditData: {
      data: [],
      visible: false,
    },
    // 查询
    fieldSearch: [],
    uploadVisible: false,

    // 行选择
    selrows: {
      selectedRowKeys: [],
      selectedRows: [],
    },
    bridgeRuleAdd: {
      data: {},
      visible: false,
    },
    jm: null,
    // 插件数据
    rulesData: [],

    // 实例工厂：1，实例详情：2
    selectTable: "1",

    mapCookie: {},
  },

  effects: {
    // ------------------实例管理------------------
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.application.pagination);
        let cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getApplicationFactorys, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
          if (data.data.length > 0) {
            const d = data.data[0];
            yield put({ type: 'rselectApplicationFactory', selectApplicationFactory: { applicationFactoryID: d['_id'], moduleFactoryID: d['moduleFactoryID'] } });
          }
        } else {
          console.error(data.message);
        }
        // 获取所有数据，用于模块详情的下拉筛选
        cond = `pageIndex=1&pageSize=9999`;
        const r = yield call(getApplicationFactorys, cond);
        if (r.data.code == 0 && r.data.data.length > 0) {
          yield put({ type: 'rallData', allData: r.data.data });
        }
      } catch (error) {
        console.error(error);
        message.error("获取实例工厂列表失败！");
      }
    },
    *listModuleFactory({ }, { select, call, put }) {
      try {
        const cond = `pageIndex=1&pageSize=9999`;
        const { data } = yield call(getModuleFactorys, cond);
        if (data.code == 0) {
          yield put({ type: 'rmoduleFactoryData', moduleFactoryData: data.data })
        }
      } catch (error) {
        console.error(error);
        message.error("获取模块工厂列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postApplicationFactorysAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增实例工厂失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putApplicationFactorysEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑实例工厂失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delApplicationFactorysDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除实例工厂失败！");
      }
    },

    // ------------------实例详情管理------------------
    *moduleFieldFactoryList({ moduleFactoryID, cb }, { select, call, put }) {
      try {
        const selectApplicationFactory = yield select(state => state.application.selectApplicationFactory);
        const cond = `moduleFactoryID=${moduleFactoryID}`
        const { data } = yield call(getModuleFieldFactory, cond);
        if (data.code == 0) {
          yield put({ type: 'rmoduleFieldFactoryData', moduleFieldFactoryData: data.data });
          if (data.data.length > 0) {
            selectApplicationFactory.fieldFactoryID = data.data[0]['fieldFactoryID'];
            yield put({ type: 'rselectApplicationFactory', selectApplicationFactory: selectApplicationFactory })
          }
        } else {
          message.error("获取字段工厂列表失败！");
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取字段工厂列表失败！");
      }
    },
    *applicationTitleList({ applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const selectApplicationFactory = yield select(state => state.application.selectApplicationFactory);
        fieldFactoryID = fieldFactoryID || selectApplicationFactory['fieldFactoryID'];
        const cond = `applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
        const { data } = yield call(getApplicationTitles, cond);
        if (data.code == 0) {
          yield put({ type: 'rgroupData', groupData: data.groupData });
          yield put({ type: 'rfieldTitle', fieldTitle: data.data });
        } else {
          message.error("获取字段标题列表失败！");
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取字段标题列表失败！");
      }
    },
    *applicationSearchList({ applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const selectApplicationFactory = yield select(state => state.application.selectApplicationFactory);
        fieldFactoryID = fieldFactoryID || selectApplicationFactory['fieldFactoryID'];
        const cond = `applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
        const { data } = yield call(getApplicationSearchs, cond);
        if (data.code == 0) {
          yield put({ type: 'rfieldSearch', fieldSearch: data.data });
        } else {
          message.error("获取查询条件失败！");
        }
      } catch (error) {
        console.error(error);
        message.error("获取查询条件失败！");
      }
    },
    *applicationList({ formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const selectApplicationFactory = yield select(state => state.application.selectApplicationFactory);
        fieldFactoryID = fieldFactoryID || selectApplicationFactory['fieldFactoryID'];
        const pagination = yield select(state => state.application.fieldPagination);
        const cond = `applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getApplications, formData, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rfieldBody', fieldBody: data.data });
          yield put({ type: 'rfieldPagination', fieldPagination: pagination });
        }
      } catch (error) {
        console.error(error);
        message.error("获取字段数据列表失败！");
      }
    },
    *fieldAdd({ formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postApplicationsAdd, formData, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增字段数据失败！");
      }
    },
    *fieldEdit({ formData, _id, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putApplicationsEdit, formData, _id, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑字段数据失败！");
      }
    },
    *fieldDel({ _id, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delApplicationsDel, _id, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除字段数据失败！");
      }
    },
    *fieldDelBatch({ _ids, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delApplicationsDelBatch, _ids, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除字段数据失败！");
      }
    },
    *uploadTemplate({ applicationFactoryID, moduleFactoryID, fieldFactoryID }, { select, call, put }) {
      try {
        const { data } = yield call(getApplicationsUploadTemplate, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        DownloadFile(data, '批量导入模板.xlsx');
      } catch (error) {
        console.error(error);
        message.error("批量导入模板下载失败！");
      }
    },
    *upload({ formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postApplicationsUpload, formData, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("上传数据有误！");
      }
    },
    *download({ formData, applicationFactoryID, moduleFactoryID, fieldFactoryID }, { select, call, put }) {
      try {
        const { data } = yield call(postApplicationsDownload, formData, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        DownloadFile(data, '批量导出数据.xlsx');
      } catch (error) {
        console.error(error);
        message.error("批量导出数据失败！");
      }
    },
    *ruleAdd({ formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, ruleID, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postApplicationRule, formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, ruleID);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增桥梁规则失败！");
      }
    },
    *ruleDel({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delApplicationRule, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("取消组合桥梁规则失败！");
      }
    },
    *ruleList({ }, { select, call, put }) {
      try {
        const { data } = yield call(getApplicationRules)
        if (data.code == 0) {
          yield put({ type: 'rrulesData', rulesData: data.data });
        } else {
          message.error("获取插件失败！");
        }
      } catch (error) {
        console.error(error);
        message.error("获取插件失败！");
      }
    },
    *cookieList({ }, { select, call, put }) {
      try {
        const { data } = yield call(getCookie)
        if (data.code == 0) {
          yield put({ type: 'rmapCookie', mapCookie: data.data });
        } else {
          message.error("获取cookie失败！");
        }
      } catch (error) {
        console.error(error);
        message.error("获取cookie失败！");
      }
    },
    *cooketEdit({ key, value, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putCookie, key, value)
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("设置cookie失败！");
      }
    }
  },

  reducers: {
    rallData(state, { allData }) { return { ...state, allData } },
    rdata(state, { data }) { return { ...state, data } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
    rmoduleFactoryData(state, { moduleFactoryData }) { return { ...state, moduleFactoryData } },

    rmoduleFieldFactoryData(state, { moduleFieldFactoryData }) { return { ...state, moduleFieldFactoryData } },
    rgroupData(state, { groupData }) { return { ...state, groupData } },
    rfieldTitle(state, { fieldTitle }) { return { ...state, fieldTitle } },
    rfieldBody(state, { fieldBody }) { return { ...state, fieldBody } },
    rfieldPagination(state, { fieldPagination }) { return { ...state, fieldPagination } },
    rfieldAddVisible(state, { visible }) { return { ...state, fieldAddVisible: visible } },
    rfieldEditData(state, { fieldEditData }) { return { ...state, fieldEditData } },
    rselectApplicationFactory(state, { selectApplicationFactory }) { return { ...state, selectApplicationFactory } },

    rcolumnsEditData(state, { columnsEditData }) { return { ...state, columnsEditData } },
    rfieldSearch(state, { fieldSearch }) { return { ...state, fieldSearch } },
    ruploadVisible(state, { visible }) { return { ...state, uploadVisible: visible } },

    rselrows(state, { selrows }) { return { ...state, selrows } },
    rbridgeRuleAdd(state, { bridgeRuleAdd }) { return { ...state, bridgeRuleAdd } },
    rjm(state, { jm }) { return { ...state, jm } },
    rrulesData(state, { rulesData }) { return { ...state, rulesData } },

    rselectTable(state, { selectTable }) { return { ...state, selectTable } },
    rmapCookie(state, { mapCookie }) { return { ...state, mapCookie } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/base/applicationFactory') {
          dispatch({ type: "list" });
          dispatch({ type: "listModuleFactory" });
          dispatch({ type: "rselectTable", selectTable: "1" });
          dispatch({ type: "ruleList" });
          dispatch({ type: "cookieList" });
        }
      });
    },
  },
}

async function getApplicationFactorys(cond) {
  return await axios.get(`${GLOBAL.applicationFactory}?${cond}`);
}

async function postApplicationFactorysAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.applicationFactory}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putApplicationFactorysEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.applicationFactory}?_id=${_id}`, data: formData });
}

async function delApplicationFactorysDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.applicationFactory}?_id=${_id}` });
}

async function getModuleFactorys(cond) {
  return await axios.get(`${GLOBAL.moduleFactory}?${cond}`);
}

async function getModuleFieldFactory(cond) {
  return await axios.get(`${GLOBAL.module}/fieldFactory?${cond}`);
}

async function getApplicationTitles(cond) {
  return await axios.get(`${GLOBAL.application}/titles?${cond}`);
}

async function getApplicationSearchs(cond) {
  return await axios.get(`${GLOBAL.application}/searchs?${cond}`);
}

async function getApplications(formData, cond) {
  const url = `${GLOBAL.application}/list?${cond}`;
  return await axios({ method: "post", url: url, data: formData, headers: { "Content-Type": "application/json" } });
}

async function postApplicationsAdd(formData, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}?applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "post", url: url, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putApplicationsEdit(formData, _id, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}?_id=${_id}&applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "put", url: url, data: formData });
}

async function delApplicationsDel(_id, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}?_id=${_id}&applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "delete", url: url });
}

async function delApplicationsDelBatch(_ids, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}/batch?_ids=${_ids}&applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "delete", url: url });
}

async function getApplicationsUploadTemplate(applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const cond = `applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios.get(`${GLOBAL.application}/upload/template?${cond}`, { responseType: 'blob' });
}

async function postApplicationsUpload(formData, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}/upload?applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "post", url: url, data: formData, headers: { "Content-Type": "multipart/form-data" } });
}

async function postApplicationsDownload(formData, applicationFactoryID, moduleFactoryID, fieldFactoryID) {
  const url = `${GLOBAL.application}/download?applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}`;
  return await axios({ method: "post", url: url, data: formData, headers: { "Content-Type": "application/json" }, responseType: 'blob' });
}

async function postApplicationRule(formData, applicationFactoryID, moduleFactoryID, fieldFactoryID, ruleID) {
  const url = `${GLOBAL.rule_bridge}?applicationFactoryID=${applicationFactoryID}&moduleFactoryID=${moduleFactoryID}&fieldFactoryID=${fieldFactoryID}&ruleID=${ruleID}`;
  return await axios({ method: "post", url: url, data: formData, headers: { "Content-Type": "application/json" } });
}

async function delApplicationRule(_id) {
  const url = `${GLOBAL.rule_bridge}?_id=${_id}`;
  return await axios({ method: "delete", url: url });
}

async function getApplicationRules(cond) {
  return await axios.get(`${GLOBAL.rule}`);
}

async function getCookie() {
  return await axios.get(`${GLOBAL.cookie}`);
}

async function putCookie(key, value) {
  const url = `${GLOBAL.cookie}?key=${key}&value=${value}`;
  return await axios({ method: "put", url: url });
}