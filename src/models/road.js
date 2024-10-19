import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
    namespace: "road",
    state: {
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
    },
    effects: {
        *list({ where }, { select, call, put }) {
            try {
                const pagination = yield select(state => state.road.pagination);
                const params = { offset: (pagination.pageIndex - 1) * pagination.pageSize, limit: pagination.pageSize, where: where };
                const { data } = yield call(getRoads, params);
                yield put({ type: "rdata", data: data.list });
                yield put({ type: "rpagination", pagination: { ...pagination, total: data.pageInfo.totalRows } });
            } catch (error) {
                console.error(error);
                message.error("获取路线列表失败！");
            }
        },
        *add({ body, cb }, { select, call, put }) {
            try {
                const { data } = yield call(addRoad, body);
                console.log(data);
                cb && cb();
            } catch (error) {
                console.error(error);
                message.error("添加路线失败！");
            }
        },
        *edit({ formData, _id, cb }, { select, call, put }) {

        },
        *del({ Id, cb }, { select, call, put }) {
            try {
                const body = { Id: Id };
                const { data } = yield call(delRoad, body);
                console.log(data);
                cb && cb();
            } catch (error) {
                console.error(error);
                message.error("删除路线失败！");
            }
        },
    },
    reducers: {
        rdata(state, { data }) { return { ...state, data } },
        rpagination(state, { pagination }) { return { ...state, pagination } },
        raddVisible(state, { visible }) { return { ...state, addVisible: visible } },
        reditData(state, { editData }) { return { ...state, editData } },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ location, action }) => {
                if (location.pathname == '/base/road') {
                    dispatch({ type: "list" });
                }
            })
        }
    }
}

async function getRoads(params) {
    const options = {
        method: 'GET',
        url: `${GLOBAL.road}`,
        params: params,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}

async function addRoad(body) {
    const options = {
        method: 'POST',
        url: `${GLOBAL.road}`,
        data: body,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}

async function delRoad(body) {
    const options = {
        method: 'DELETE',
        url: `${GLOBAL.road}`,
        data: body,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}