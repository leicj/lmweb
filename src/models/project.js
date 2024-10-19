import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';
import { getRoadsections } from '@/models/roadsection';

export default {
  namespace: "project",
  state: {
    data: [],
    roadsectiondata: [],
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
        const pagination = yield select(state => state.project.pagination);
        const params = { offset: (pagination.pageIndex - 1) * pagination.pageSize, limit: pagination.pageSize, where: where };
        const { data } = yield call(getProjects, params);
        yield put({ type: "rdata", data: data.list });
        yield put({ type: "rpagination", pagination: { ...pagination, total: data.pageInfo.totalRows } });
      } catch (error) {
        console.error(error);
        message.error("获取项目列表失败！");
      }
    },
    *roadsectionlist({ }, { select, call, put }) {
      try {
        const params = { offset: 0, limit: 1000 };
        const { data } = yield call(getRoadsections, params);
        yield put({ type: "rroadsectiondata", roadsectiondata: data.list });
      } catch (error) {
        console.error(error);
        message.error("获取路段列表失败！");
      }
    },
    *add({ body, cb }, { select, call, put }) {
      try {
        const { data } = yield call(addProject, body);
        yield call(addProjectRoadsectionlink, data.Id, [{"Id": body["路段档案"]}]);
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
        const { data } = yield call(delProject, body);
        console.log(data);
        cb && cb();
      } catch (error) {
        console.error(error);
        message.error("删除项目失败！");
      }
    },
  },
  reducers: {
    rdata(state, { data }) { return { ...state, data } },
    rroadsectiondata(state, { roadsectiondata }) { return { ...state, roadsectiondata } },
    rpagination(state, { pagination }) { return { ...state, pagination } },
    raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
    reditData(state, { editData }) { return { ...state, editData } },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ location, action }) => {
        if (location.pathname == '/manage/project') {
          dispatch({ type: "roadsectionlist" });
          dispatch({ type: "list" });
        }
      })
    }
  }
}

async function getProjects(params) {
  const options = {
    method: 'GET',
    url: `${GLOBAL.project}`,
    params: params,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function addProject(body) {
  const options = {
    method: 'POST',
    url: `${GLOBAL.project}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function addProjectRoadsectionlink(recordId,body) {
  const options = {
    method: 'POST',
    url: `${GLOBAL.projectroadsectionlink}/${recordId}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}

async function delProject(body) {
  const options = {
    method: 'DELETE',
    url: `${GLOBAL.project}`,
    data: body,
    headers: {
      'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
    }
  }
  return await axios.request(options);
}