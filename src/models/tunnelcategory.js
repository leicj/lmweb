import axios from 'axios';
import GLOBAL from './index';
import { message } from 'antd';

export default {
  namespace: "tunnelCategory",
  state: {
  },

  effects: {
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
        if (location.pathname == '/tunnelsmart/category') {
        }
      });
    },
  },
}
