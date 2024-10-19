import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Popconfirm, Input } from 'antd';
import { MyTable } from '@/components/table';
import {stakeFormat} from '@/components/help';
import MyAdd from './add';

@connect(({ roadsection }) => ({ roadsection }))
class Roadsection extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, roadsection } = this.props;
    const { data, pagination, addVisible, editData,roaddata,companydata } = roadsection;
    const titles = ["路段名称", "路线档案", "运营公司", "序号", "巡检办", "建设期路段名称", "起点桩号", "终点桩号","里程长度","通车时间","缺陷责任期结束时间","竣工验收时间","路段收费性质","车道数量","操作"];
    const dataIndexs = ["路段名称", "路线档案_格式化", "运营公司", "序号", "巡检办", "建设期路段名称", "起点桩号_格式化", "终点桩号_格式化","里程长度","通车时间","缺陷责任期结束时间","竣工验收时间","路段收费性质","车道数量","opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button disabled onClick={() => dispatch({ type: "roadsection/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除路段(${d.路段名称})`}
            description="删除路段不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "roadsection/del", Id: d.Id, primaryKey: d["路段名称"], cb: () => dispatch({ type: "roadsection/list" }) });
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
    data.forEach((d, i, arr) => {
      d['起点桩号_格式化'] = stakeFormat(d['起点桩号']);
      d['终点桩号_格式化'] = stakeFormat(d['终点桩号']);
      d['路线档案_格式化'] = d["路线档案"] && d["路线档案"]["路线编码"];
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
                  dispatch({type: "roadsection/list", where: `(路段名称,like,${v})`});
                }} placeholder='模糊匹配路段名称' style={{width:200}} />
            </Col>
            <Col span={12}>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "roadsection/raddVisible", visible: true })}>新增</Button>
            </Col>
          </Row>
          <br />
          <Row>
          <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
            onChange={(current, pageSize) => {
              dispatch({ type: "roadsection/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "roadsection/list" });
            }}
            onShowSizeChange={(current, pageSize) => {
              dispatch({ type: "roadsection/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
              dispatch({ type: "roadsection/list" });
            }}
          />
          </Row>
          
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} roaddata={roaddata} companydata={companydata} /> : null}
      </>
    );
  }
}

export default Roadsection;