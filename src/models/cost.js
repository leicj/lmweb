import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "cost",
  state: {
    // 模型名称
    names: [],
    // 所选择的名称
    selectName: "",
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    data: [],
    addVisible: false,
    editNameVisible: false,
    editData: {
      data: {},
      visible: false,
    },
    copyData: {
      copyName: "",
      visible: false,
    },
  },

  effects: {
    *listNames({ cb }, { select, call, put }) {
      try {
        const { data } = yield call(getCostNames);
        const selectName = yield select(state => state.cost.selectName);
        if (data.code == 0) {
          if (data.data.length > 0) {
            yield put({ type: "rnames", names: data.data });
            yield put({ type: "rselectName", selectName: selectName || data.data[0] });
          }
        }
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("获取模型名称有误！");
      }
    },
    *list({ name }, { select, call, put }) {
      try {
        const selectName = yield select(state => state.cost.selectName);
        name = name || selectName;
        const pagination = yield select(state => state.cost.pagination);
        const cond = `name=${name}&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getCosts, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: "rdata", data: data.data });
          yield put({ type: 'rpagination', pagination });
        }
      } catch (error) {
        console.error(error);
        message.error("获取模型数据有误！");
      }
    },
    *add({ name, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postCosts, name);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增模型数据有误！");
      }
    },
    *edit({ _id, formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putCosts, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑模型失败！");
      }
    },
    *editDisabed({ _id, disabled, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putCostsDisabled, disabled, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("禁用数据失败！");
      }
    },
    *del({ name, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delCosts, name);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除模型失败！");
      }
    },
    *copy({ copyName, name, cb }, { select, call, put }) {
      try {
        const { data } = yield call(copyCosts, copyName, name);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("复制模型失败！");
      }
    },
    *editName({ sourceName, name, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postCostsName, sourceName, name);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑模型名称失败！");
      }
    }
  },

  reducers: {
    rnames(state, { names }) { return { ...state, names } },
    rselectName(state, { selectName }) { return { ...state, selectName } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    rdata(state, { data }) { return { ...state, data } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditNameVisible(state, { visible }) { return { ...state, editNameVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
    rcopyData(state, { copyData }) { return { ...state, copyData } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/smart/cost') {
          dispatch({ type: "listNames", cb: () => dispatch({ type: "list" }) });
        }
      });
    },
  },
}

async function getCostNames() {
  return await axios.get(`${GLOBAL.costNames}`);
}

async function getCosts(cond) {
  return await axios.get(`${GLOBAL.cost}?${cond}`);
}

async function postCosts(name) {
  return await axios({ method: "post", url: `${GLOBAL.cost}?name=${name}` });
}

async function postCostsName(sourceName, name) {
  return await axios({ method: "put", url: `${GLOBAL.cost}/name?sourceName=${sourceName}&name=${name}` });
}

async function putCosts(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.cost}?_id=${_id}`, data: formData });
}

async function putCostsDisabled(disabled, _id) {
  return await axios({ method: "put", url: `${GLOBAL.cost}/disabled?_id=${_id}&disabled=${disabled}` });
}

async function delCosts(name) {
  return await axios({ method: "delete", url: `${GLOBAL.cost}?name=${name}` });
}

async function copyCosts(copyName, name) {
  return await axios({ method: "post", url: `${GLOBAL.cost}/copy?copyName=${copyName}&name=${name}` });
}