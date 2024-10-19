import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
    namespace: "company",
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
                const pagination = yield select(state => state.company.pagination);
                const params = { offset: (pagination.pageIndex - 1) * pagination.pageSize, limit: pagination.pageSize, where: where };
                const { data } = yield call(getCompanys, params);
                yield put({ type: "rdata", data: data.list });
                yield put({ type: "rpagination", pagination: { ...pagination, total: data.pageInfo.totalRows } });
            } catch (error) {
                console.error(error);
                message.error("获取公司列表失败！");
            }
        },
        *add({ body, cb }, { select, call, put }) {
            try {
                const { data } = yield call(addCompany, body);
                console.log(data);
                cb && cb();
            } catch (error) {
                console.error(error);
                message.error("添加公司失败！");
            }
        },
        *edit({ formData, _id, cb }, { select, call, put }) {

        },
        *del({ Id, primaryKey, cb }, { select, call, put }) {
            try {
                const body = { Id: Id, "运营公司名称": primaryKey };
                const { data } = yield call(delCompany, body);
                console.log(data);
                cb && cb();
            } catch (error) {
                console.error(error);
                message.error("删除公司失败！");
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
                console.log("location:", location);
                if (location.pathname == '/base/company') {
                    dispatch({ type: "list" });
                }
            })
        }
    }
}

export async function getCompanys(params) {
    const options = {
        method: 'GET',
        url: `${GLOBAL.company}`,
        params: params,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}

async function addCompany(body) {
    const options = {
        method: 'POST',
        url: `${GLOBAL.company}`,
        data: body,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}

async function delCompany(body) {
    const options = {
        method: 'DELETE',
        url: `${GLOBAL.company}`,
        data: body,
        headers: {
            'xc-token': 'oSdkvGEQtAIfozfrFygGL9q0vJjC7iNYNKQ6x9G1'
        }
    }
    return await axios.request(options);
}