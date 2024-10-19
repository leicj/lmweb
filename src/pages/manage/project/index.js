import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Popconfirm, Input } from 'antd';
import { MyTable } from '@/components/table';
import MyAdd from './add';

@connect(({ project }) => ({ project }))
class Project extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, project } = this.props;
    const { data, pagination, addVisible, editData,roadsectiondata } = project;
    const titles = ["项目名称", "路段档案", "检测年份", "委托方", "检测开始时间", "检测结束时间", "所属部门","项目负责人","检测人员","操作"];
    const dataIndexs = ["项目名称", "路段档案_格式化", "检测年份", "委托方", "检测开始时间", "检测结束时间", "所属部门","项目负责人","检测人员", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button disabled onClick={() => dispatch({ type: "project/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除项目(${d.路线名称})`}
            description="删除项目不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "project/del", Id: d.Id, cb: () => dispatch({ type: "project/list" }) });
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
    console.log("data:",data);
    console.log("roadsection:", roadsectiondata);
    data.forEach((d, i, arr) => {
      d['路段档案_格式化'] = d['路段档案'] && d['路段档案']['路段名称'];
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
                dispatch({ type: "project/list", where: `(项目名称,like,${v})` });
              }} placeholder='模糊匹配项目名称' style={{ width: 200 }} />
          </Col>
          <Col span={12}>
            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "project/raddVisible", visible: true })}>新增</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
            onChange={(current, pageSize) => {
              dispatch({ type: "project/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "project/list" });
            }}
            onShowSizeChange={(current, pageSize) => {
              dispatch({ type: "project/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "project/list" });
            }}
          />
        </Row>

        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} roadsectiondata={roadsectiondata} /> : null}
      </>
    );
  }
}

export default Project;