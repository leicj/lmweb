import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Popconfirm, Input } from 'antd';
import { MyTable } from '@/components/table';
import MyAdd from './add';

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
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button disabled onClick={() => dispatch({ type: "company/reditData", editData: { data: d, visible: true } })}>编辑</Button>
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
            <Button disabled={d['路段档案'] > 0} style={{ marginLeft: 5 }} danger>删除</Button>
          </Popconfirm>
        </>
      );
    }
    data.forEach((d, i, arr) => {
      d.opr = <Opr dispatch={dispatch} d={d} />;
    })
    return (
      <>
          <Row>
            <Col span={12}>
              <Input
                allowClear
                onChange={e => {
                  const v = e.target.value;
                  dispatch({type: "company/list", where: `(运营公司名称,like,${v})`});
                }} placeholder='模糊匹配运营公司名称' style={{width:200}} />
            </Col>
            <Col span={12}>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "company/raddVisible", visible: true })}>新增</Button>
            </Col>
          </Row>
          <br />
          <Row>
          <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
            onChange={(current, pageSize) => {
              dispatch({ type: "company/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "company/list" });
            }}
            onShowSizeChange={(current, pageSize) => {
              dispatch({ type: "company/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "company/list" });
            }}
          />
          </Row>
          
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
      </>
    );
  }
}

export default Company;