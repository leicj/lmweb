import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Popconfirm, Input } from 'antd';
import { MyTable } from '@/components/table';
import MyAdd from './add';

@connect(({ road }) => ({ road }))
class Road extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, road } = this.props;
    const { data, pagination, addVisible, editData } = road;
    const titles = ["路线编码", "序号", "路线名称", "路线技术等级", "路线行政等级", "路面类型", "操作"];
    const dataIndexs = ["路线编码", "序号", "路线名称", "路线技术等级", "路线行政等级", "路面类型", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button disabled onClick={() => dispatch({ type: "road/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除路线(${d.路线名称})`}
            description="删除路线不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "road/del", Id: d.Id, cb: () => dispatch({ type: "road/list" }) });
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
                dispatch({ type: "road/list", where: `(路线名称,like,${v})` });
              }} placeholder='模糊匹配路线名称' style={{ width: 200 }} />
          </Col>
          <Col span={12}>
            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "road/raddVisible", visible: true })}>新增</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
            onChange={(current, pageSize) => {
              dispatch({ type: "road/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "road/list" });
            }}
            onShowSizeChange={(current, pageSize) => {
              dispatch({ type: "road/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "road/list" });
            }}
          />
        </Row>

        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
      </>
    );
  }
}

export default Road;