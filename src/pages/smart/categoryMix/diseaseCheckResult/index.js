import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { MyTable } from '@/components/table';
import { Row, Button, Popconfirm, Tag, Checkbox } from 'antd';
import { COLORS } from '@/constants/index';
import MyAdd from './add';
import MyEdit from './edit';

@connect(({ diseaseCheckResult }) => ({ diseaseCheckResult }))
class DiseaseCheckResult extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, diseaseCheckResult } = this.props;
    const { data, tags, pagination, addVisible, editData } = diseaseCheckResult;
    const titles = ["序号", "名称", "标签", "操作"];
    const dataIndexs = ["index", "name", "tags_name", "opr"];

    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "diseaseCheckResult/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除病害诊断结果(${d.name})`}
            description="删除病害诊断结果不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "diseaseCheckResult/del", _id: d._id, cb: () => dispatch({ type: "diseaseCheckResult/list" }) });
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

    const mapTagColor = {};
    tags.forEach((t, i, arr) => {
      mapTagColor[t] = COLORS[i%COLORS.length];
    });

    const indexStart = (pagination.pageIndex-1) * pagination.pageSize;
    data.forEach((d, i, arr) => {
      d.index = indexStart + i + 1;
      d.tags_name = d.tags.map((t, i, arr) => <Tag color={mapTagColor[t]}>{t}</Tag>)
      d.opr = <Opr dispatch={dispatch} d={d} />
    });

    return (
      <>
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Button type="primary" style={{ marginLeft: 30 }} onClick={() => dispatch({ type: "diseaseCheckResult/raddVisible", visible: true })}>新增工程</Button>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "diseaseCheckResult/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "diseaseCheckResult/list" });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "diseaseCheckResult/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "diseaseCheckResult/list" });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
      </>
    )
  }
}

export default DiseaseCheckResult;
