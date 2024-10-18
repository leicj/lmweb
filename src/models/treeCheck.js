import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';
import DownloadFile from '../components/download';

export default {
  namespace: "treeCheck",
  state: {
    // 决策树列表
    treeData: [],
    // 决策树模型ID
    treeID: 0,
    // 模型数据名称
    names: [],
    // 所选择的模型数据
    selectName: "",
    uploadVisible: false,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    pqiData: [],

    // 费用模型
    costNames: [],
    selectCostName: "",

    // 验证结果
    resultData: [],
    resultPagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },

    selectTable: "1",
  },

  effects: {
    *treeList({ }, { select, call, put }) {
      try {
        const { data } = yield call(gettrees);
        const treeID = yield select(state => state.treeCheck.treeID);
        if (data.code == 0) {
          data.data.forEach(d => {
            d.tree = JSON.parse(d.tree);
          })
          if (data.data.length > 0) {
            yield put({ type: "rtreeID", treeID: treeID || data.data[0]._id });
            yield put({ type: "rtreeData", treeData: data.data });
          }
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取对策模型列表失败！");
      }
    },
    *checkNames({ cb }, { select, call, put }) {
      try {
        const { data } = yield call(gettreeCheckNames);
        let { selectName } = yield select(state => state.treeCheck.selectName);
        if (data.code == 0) {
          if (data.data.length > 0) {
            selectName = data.data[0];
            yield put({ type: "rnames", names: data.data });
            yield put({ type: "rselectName", selectName });
          }
        }
        cb && cb(selectName);
      } catch (error) {
        console.error(error);
        message.error("获取模型验证名称有误！");
      }
    },
    *checkList({ name }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.treeCheck.pagination);
        const { selectName } = yield select(state => state.treeCheck.selectName);
        name = name || selectName;
        const cond = `name=${name}&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(gettreeChecks, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: "rpqiData", pqiData: data.data });
          yield put({ type: 'rpagination', pagination });
        }
      } catch (error) {
        console.error(error);
        message.error("获取模型数据有误！");
      }
    },
    *checkDel({ name, cb }, { select, call, put }) {
      try {
        const { data } = yield call(deltreeChecks, name);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除模型数据有误！");
      }
    },
    *checkUpload({ name, sheetName, formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(posttreeChecksUpload, name, sheetName, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("上传模型数据有误！");
      }
    },
    *checkData({ name, treeID, costName, cb }, { select, call, put }) {
      try {
        const { data } = yield call(posttreeChecks, name, treeID, costName);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("验证数据有误！");
      }
    },
    // 费用模型名称
    *listCostNames({ cb }, { select, call, put }) {
      try {
        const { data } = yield call(getCostNames);
        const selectCostName = yield select(state => state.treeCheck.selectCostName);
        if (data.code == 0) {
          if (data.data.length > 0) {
            yield put({ type: "rcostNames", costNames: data.data });
            yield put({ type: "rselectCostName", selectCostName: selectCostName || data.data[0] });
          }
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取费用模型名称有误！");
      }
    },
    // 获取验证数据
    *listResultData({ name, treeID, cb }, { select, call, put }) {
      try {
        const resultPagination = yield select(state => state.treeCheck.resultPagination);
        const cond = `name=${name}&treeID=${treeID}&pageIndex=${resultPagination.pageIndex}&pageSize=${resultPagination.pageSize}`;
        const { data } = yield call(gettreeCheckResults, cond);
        if (data.code == 0) {
          resultPagination.total = data.total;
          yield put({ type: "rresultData", resultData: data.data });
          yield put({ type: 'rresultPagination', resultPagination });
        } else {
          console.error(error);
          message.error("获取验证结果数据有误！");
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取验证数据有误！");
      }
    },
    *download({name,treeID},{select,call,put}){
      try{
        const {data}=yield call(posttreeCheckResultsDownload, name, treeID);
        DownloadFile(data, `${name}.xlsx`);
      } catch(error) {
        console.error(error);
        message.error("批量导出数据失败！");
      }
    }
  },

  reducers: {
    rtreeData(state, { treeData }) { return { ...state, treeData } },
    rtreeID(state, { treeID }) { return { ...state, treeID } },
    rnames(state, { names }) { return { ...state, names } },
    rselectName(state, { selectName }) { return { ...state, selectName } },
    ruploadVisible(state, { visible }) { return { ...state, uploadVisible: visible } },
    rpqiData(state, { pqiData }) { return { ...state, pqiData } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    rcostNames(state, { costNames }) { return { ...state, costNames } },
    rselectCostName(state, { selectCostName }) { return { ...state, selectCostName } },
    rresultData(state, { resultData }) { return { ...state, resultData } },
    rresultPagination(state, { resultPagination }) { return { ...state, resultPagination } },
    rselectTable(state, { selectTable }) { return { ...state, selectTable } },
  }
}

async function gettrees() {
  return await axios.get(`${GLOBAL.tree}`);
}

async function gettreeCheckNames() {
  return await axios.get(`${GLOBAL.treeCheck}/names`);
}

async function gettreeChecks(cond) {
  return await axios.get(`${GLOBAL.treeCheck}?${cond}`);
}

async function deltreeChecks(name) {
  return await axios({ method: "delete", url: `${GLOBAL.treeCheck}?name=${name}` });
}

async function posttreeChecks(name, treeID, costName) {
  return await axios({ method: "post", url: `${GLOBAL.treeCheck}/data?name=${name}&treeID=${treeID}&costName=${costName}` });
}

async function posttreeChecksUpload(name, sheetName, formData) {
  return await axios({ method: "post", url: `${GLOBAL.treeCheck}?name=${name}&sheetName=${sheetName}`, data: formData, headers: { "Content-Type": "multipart/form-data" } });
}

async function getCostNames() {
  return await axios.get(`${GLOBAL.costNames}`);
}

async function gettreeCheckResults(cond) {
  return await axios.get(`${GLOBAL.treeCheck}/data?${cond}`);
}

async function posttreeCheckResultsDownload(name, treeID) {
  const url = `${GLOBAL.treeCheck}/data/download?name=${name}&treeID=${treeID}`;
  return await axios({ method: "post", url: url, headers: { "Content-Type": "application/json" }, responseType: 'blob' });
}