import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tag, Popconfirm, Form } from 'antd';
import { COLORS, mapFIELDSTYLEKV } from '@/constants/index';
import { tsFormat } from '@/components/help';
import { MyTable } from '@/components/table';
import { AppstoreOutlined, BarsOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styleUrl from '@/assets/images/控件类型.png';
import MyAdd from './add';
import MyEdit from './edit';
import MyFieldAdd from './fieldAdd';
import MyFieldEdit from './fieldEdit';
import MyUpload from './upload';
import MyLink from './link';
import MyForeignKey from './foreignKey';
import MyRuleAdd from './ruleAdd';
import MyUniqueEdit from './uniqueEdit';

@connect(({ field }) => ({ field }))
class Field extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, field } = this.props;
    const {
      allData, data, pagination, addVisible, editData,
      fieldData, fieldPagination, fieldAddVisible, fieldEditData,
      selectFieldFactoryID, uploadVisible, selectTable,
      linkEditData, foreignKeyEditData, ruleAddVisible, uniqueEditData
    } = field;
    // 字段工厂
    const titles = ["顺序号", "名称", "数据库表名", "数据库唯一性", "字段总数", "插件", "创建时间", "操作"];
    const dataIndexs = ["no", "name_name", "table", "unique", "fieldTotal", "rules_name", "ts_name", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "field/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除字段工厂(${d.name})`}
            description="删除字段工厂不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "field/del", _id: d._id, cb: () => dispatch({ type: "field/list" }) });
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <Button style={{ marginLeft: 5 }} danger>删除</Button>
          </Popconfirm>
          <Button type='dashed' style={{ marginLeft: 5 }} onClick={() => dispatch({ type: "field/runiqueEditData", uniqueEditData: { data: d, visible: true } })}>唯一性设置</Button>
        </>
      );
    }
    const mapFieldFactory = {};
    allData.forEach(d => {
      mapFieldFactory[d._id] = d;
    });
    data.forEach((d, i, arr) => {
      d.name_name = <a style={{ color: "#1677ff" }} onClick={() => {
        dispatch({ type: "field/rselectFieldFactoryID", selectFieldFactoryID: d._id });
        dispatch({ type: "field/rselectTable", selectTable: "2" });
        dispatch({ type: "field/fieldList" });
      }}>{d.name}</a>
      d.rules_name = <Row>
        {d.rules && d.rules.map(r => {
          if (r.type == "0") {
            const sourceName = mapFieldFactory[r.sourceFieldFactoryID] && mapFieldFactory[r.sourceFieldFactoryID]['name'];
            const targetName = mapFieldFactory[r.targetFieldFactoryID] && mapFieldFactory[r.targetFieldFactoryID]['name'];
            return <div>桥幅组合&nbsp;&nbsp;
              <Popconfirm description={
                <Form>
                  <Form.Item label="原字段集">{sourceName}</Form.Item>
                  <Form.Item label="目标字段集">{targetName}</Form.Item>
                </Form>
              } onConfirm={() => { }} onCancel={() => { }}>
                <QuestionCircleOutlined style={{ color: "green" }} />
              </Popconfirm>
            </div>;
          }
        })}
      </Row>
      d.ts_name = tsFormat(d.ts);
      d.opr = <Opr dispatch={dispatch} d={d} />;
    });

    // 字段详情
    const isImportmantTitle = <div>是否业务字段&nbsp;&nbsp;
      <Popconfirm description="业务字段：在实际业务中被调用的字段，不允许删除。" onConfirm={() => { }} onCancel={() => { }}>
        <QuestionCircleOutlined style={{ color: "green" }} />
      </Popconfirm>
    </div>;
    const styleTitle = <div>控件类型&nbsp;&nbsp;
      <Popconfirm description={<img src={styleUrl} />} onConfirm={() => { }} onCancel={() => { }}>
        <QuestionCircleOutlined style={{ color: "green" }} />
      </Popconfirm>
    </div>
    // 是否业务字段（isImportmant_name）先隐藏
    const fieldTitles = ["序号", "数据库字段", "名称", styleTitle, "单位", "额外配置", "下拉选项", "字段组合", "字段关联", "操作"];
    const fieldDataIndexs = ["no", "field", "name", "style_name", "unit", "jsonStr_name", "options", "link_name", "foreignKey_name", "opr"];
    const widths = [50, 120, 100, 150, 50, 50, 200, 150, 100, 250];
    const mapLink = { "join": "分隔符拼接", "sum": "求和", "max": "最大值", "min": "最小值", "avg": "平均值", "same": "去重取一" }
    const FieldOpr = ({ dispatch, d }) => {
      return (
        <>
          <Button size={"small"} onClick={() => dispatch({ type: "field/rfieldEditData", fieldEditData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除字段(${d.name})`}
            description="删除字段不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "field/fieldDel", _id: d._id, cb: () => dispatch({ type: "field/fieldList" }) });
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <Button size={"small"} style={{ marginLeft: 5 }} danger>删除</Button>
          </Popconfirm>
          <Button size={"small"} style={{ marginLeft: 5 }} onClick={() => {
            let _data = { _id: d._id }
            if (d.link) {
              _data = { _id: d._id, ...d.link }
            }
            dispatch({ type: "field/rlinkEditData", linkEditData: { data: _data, visible: true } })
          }}>字段组合</Button>
          <Button size={"small"} style={{ marginLeft: 5}} onClick={()=>{
            let _data = {_id: d._id};
            if (d.foreignKey){
              _data = {_id: d._id, ...d.foreignKey};
            }
            dispatch({ type:"field/rforeignKeyEditData", foreignKeyEditData:{data:_data, visible:true}});
          }}>字段关联</Button>
        </>
      );
    }
    fieldData.forEach((d, i, arr) => {
      d.isImportmant_name = d.isImportmant == "1" ? <Tag color='green'>是</Tag> : <Tag color='gray'>否</Tag>;
      let color = COLORS[parseInt(d.style) % COLORS.length];
      d.style_name = <Tag color={color}>{mapFIELDSTYLEKV[d.style]}</Tag>;
      let jsonStr = {};
      try {
        jsonStr = d.jsonStr ? JSON.parse(d.jsonStr) : {};
      } catch (error) {
        console.error("导入的字段有误：", d.jsonStr);
      }

      if (d.style == "0" || d.style == "1") {
        d.jsonStr_name = (<Form layout="inline">
          {jsonStr.regex != undefined ? <Form.Item label="正则表达式">{jsonStr.regex}</Form.Item> : null}
          {jsonStr.regexDescription != undefined ? <Form.Item label="正则表达式说明">{jsonStr.regexDescription}</Form.Item> : null}
        </Form>)
      } else if (d.style == "2") {
        d.jsonStr_name = (<Form layout="inline">
          {jsonStr.minValue != undefined ? <Form.Item label="最小值">{jsonStr.minValue}</Form.Item> : null}
          {jsonStr.maxValue != undefined ? <Form.Item label="最大值">{jsonStr.maxValue}</Form.Item> : null}
          {jsonStr.precision != undefined ? <Form.Item label="保留几位小数">{jsonStr.precision}</Form.Item> : null}
        </Form>)
      } else if (d.style == "7") {
        let dateTypeName = "";
        if (jsonStr.dateType == "year") {
          dateTypeName = "年";
        } else if (jsonStr.dateType == "month") {
          dateTypeName = "月";
        } else if (jsonStr.dateType == "day") {
          dateTypeName = "日";
        } else if (jsonStr.dateType == "second") {
          dateTypeName = "秒";
        }
        d.jsonStr_name = (<Form layout="inline">
          <Form.Item label="日期类型">{dateTypeName}</Form.Item>
        </Form>)
      } else if (d.style == "8") {
        d.jsonStr_name = (<Form layout="inline">
          {jsonStr.suffix != undefined ? <Form.Item label="文件类型后缀名">{jsonStr.suffix}</Form.Item> : null}
          {jsonStr.maxNum != undefined ? <Form.Item label="最大上传数量">{jsonStr.maxNum}</Form.Item> : null}
          {jsonStr.maxSize != undefined ? <Form.Item label="最大文件大小(M)">{jsonStr.maxSize}</Form.Item> : null}
        </Form>)
      }
      if (d.link) {
        d.link_name = (<Form layout="inline">
          <Form.Item label="数据库表名">{d.link.table}</Form.Item>
          <Form.Item label="数据库字段">{d.link.field}</Form.Item>
          <Form.Item label="组合方式">{mapLink[d.link.opr]}</Form.Item>
          {d.link.oprValue ? <Form.Item label="拼接字段">{d.link.oprValue}</Form.Item>:null}
        </Form>)
      }
      if (d.foreignKey){
        d.foreignKey_name = (<Form layout='inline'>
          <Form.Item label="数据库表名">{d.foreignKey.table}</Form.Item>
          <Form.Item label="数据库字段">{d.foreignKey.field}</Form.Item>
        </Form>);
      }
      d.opr = <FieldOpr dispatch={dispatch} d={d} />
    });
    const selectOptions = allData.map(d => ({ "label": d.name, "value": d._id }));

    return (
      <>
        {
          selectTable == "1" ?
            <>
              <Row>
                <Col span={12}>
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "field/raddVisible", visible: true })}>新增</Button>
                  <Button type="dashed" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "field/rruleAddVisible", visible: true })}>新增插件</Button>
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "字段管理", value: "1", icon: <BarsOutlined /> }, { label: "字段详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "field/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "field/list" });
                      } else {
                        dispatch({ type: "field/fieldList" });
                      }
                    }}
                  />
                </Col>
              </Row>
              <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
                onChange={(current, pageSize) => {
                  dispatch({ type: "field/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "field/list" });
                }}
                onShowSizeChange={(current, pageSize) => {
                  dispatch({ type: "field/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "field/list" });
                }}
              />
            </> :
            <>
              <Row>
                <Col span={12}>
                  <Select options={selectOptions} style={{ width: 250 }} value={selectFieldFactoryID} onChange={e => {
                    dispatch({ type: "field/rselectFieldFactoryID", selectFieldFactoryID: e });
                    dispatch({ type: "field/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
                    dispatch({ type: "field/fieldList", fieldFactoryID: e });
                  }} />
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "field/rfieldAddVisible", visible: true })}>新增</Button>
                  <Button style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "field/ruploadVisible", visible: true })}>批量导入</Button>
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "字段管理", value: "1", icon: <BarsOutlined /> }, { label: "字段详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "field/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "field/list" });
                      } else {
                        dispatch({ type: "field/fieldList" });
                      }
                    }}
                  />
                </Col>
              </Row>
              <MyTable titles={fieldTitles} dataIndexs={fieldDataIndexs} data={fieldData} widths={widths} pagination={fieldPagination}
                onChange={(current, pageSize) => {
                  dispatch({ type: "field/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "field/fieldList" });
                }}
                onShowSizeChange={(current, pageSize) => {
                  dispatch({ type: "field/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "field/fieldList" });
                }}
              />
            </>
        }
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
        {fieldAddVisible ? <MyFieldAdd dispatch={dispatch} visible={fieldAddVisible} /> : null}
        {fieldEditData.visible ? <MyFieldEdit dispatch={dispatch} visible={fieldEditData.visible} data={fieldEditData.data} /> : null}
        {uploadVisible ? <MyUpload dispatch={dispatch} visible={uploadVisible} /> : null}
        {linkEditData.visible ? <MyLink dispatch={dispatch} visible={linkEditData.visible} data={linkEditData.data} /> : null}
        {foreignKeyEditData.visible ? <MyForeignKey dispatch={dispatch} visible={foreignKeyEditData.visible} data={foreignKeyEditData.data} /> : null}
        {ruleAddVisible ? <MyRuleAdd dispatch={dispatch} visible={ruleAddVisible} allData={allData} /> : null}
        {uniqueEditData.visible ? <MyUniqueEdit dispatch={dispatch} visible={uniqueEditData.visible} data={uniqueEditData.data} /> : null}
      </>
    );
  }
}

export default Field;