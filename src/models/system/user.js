import axios from 'axios';
import GLOBAL from '../index';
import { message } from 'antd';

export default {
  namespace: "user",
  state: {
    data: [],
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0
    },
    addVisible: false,
    editDB: {
      data: {},
      visible: false,
    },
  },

  effects: {
    *list({ }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.user.pagination);
        let cond = `pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`;
        const { data } = yield call(getUsers, cond);
        if (data.code == 0) {
          pagination.total = data.total;
          yield put({ type: 'rdata', data: data.data });
          yield put({ type: 'rpagination', pagination: pagination });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
        message.error("获取用户列表失败！");
      }
    },
    *add({ formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postUsersAdd, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("新增用户失败！");
      }
    },
    *resetpwd({ _id, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postUsersResetPwd, _id);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("重置密码失败！");
      }
    },
    *editDB({ _id, formData, cb }, { select, call, put }) {
      try {
        const { data } = yield call(postUsersAddDb, _id, formData);
        data.code == 0 ? message.success(data.message) : message.error(data.message);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("设置用户DB失败！");
      }
    }
  },

  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditDB(state, { editDB }) { return { ...state, editDB } },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/system/user') {
          dispatch({ type: "list" });
        }
      });
    },
  },
}

async function getUsers(cond) {
  return await axios.get(`${GLOBAL.user}?${cond}`);
}

async function postUsersAdd(formData) {
  return await axios({ method: "post", url: `${GLOBAL.user}`, data: formData, headers: { "Content-Type": "application/json" } });
}

async function postUsersResetPwd(_id) {
  return await axios({ method: "post", url: `${GLOBAL.user}/reset/pwd?_id=${_id}` });
}

async function postUsersAddDb(_id, formData) {
  return await axios({ method: "post", url: `${GLOBAL.user}/db?_id=${_id}`, data: formData, headers: { "Content-Type": "application/json" } });
}