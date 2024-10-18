import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, Tag, Popconfirm } from 'antd';
import { mapFORMATKV } from '@/constants/index';
import { tsFormat } from '@/components/help';
import { MyTable } from '@/components/table';
import { AppstoreOutlined, BarsOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import MyAdd from './add';
import MyEdit from './edit';
import MyModuleEdit from './moduleEdit';

@connect(({ module }) => ({ module }))
class Module extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, module } = this.props;
    const {
      allData, data, pagination, addVisible, editData, fieldFactoryData,
      moduleFieldFactoryData, selectFieldFactoryID, moduleData, modulePagination, moduleEditData,
      selectModuleFactoryID, selectTable
    } = module;
    // 模块工厂
    const nameTitle = <div>名称&nbsp;&nbsp;
      <Popconfirm description="如果字段有更改，点击编辑即可同步！" onConfirm={() => { }} onCancel={() => { }}>
        <QuestionCircleOutlined style={{ color: "green" }} />
      </Popconfirm>
    </div>;
    const titles = [nameTitle, "字段集", "创建时间", "操作"];
    const dataIndexs = ["name_name", "fieldFactoryIDs_name", "ts_name", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "module/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除模块工厂(${d.name})`}
            description="删除模块工厂不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "module/del", _id: d._id, cb: () => dispatch({ type: "module/list" }) });
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
    const mapFieldFactoryName = {};
    fieldFactoryData.forEach(d => {
      mapFieldFactoryName[d._id] = d.name;
    })
    data.forEach((d, i, arr) => {
      d.name_name = <a style={{ color: "#1677ff" }} onClick={() => {
        dispatch({ type: "module/rselectTable", selectTable: "2" });
        dispatch({ type: "module/rselectModuleFactoryID", selectModuleFactoryID: d._id });
        dispatch({
          type: 'module/moduleFieldFactoryList', moduleFactoryID: d._id,
          cb: () => dispatch({ type: "module/moduleList", moduleFactoryID: d._id })
        });
      }}>{d.name}</a>
      d.ts_name = tsFormat(d.ts);
      d.fieldFactoryIDs_name = (
        <>
          {d.fieldFactoryIDs.map(_id => <Row key={_id}>{mapFieldFactoryName[_id]}</Row>)}
        </>
      );
      d.opr = <Opr dispatch={dispatch} d={d} />;
    });

    // 模块详情
    const moduleTitles = ['序号', '数据库字段', '名称', '字段分类', '格式化展示', '是否使用', '是否只读', '是否必填', '导入模板', '导出模板', '参与筛选', '操作'];
    const moduleDataIndexs = ['no', 'field', 'name', 'group', 'format_name', 'isUse_name', 'isRead_name', 'isRequired_name', 'isUpload_name', 'isDownload_name', 'isSearch_name', 'opr'];
    const ModuleOpr = ({ dispatch, d }) => {
      return (
        <Button onClick={() => dispatch({ type: "module/rmoduleEditData", moduleEditData: { data: d, visible: true } })}>编辑</Button>
      );
    }
    moduleData.forEach((d, i, arr) => {
      d.format_name = d.format ? mapFORMATKV[d.format] : "";
      d.isUse_name = d.isUse == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.isRead_name = d.isRead == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.isRequired_name = d.isRequired == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.isUpload_name = d.isUpload == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.isDownload_name = d.isDownload == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.isSearch_name = d.isSearch == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      d.opr = <ModuleOpr dispatch={dispatch} d={d} />;
    })

    const items = moduleFieldFactoryData.map(d => {
      const item = { "key": d['fieldFactoryID'], "label": d['fieldFactoryName'] };
      if (d['fieldFactoryID'] == selectFieldFactoryID) {
        item['children'] = <MyTable titles={moduleTitles} dataIndexs={moduleDataIndexs} data={moduleData} pagination={modulePagination}
          onChange={(current, pageSize) => {
            dispatch({ type: "module/rmodulePagination", modulePagination: { ...modulePagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "module/moduleList", moduleFactoryID: selectModuleFactoryID });
          }}
          onShowSizeChange={(current, pageSize) => {
            dispatch({ type: "module/rmodulePagination", modulePagination: { ...modulePagination, pageIndex: current, pageSize: pageSize } });
            dispatch({ type: "module/moduleList", moduleFactoryID: selectModuleFactoryID });
          }}
        />
      }
      return item;
    });


    const selectOptions = allData.map(d => ({ "label": d.name, "value": d._id }));
    return (
      <>
        {
          selectTable == "1" ?
            <>
              <Row>
                <Col span={12}>
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "module/raddVisible", visible: true })}>新增</Button>
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "模块管理", value: "1", icon: <BarsOutlined /> }, { label: "模块详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "module/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "module/list" });
                      } else {
                        dispatch({ type: 'module/moduleFieldFactoryList', moduleFactoryID: selectModuleFactoryID, cb: () => dispatch({ type: "module/moduleList", moduleFactoryID: selectModuleFactoryID }) });
                      }
                    }}
                  />
                </Col>
              </Row>
              <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
                onChange={(current, pageSize) => {
                  dispatch({ type: "module/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "module/list" });
                }}
                onShowSizeChange={(current, pageSize) => {
                  dispatch({ type: "module/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "module/list" });
                }}
              />
            </> :
            <>
              <Row>
                <Col span={12}>
                  <Select options={selectOptions} style={{ width: 250 }} value={selectModuleFactoryID} onChange={e => {
                    dispatch({ type: "module/rselectModuleFactoryID", selectModuleFactoryID: e });
                    dispatch({ type: 'module/moduleFieldFactoryList', moduleFactoryID: e, cb: () => dispatch({ type: "module/moduleList", moduleFactoryID: e }) });
                  }} />
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "模块管理", value: "1", icon: <BarsOutlined /> }, { label: "模块详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "module/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "module/list" });
                      } else {
                        dispatch({ type: 'module/moduleFieldFactoryList', moduleFactoryID: selectModuleFactoryID, cb: () => dispatch({ type: "module/moduleList", moduleFactoryID: selectModuleFactoryID }) });
                      }
                    }}
                  />
                </Col>
              </Row>
              <div style={{ width: '100%' }}>
                <Tabs activeKey={selectFieldFactoryID} items={items} onChange={e => {
                  dispatch({ type: "module/rpagination", pagination: { ...pagination, pageIndex: 1, pageSize: 10 } });
                  dispatch({ type: "module/rmodulePagination", modulePagination: { ...modulePagination, pageIndex: 1, pageSize: 10 } });
                  dispatch({ type: 'module/rselectFieldFactoryID', selectFieldFactoryID: e });
                  dispatch({ type: "module/moduleList", moduleFactoryID: selectModuleFactoryID, fieldFactoryID: e });
                }} />
              </div>
            </>
        }
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} fieldFactoryData={fieldFactoryData} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} fieldFactoryData={fieldFactoryData} /> : null}
        {moduleEditData.visible ? <MyModuleEdit dispatch={dispatch} visible={moduleEditData.visible} data={moduleEditData.data} /> : null}
      </>
    );
  }
}

export default Module;