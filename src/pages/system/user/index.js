import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, Tag, Popconfirm } from 'antd';
import { MyTable } from '@/components/table';
import MyAdd from './add';
import MyEditDB from './editDB';

@connect(({ user }) => ({ user }))
class User extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, user } = this.props;
    const { data, pagination, addVisible, editDB } = user;
    const titles = ["用户名", "用户DB", "操作"];
    const dataIndexs = ["username", "db", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "user/reditDB", editDB: { data: d, visible: true } })}>
            设置数据库
          </Button>
          <Popconfirm
            title={`重置用户(${d.username})密码`}
            description="确定重置用户密码？"
            onConfirm={() => {
              dispatch({ type: "user/resetpwd", _id: d._id });
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <Button style={{ marginLeft: 5 }} danger>重置密码</Button>
          </Popconfirm>
        </>
      );
    }
    data.forEach(d => {
      d.opr = <Opr dispatch={dispatch} d={d} />;
    });

    return (
      <>
        <Row>
          <Button onClick={() => dispatch({ type: "user/raddVisible", visible: true })}>新增</Button>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "user/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "user/list" });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "user/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "user/list" });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editDB.visible ? <MyEditDB dispatch={dispatch} visible={editDB.visible} data={editDB.data} /> : null}
      </>
    );
  }
}

export default User;