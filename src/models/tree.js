import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "tree",
  state: {
    data: [],
    jm: '',
    // 选中的模型ID
    selectID: "",
    // 选中的叶子节点
    selectNode: {
      visible: false,
      node: {},
    },
    // 病害诊断结果
    diseaseCheckResult: [],
    // 工程方案库
    engineeringLibrary: [],
    // 对策库
    category: [],
    // 展开节点层数
    level: 1,
  },

  effects: {
    *list({ }, { select, call, put }) {
      try {
        const { data } = yield call(getTrees);
        const selectID = yield select(state => state.tree.selectID);
        if (data.code == 0) {
          data.data.forEach(d => {
            d.tree = JSON.parse(d.tree);
          })
          if (data.data.length > 0) {
            yield put({ type: "rselectID", selectID: selectID || data.data[0]._id });
            yield put({ type: "rdata", data: data.data });
          }
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取决策树列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postTrees, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增决策树失败！");
      }
    },
    *edit({ _id, formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putTrees, _id, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑决策树失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delTrees, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除决策树失败！");
      }
    },
    *copy({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(copyTrees, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("复制决策树失败！");
      }
    },
    // 获取病害诊断结果
    *listDiseaseCheckResult({ }, { select, call, put }) {
      try {
        const cond = 'pageIndex=1&pageSize=99999';
        const { data } = yield call(getDiseaseCheckResults, cond);
        if (data.code == 0) {
          yield put({ type: 'rdiseaseCheckResult', diseaseCheckResult: data.data });
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取病害诊断结果列表失败！");
      }
    },
    // 获取工程方案
    *listEngineeringLibrary({ }, { select, call, put }) {
      try {
        const cond = 'pageIndex=1&pageSize=99999';
        const { data } = yield call(getEngineeringLibrarys, cond);
        if (data.code == 0) {
          yield put({ type: 'rengineeringLibrary', engineeringLibrary: data.data });
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取工程方案列表失败！");
      }
    },
    // 获取对策库
    *listCategory({ }, { select, call, put }) {
      try {
        const cond = 'pageIndex=1&pageSize=99999';
        const { data } = yield call(getcategorys, cond);
        if (data.code == 0) {
          yield put({ type: 'rcategory', category: data.data });
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取对策列表失败！");
      }
    },
    *addNode({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postTreeNodes, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增决策树对策失败！");
      }
    },
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rjm(state, { jm }) { return { ...state, jm } },
    rselectID(state, { selectID }) { return { ...state, selectID } },
    rselectNode(state, { selectNode }) { return { ...state, selectNode } },
    rdiseaseCheckResult(state, { diseaseCheckResult }) { return { ...state, diseaseCheckResult } },
    rengineeringLibrary(state, { engineeringLibrary }) { return { ...state, engineeringLibrary } },
    rcategory(state, { category }) { return { ...state, category } },
    rlevel(state, { level }) { return { ...state, level } },
  }
}

async function getTrees() {
  return await axios.get(`${GLOBAL.tree}`);
}

async function postTrees(formData) {
  return await axios({ method: "post", url: `${GLOBAL.tree}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putTrees(_id, formData) {
  return await axios({ method: "put", url: `${GLOBAL.tree}?_id=${_id}`, data: formData });
}

async function delTrees(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.tree}?_id=${_id}` });
}

async function copyTrees(_id) {
  return await axios({ method: "post", url: `${GLOBAL.tree}/copy?_id=${_id}` });
}

async function getDiseaseCheckResults(cond) {
  return await axios.get(`${GLOBAL.diseaseCheckResult}?${cond}`);
}

async function getEngineeringLibrarys(cond) {
  return await axios.get(`${GLOBAL.engineeringLibrary}?${cond}`);
}

async function getcategorys(cond) {
  return await axios.get(`${GLOBAL.category}?${cond}`);
}

async function postTreeNodes(formData) {
  return await axios({ method: "post", url: `${GLOBAL.treeNode}`, data: formData, headers: { "Content-Type": "application/json" } });
}
