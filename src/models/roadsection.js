import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';
import { getRoads } from '@/models/road';
import { getCompanys } from '@/models/company';

export default {
  namespace: "roadsection",
  state: {
    data: [],
    roaddata: [],
    companydata: [],
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
    *list({ where }, { select, call, put }) {
      try {
        const pagination = yield select(state => state.roadsection.pagination);
        const params = { offset: (pagination.pageIndex - 1) * pagination.pageSize, limit: pagination.pageSize, where: where };
        const { data } = yield call(getRoadsections, params);
        yield put({ type: "rdata", data: data.list });
        yield put({ type: "rpagination", pagination: { ...pagination, total: data.pageInfo.totalRows } });
      } catch (error) {
        console.error(error);
        message.error("获取路段列表失败！");
      }
    },
    *roadlist({ }, { select, call, put }) {
      try {
        const params = { offset: 0, limit: 1000 };
        const { data } = yield call(getRoads, params);
        yield put({ type: "rroaddata", roaddata: data.list });
      } catch (error) {
        console.error(error);
        message.error("获取路线列表失败！");
      }
    },
    *companylist({ }, { select, call, put }) {
      try {
        const params = { offset: 0, limit: 1000 };
        const { data } = yield call(getCompanys, params);
        yield put({ type: "rcompanydata", companydata: data.list });
      } catch (error) {
        console.error(error);
        message.error("获取公司列表失败！");
      }
    },
    *add({ body, cb }, { select, call, put }) {
      try {
        const { data } = yield call(addRoadsection, body);
        yield call(addRoadsectionRoadlink, data.Id, [{"Id": body["路线档案"]}]);
        // yield call(addRoadsectionCompanylink, data.Id, [{"Id": body["运营公司"]}]);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("添加路段失败！");
      }
    },
    *edit({ formData, _id, cb }, { select, call, put }) {

    },
    *del({ Id, cb }, { select, call, put }) {
      try {
        const body = { Id: Id };
        const { data } = yield call(delRoadsection, body);
        console.log(data);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除路段失败！");
      }
    },
  },
  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rroaddata(state, { roaddata }) { return { ...state, roaddata } },
    rcompanydata(state, { companydata }) { return { ...state, companydata } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/base/roadsection') {
          dispatch({ type: "roadlist" });
          dispatch({ type: "companylist" });
          dispatch({ type: "list" });
        }
      })
    }
  }
}

async function getRoadsections(params) {
  const options = {
    method: 'GET',
    url: `${GLOBAL.roadsection}`,
    params: params,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function addRoadsection(body) {
  const options = {
    method: 'POST',
    url: `${GLOBAL.roadsection}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function addRoadsectionRoadlink(recordId,body) {
  const options = {
    method: 'POST',
    url: `${GLOBAL.roadsectionroadlink}/${recordId}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function addRoadsectionCompanylink(recordId,body) {
  const options = {
    method: 'POST',
    url: `${GLOBAL.roadsectioncompanylink}/${recordId}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function delRoadsection(body) {
  const options = {
    method: 'DELETE',
    url: `${GLOBAL.roadsection}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}