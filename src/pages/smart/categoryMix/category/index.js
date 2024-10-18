import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { MyTable } from '@/components/table';
import { Row, Button, Popconfirm, Tag } from 'antd';
import { mapROADSTRUCTKV, mapCONSERVATIONKV } from '@/constants/index';
import MyAdd from './add';
import MyEdit from './edit';

@connect(({ category }) => ({ category }))
class Category extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, category } = this.props;
    const { data, pagination, addVisible, editData } = category;
    const titles = ["序号", "名称", "路面结构", "养护类型", "操作"];
    const dataIndexs = ["index", "name", "struct_name", "status_name", "opr"];

    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "category/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除对策(${d.name})`}
            description="删除对策不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "category/del", _id: d._id, cb: () => dispatch({ type: "category/list" }) });
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
      d.struct_name = <Tag>{mapROADSTRUCTKV[d.struct]}</Tag>;
      d.status_name = <Tag>{mapCONSERVATIONKV[d.status]}</Tag>;
      d.opr = <Opr dispatch={dispatch} d={d} />
    });

    return (
      <>
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Button type="primary" style={{ marginLeft: 30 }} onClick={() => dispatch({ type: "category/raddVisible", visible: true })}>新增工程</Button>
        </Row>
        <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "category/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "category/list" });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "category/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "category/list" });
          }}
        />
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
      </>
    )
  }
}

export default Category;
