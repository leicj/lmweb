import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { MyTable } from '@/components/table';
import { Row, Button, Popconfirm, Segmented,Tag } from 'antd';
import MyAdd from './add';
import MyEdit from './edit';

@connect(({ engineeringLibrary }) => ({ engineeringLibrary }))
class EngineeringLibrary extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, engineeringLibrary, status } = this.props;
    const { data, engineerings, mapEngineering, pagination, addVisible, editData } = engineeringLibrary;
    const titles = ["序号", "名称", "工程方案", "操作"];
    const dataIndexs = ["index", "name", "engineeringids_name", "opr"];
    const widths = [100, 200, -1, 200];

    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "engineeringLibrary/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除方案(${d.name})`}
            description="删除方案不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "engineeringLibrary/del", _id: d._id, cb: () => dispatch({ type: "engineeringLibrary/list" }) });
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
    const indexStart = (pagination.pageIndex - 1) * pagination.pageSize;
    data.forEach((d, i, arr) => {
      d.index = indexStart + i + 1;
      d.engineeringids_name = d.engineeringids.map(_id => <Tag>{mapEngineering[_id]}</Tag>);
      d.opr = <Opr dispatch={dispatch} d={d} />
    });

    return (
      <>
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Segmented
            defaultValue={status}
            options={[{ label: "工程库", value: "0" }, { label: "工程方案库", value: "1" }]}
            onChange={status => {
              if (status=="0"){
                dispatch({ type: "engineering/list" });
              } else {
                dispatch({ type: "engineeringLibrary/list" });
                dispatch({ type: "engineeringLibrary/listEngineering" });
              }
              dispatch({ type: "engineering/rstatus", status });
            }}
          />
          <Button type="primary" style={{ marginLeft: 30 }} onClick={() => dispatch({ type: "engineeringLibrary/raddVisible", visible: true })}>新增工程方案</Button>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} widths={widths} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "engineeringLibrary/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "engineeringLibrary/list" });
            dispatch({ type: "engineeringLibrary/listEngineering" });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "engineeringLibrary/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "engineeringLibrary/list" });
            dispatch({ type: "engineeringLibrary/listEngineering" });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} engineerings={engineerings} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} engineerings={engineerings} mapEngineering={mapEngineering} /> : null}
      </>
    )
  }
}

export default EngineeringLibrary;
