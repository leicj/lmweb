import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { MyTable } from '@/components/table';
import { Row, Button, Popconfirm, Tag, Segmented } from 'antd';
import { mapUNITSKV, COLORS } from '@/constants/index';
import MyAdd from './add';
import MyEdit from './edit';

@connect(({ engineering }) => ({ engineering }))
class Engineering extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, engineering, status } = this.props;
    const { data, tags, pagination, addVisible, editData } = engineering;
    const titles = ["序号", "名称", "单位", "标签", "操作"];
    const dataIndexs = ["index", "name", "unit_name", "tags_name", "opr"];

    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "engineering/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除方案(${d.name})`}
            description="删除方案不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "engineering/del", _id: d._id, cb: () => dispatch({ type: "engineering/list" }) });
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
      mapTagColor[t] = COLORS[i % COLORS.length];
    });
    const indexStart = (pagination.pageIndex - 1) * pagination.pageSize;
    data.forEach((d, i, arr) => {
      d.index = indexStart + i + 1;
      d.unit_name = mapUNITSKV[d.unit];
      d.tags_name = d.tags.map((t, i, arr) => <Tag key={i} color={mapTagColor[t]}>{t}</Tag>);
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
          <Button type="primary" style={{ marginLeft: 30 }} onClick={() => dispatch({ type: "engineering/raddVisible", visible: true })}>新增工程</Button>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "engineering/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "engineering/list" });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "engineering/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "engineering/list" });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
      </>
    )
  }
}

export default Engineering;
