import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, message, Popconfirm, Switch } from 'antd';
import MyAdd from './add';
import MyEdit from './edit';
import MyCopy from './copy';
import MyEditName from './editName';
import { mapUNITSKV } from '@/constants/index';
import { MyTable } from '@/components/table';

@connect(({ cost }) => ({ cost }))
class Cost extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, cost } = this.props;
    const { names, selectName, pagination, data, addVisible, editNameVisible, editData, copyData } = cost;

    const titles = ["序号", "名称", "单位", "单价(元)", "宽度(m)", "厚度(cm)", "标签", "操作"];
    const dataIndexs = ["index", "engineeringName", "unit_name", "price", "width_name", "depth_name", "tags", "opr"];

    const Opr = ({ dispatch, d }) => {
      return <>
        <Button style={{ marginRight: 20 }} onClick={() => dispatch({ type: "cost/reditData", editData: { data: d, visible: true } })}>编辑</Button>
        <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={d.disabled != "1"} onChange={e => {
          dispatch({
            type: "cost/editDisabed", _id: d._id, disabled: e ? "" : "1", cb: () => {
              dispatch({ type: "cost/list", name: selectName });
            }
          })
        }} />
      </>
    }
    const indexStart = (pagination.pageIndex-1) * pagination.pageSize;
    data.forEach((d, i, arr) => {
      d.index = indexStart + i + 1;
      d.unit_name = mapUNITSKV[d.unit];
      d.opr = <Opr dispatch={dispatch} d={d} />;
      d.width_name = d.unit == "m" ? "/" : d.width;
      d.depth_name = (d.unit == "m" || d.unit == "㎡") ? "/" : d.depth;
    });

    const selectOptions = names.map(name => ({ "label": name, "value": name }));
    return (
      <>
        <Row style={{ width: "100%" }}>
          <Col span={16}>
            <Select options={selectOptions} style={{ width: 250 }} value={selectName} onChange={e => {
              dispatch({ type: "cost/rselectName", selectName: e });
              dispatch({ type: "cost/list", name: e });
            }} />
          </Col>
          <Col span={8}>
            <Button style={{ marginLeft: 10 }} onClick={() => {
              dispatch({ type: "cost/raddVisible", visible: true });
            }}>新增模型</Button>
            <Button style={{marginLeft: 10}} onClick={()=>{
              dispatch({ type: "cost/reditNameVisible", visible: true });
            }}>编辑模型</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => {
              dispatch({ type: "cost/rcopyData", copyData: { copyName: selectName, visible: true } });
            }}>复制模型</Button>
            <Popconfirm
              title={`删除当前模型`}
              description="删除模型不可恢复！确定删除？"
              onConfirm={() => {
                dispatch({
                  type: "cost/del", name: selectName, cb: () => {
                    dispatch({ type: "cost/rselectName", selectName: "" });
                    dispatch({ type: "cost/listNames", cb: () => dispatch({ type: "cost/list" }) });
                  }
                })
              }}
              onCancel={() => { }}
              okText="确定"
              cancelText="取消"
            ><Button style={{ marginLeft: 10, backgroundColor: "red" }}>删除模型</Button></Popconfirm>
          </Col>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "cost/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "cost/list", name: selectName });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "cost/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "cost/list", name: selectName });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editNameVisible ? <MyEditName dispatch={dispatch} visible={editNameVisible} selectName={selectName} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
        {copyData.visible ? <MyCopy dispatch={dispatch} visible={copyData.visible} copyName={copyData.copyName} /> : null}
      </>
    );
  }
}

export default Cost;