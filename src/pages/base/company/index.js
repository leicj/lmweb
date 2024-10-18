import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, Tag, Popconfirm } from 'antd';
import { mapFORMATKV } from '@/constants/index';
import { tsFormat } from '@/components/help';
import { MyTable } from '@/components/table';
import { AppstoreOutlined, BarsOutlined, QuestionCircleOutlined } from '@ant-design/icons';

@connect(({ company }) => ({ company }))
class Company extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, company } = this.props;
    const { data, pagination, addVisible, editData } = company;
    const titles = ["序号", "运营公司名称", "运营公司简称", "资产属性", "联系人", "联系人手机号", "创建人", "操作"];
    const dataIndexs = ["序号", "运营公司名称", "运营公司简称", "资产属性", "联系人", "联系人手机号", "创建人", "opr"];
    console.log(data, "??")
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "module/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除公司(${d.运营公司名称})`}
            description="删除运营公司不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "company/del", Id: d.Id, primaryKey: d["运营公司名称"], cb: () => dispatch({ type: "company/list" }) });
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <Button style={{ marginLeft: 5 }} danger>删除</Button>
          </Popconfirm>
        </>
      );
    }
    data.forEach((d,i,arr)=>{
      d.opr = <Opr dispatch={dispatch} d={d} />;
    })
    return (
      <Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination} />
      </Row>
    );
  }
}

export default Company;