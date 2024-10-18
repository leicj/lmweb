import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "field",
  state: {
    // 字段管理
    allData: [], // 用于字段详情的下拉选择
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

    // 字段详情列表
    fieldData: [],
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
    selectFieldFactoryID: "",
    uploadVisible: false,

    linkEditData: {
      data: {},
      visible: false,
    },

    foreignKeyEditData: {
      data: {},
      visible: false,
    },

    // 插件配置
    ruleAddVisible: false,
    // 数据库唯一性设置
    uniqueEditData: {
      data: {},
      visible: false,
    },

    // 字段工厂：1，字段详情：2
    selectTable: "1",
  },
  effects: {
    // 字段管理
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.field.pagination);
        let cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getFieldFactorys, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
          if (data.data.length > 0) {
            yield put({ type: 'rselectFieldFactoryID', selectFieldFactoryID: data.data[0]._id });
          }
        } else {
          console.error(data.message);
        }
        // 获取所有数据，用于字段详情的下拉筛选
        cond = `pageIndex=1&pageSize=9999`;
        const r = yield call(getFieldFactorys, cond);
        if (r.data.code == 0 && r.data.data.length > 0) {
          yield put({ type: 'rallData', allData: r.data.data });
        }
      } catch (error) {
        console.error(error);
        message.error("获取字段工厂列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postFieldFactorysAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增字段工厂失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putFieldFactorysEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑字段工厂失败！");
      }
    },
    *del({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delFieldFactorysDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除字段工厂失败！");
      }
    },

    // 字段详情管理
    *fieldList({ fieldFactoryID }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.field.fieldPagination);
        const selectFieldFactoryID = yield select(state => state.field.selectFieldFactoryID);
        fieldFactoryID = fieldFactoryID || selectFieldFactoryID;
        const cond = `fieldFactoryID=${fieldFactoryID}&pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getFields, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rfieldData', fieldData: data.data });
          yield put({ type: 'rfieldPagination', fieldPagination: pagination });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取字段列表失败！");
      }
    },
    *fieldAdd({ formData, cb }, { select, call, put }) {
      try {
        const selectFieldFactoryID = yield select(state => state.field.selectFieldFactoryID);
        if (selectFieldFactoryID == "") {
          message.error("字段工厂ID为空！无法新增");
          return;
        }
        formData['fieldFactoryID'] = selectFieldFactoryID;
        const { data } = yield call(postFieldsAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增字段失败！");
      }
    },
    *fieldEdit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putFieldsEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑字段失败！");
      }
    },
    *fieldDel({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(delFieldsDel, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除字段失败！");
      }
    },
    *upload({ formData, cb }, { select, call, put }) {
      try {
        const selectFieldFactoryID = yield select(state => state.field.selectFieldFactoryID);
        const { data } = yield call(postFieldsUpload, selectFieldFactoryID, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("上传数据有误！");
      }
    },
    *linkEdit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putLinkEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑字段组合失败！");
      }
    },
    *foreignKeyEdit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putForeignKeyEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("编辑字段组合失败！");
      }
    },
    *ruleAdd({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postRulesAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增字段规则失败！");
      }
    },
    *uniqueEdit({ formData, _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(putFieldUniqueEdit, formData, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("设置唯一性失败！");
      }
    },
  },

  reducers: {
    rallData(state, { allData }) { return { ...state, allData } },
    rdata(state, { data }) { return { ...state, data } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
    rselectFieldFactoryID(state, { selectFieldFactoryID }) { return { ...state, selectFieldFactoryID } },

    rfieldData(state, { fieldData }) { return { ...state, fieldData } },
    rfieldPagination(state, { fieldPagination }) { return { ...state, fieldPagination } },
    rfieldAddVisible(state, { visible }) { return { ...state, fieldAddVisible: visible } },
    rfieldEditData(state, { fieldEditData }) { return { ...state, fieldEditData } },
    ruploadVisible(state, { visible }) { return { ...state, uploadVisible: visible } },

    rlinkEditData(state, { linkEditData }) { return { ...state, linkEditData } },
    rforeignKeyEditData(state, { foreignKeyEditData }) { return { ...state, foreignKeyEditData } },
    rruleAddVisible(state, { visible }) { return { ...state, ruleAddVisible: visible } },
    runiqueEditData(state, { uniqueEditData }) { return { ...state, uniqueEditData } },

    rselectTable(state, { selectTable }) { return { ...state, selectTable } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/base/fieldFactory') {
          dispatch({ type: "list" });
          // 初始化值
          dispatch({ type: "rselectTable", selectTable: "1" });
        }
      });
    },
  },
}

async function getFieldFactorys(cond) {
  return await axios.get(`${GLOBAL.fieldFactory}?${cond}`);
}

async function postFieldFactorysAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.fieldFactory}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putFieldFactorysEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.fieldFactory}?_id=${_id}`, data: formData });
}

async function delFieldFactorysDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.fieldFactory}?_id=${_id}` });
}

async function getFields(cond) {
  return await axios.get(`${GLOBAL.field}?${cond}`);
}

async function postFieldsAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.field}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putFieldsEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.field}?_id=${_id}`, data: formData });
}

async function delFieldsDel(_id) {
  return await axios({ method: "delete", url: `${GLOBAL.field}?_id=${_id}` });
}

async function postFieldsUpload(fieldFactoryID, formData) {
  return await axios({ method: "post", url: `${GLOBAL.field}/upload?fieldFactoryID=${fieldFactoryID}`, data: formData, headers: { "Content-Type": "multipart/form-data" } });
}

async function putLinkEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.field}/link?_id=${_id}`, data: formData });
}

async function putForeignKeyEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.field}/foreignKey?_id=${_id}`, data: formData });
}

async function postRulesAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.rule}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function putFieldUniqueEdit(formData, _id) {
  return await axios({ method: "put", url: `${GLOBAL.fieldFactory}/unique?_id=${_id}`, data: formData });
}