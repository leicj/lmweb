import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, Tag, Popconfirm, Form, Radio, Input } from 'antd';
import { tsFormat, stakeFormat } from '@/components/help';
import { MyTable } from '@/components/table';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import MyAdd from './add';
import MyEdit from './edit';
import MyFieldAdd from './fieldAdd';
import MyFieldEdit from './fieldEdit';
import MyColumnsEdit from './columnsEdit';
import MyUpload from './upload';
import BridgeRule from './bridgeRule';

@connect(({ application }) => ({ application }))
class Application extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, application } = this.props;
    const {
      allData, data, pagination, addVisible, editData, moduleFactoryData,
      moduleFieldFactoryData,
      groupData, fieldTitle, fieldBody, fieldPagination, fieldAddVisible, fieldEditData,
      selectApplicationFactory, columnsEditData, fieldSearch, selectTable, uploadVisible,
      selrows, bridgeRuleAdd, jm, rulesData, mapCookie
    } = application;
    const { applicationFactoryID, moduleFactoryID, fieldFactoryID } = selectApplicationFactory;
    // 实例工厂
    const titles = ["实例名称", "模块名称", "数据库DB", "创建时间", "操作"];
    const dataIndexs = ["name_name", "moduleFactoryID_name", "db", "ts_name", "opr"];
    const Opr = ({ dispatch, d }) => {
      return (
        <>
          <Button onClick={() => dispatch({ type: "application/reditData", editData: { data: d, visible: true } })}>编辑</Button>
          <Popconfirm
            title={`删除实例工厂(${d.name})`}
            description="删除实例工厂不可恢复！确定删除？"
            onConfirm={() => {
              dispatch({ type: "application/del", _id: d._id, cb: () => dispatch({ type: "application/list" }) });
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
    const mapModuleFactoryName = {};
    moduleFactoryData.forEach(d => {
      mapModuleFactoryName[d._id] = d.name;
    });
    const onSearch = (fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID) => {
      const cond = fieldSearch.map(f => ({ 'style': f.style, 'key': f.key, 'value': f.value }));
      dispatch({
        type: "application/applicationList",
        formData: cond,
        applicationFactoryID, moduleFactoryID, fieldFactoryID,
      });
    }

    const tabSelect = (dispatch, applicationFactoryID, moduleFactoryID, fieldFactoryID) => {
      dispatch({
        type: 'application/moduleFieldFactoryList', moduleFactoryID,
        cb: () => {
          dispatch({
            type: "application/applicationSearchList",
            applicationFactoryID, moduleFactoryID, fieldFactoryID,
          });
          dispatch({
            type: "application/applicationTitleList",
            applicationFactoryID, moduleFactoryID, fieldFactoryID,
          });
          onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
        }
      });
    }
    data.forEach((d, i, arr) => {
      d.name_name = <a style={{ color: "#1677ff" }} onClick={() => {
        dispatch({ type: "application/rselectTable", selectTable: "2" });
        dispatch({ type: "application/rselectApplicationFactory", selectApplicationFactory: { applicationFactoryID: d['_id'], moduleFactoryID: d['moduleFactoryID'] } });
        tabSelect(dispatch, d['_id'], d['moduleFactoryID'], '');
      }}>{d.name}</a>;
      d.moduleFactoryID_name = mapModuleFactoryName[d.moduleFactoryID];
      d.ts_name = tsFormat(d.ts);
      d.opr = <Opr dispatch={dispatch} d={d} />;
    });

    // 实例详情
    // _fieldDataIndexs：会更改
    const [_fieldTitle, _fieldDataIndexs, mapField] = [[], [], {}];
    if (columnsEditData.data.length == 0) {
      const _key = `${applicationFactoryID}|${moduleFactoryID}|${fieldFactoryID}`;
      // 读取cookie
      const _columns = mapCookie[_key];
      if (_columns) {
        dispatch({ type: "application/rcolumnsEditData", columnsEditData: { data: _columns.split(','), visible: false } });
        columnsEditData.data = _columns.split(',');
      }
    }
    // 存储原始的dataIndexs
    const sourceFieldDataIndexs = [];
    fieldTitle.forEach(d => {
      sourceFieldDataIndexs.push(d.field);
      if (columnsEditData.data.length > 0 && !columnsEditData.data.includes(d.field)) {
        return;
      }
      _fieldTitle.push(d.name);
      _fieldDataIndexs.push(d.field);
      mapField[d.field] = d;
    });
    _fieldDataIndexs.forEach((k, i, arr) => {
      // 2: 数字输入框
      if (mapField[k]['style'] == '2') {
        // 桩号格式化
        if (mapField[k]['format'] == "0") {
          _fieldDataIndexs[i] = k + "_name";
          fieldBody.forEach((d, i, arr) => {
            d[k + "_name"] = stakeFormat(d[k]);
            d.children && d.children.forEach(d1 => {
              d1[k + "_name"] = stakeFormat[d1[k]];
            })
          })
        }
      }
      // 3: 单选框, 4: 选择器(单选)
      if (mapField[k]['style'] == '3' || mapField[k]['style'] == '4') {
        _fieldDataIndexs[i] = k + "_name";
        let options = JSON.parse(mapField[k]['options']);
        fieldBody.forEach((d, i, arr) => {
          d[k + "_name"] = options[d[k]];
          d.children && d.children.forEach(d1 => {
            d1[k + "_name"] = options[d1[k]];
          })
        })
      }
      // 5: 选择器(多选)
      if (mapField[k]['style'] == '5') {
        _fieldDataIndexs[i] = k + "_name";
        let options = JSON.parse(mapField[k]['options']);
        fieldBody.forEach((d, i, arr) => {
          d[k + "_name"] = d[k] && d[k].map(_d => options[_d]).join(",");
          d.children && d.children.forEach(d1 => {
            d1[k + "_name"] = d1[k] && d1[k].map(d2 => options[d2]).join(",");
          })
        })
      }
      // 6: 级联选择
      if (mapField[k]['style'] == '6') {
        _fieldDataIndexs[i] = k + "_name";
        let options = JSON.parse(mapField[k]['options']);
        fieldBody.forEach((d, i, arr) => {
          if (!d[k]) return;
          // 最多三层级联
          let [v1, v2, v3] = ["", "", ""];
          let [d1, d2, d3] = [d[k][0], d[k][1], d[k][2]]
          options.forEach(_d1 => {
            if (_d1['value'] == d1) {
              v1 = _d1['label'];
              _d1['children'].forEach(_d2 => {
                if (_d2['value'] == d2) {
                  v2 = _d2['label'];
                  _d2['children'] && _d2['children'].forEach(_d3 => {
                    if (_d3['value'] == d3) {
                      v3 = _d3['label'];
                    }
                  })
                }
              })
            }
          });
          if (v1 && v2 && v3) {
            d[k + "_name"] = [v1, v2, v3].join(",");
          } else if (v1 && v2) {
            d[k + "_name"] = [v1, v2].join(",");
          } else if (v1) {
            d[k + "_name"] = v1
          }
          d.children && d.children.forEach(_d => {
            if (!_d[k]) return;
            // 最多三层级联
            let [v1, v2, v3] = ["", "", ""];
            let [d1, d2, d3] = [_d[k][0], _d[k][1], _d[k][2]]
            options.forEach(_d1 => {
              if (_d1['value'] == d1) {
                v1 = _d1['label'];
                _d1['children'].forEach(_d2 => {
                  if (_d2['value'] == d2) {
                    v2 = _d2['label'];
                    _d2['children'] && _d2['children'].forEach(_d3 => {
                      if (_d3['value'] == d3) {
                        v3 = _d3['label'];
                      }
                    })
                  }
                })
              }
            });
            if (v1 && v2 && v3) {
              _d[k + "_name"] = [v1, v2, v3].join(",");
            } else if (v1 && v2) {
              _d[k + "_name"] = [v1, v2].join(",");
            } else if (v1) {
              _d[k + "_name"] = v1
            }
          })
        })
      }
      // 7: 日期选择框
      if (mapField[k]['style'] == '7') {
        _fieldDataIndexs[i] = k + "_name";
        let jsonStr = JSON.parse(mapField[k]['jsonStr']);
        fieldBody.forEach((d, i, arr) => {
          if (jsonStr.dateType == "year") {
            d[k + "_name"] = d[k] ? tsFormat(d[k]).substring(0, 4) : "";
          } else if (jsonStr.dateType == "month") {
            d[k + "_name"] = d[k] ? tsFormat(d[k]).substring(0, 7) : "";
          } else if (jsonStr.dateType == "day") {
            d[k + "_name"] = d[k] ? tsFormat(d[k]).substring(0, 10) : "";
          } else {
            d[k + "_name"] = d[k] ? tsFormat(d[k]) : "";
          }
          d.children && d.children.forEach(d1 => {
            if (jsonStr.dateType == "year") {
              d1[k + "_name"] = d1[k] ? tsFormat(d1[k]).substring(0, 4) : "";
            } else if (jsonStr.dateType == "month") {
              d1[k + "_name"] = d1[k] ? tsFormat(d1[k]).substring(0, 7) : "";
            } else if (jsonStr.dateType == "day") {
              d1[k + "_name"] = d1[k] ? tsFormat(d1[k]).substring(0, 10) : "";
            } else {
              d1[k + "_name"] = d1[k] ? tsFormat(d1[k]) : "";
            }
          })
        })
      }
    })
    const FieldOpr = ({ dispatch, d, delDisabled }) => {
      return (
        <>
          <Button size="small" onClick={() => dispatch({ type: "application/rfieldEditData", fieldEditData: { data: d, visible: true } })}>编辑</Button>
          {
            !delDisabled ?
              <Popconfirm
                title={`删除数据`}
                description="删除字段不可恢复！确定删除？"
                onConfirm={() => {
                  dispatch({
                    type: "application/fieldDel",
                    _id: d._id,
                    applicationFactoryID, moduleFactoryID, fieldFactoryID,
                    cb: () => onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID)
                  });
                }}
                onCancel={() => { }}
                okText="确定"
                cancelText="取消"
              >
                <Button size='small' style={{ marginLeft: 5 }} danger>删除</Button>
              </Popconfirm>
              : null
          }

        </>
      );
    }
    const FieldRuleBridgeOpr = ({ dispatch, d }) => {
      return (
        <>
          <Popconfirm
            title={`取消组合`}
            description="取消组合后，可再次组合。确定取消？"
            onConfirm={() => {
              dispatch({
                type: "application/ruleDel",
                _id: d.ruleBridgeID,
                cb: () => onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID)
              });
            }}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <Button size='small' style={{ marginLeft: 5 }}>取消组合</Button>
          </Popconfirm>
        </>
      );
    }
    _fieldTitle.push('操作');
    _fieldDataIndexs.push('opr');
    fieldBody.forEach(d => {
      // 桥梁
      if (d.children && d.children.length > 0) {
        d.opr = <FieldRuleBridgeOpr dispatch={dispatch} d={d} />;
        d.children.forEach(_d => {
          _d.opr = <FieldOpr dispatch={dispatch} d={_d} delDisabled={true} />;
        });
      } else {
        d.opr = <FieldOpr dispatch={dispatch} d={d} />;
      }

    });

    const rowSelection = {
      selectedRowKeys: selrows.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({ type: "application/rselrows", selrows: { selectedRowKeys, selectedRows } });
      }
    }

    // 查询条件
    const search = <Form layout="inline">
      {fieldSearch.map((f, i, arr) => {
        if (f.style == '0') {
          return <Form.Item label={f.prefix}>
            <Input allowClear placeholder={`${f.name.join(",")}`} value={fieldSearch[i]['value']} onChange={e => {
              fieldSearch[i]['value'] = e.target.value;
              dispatch({ type: 'rfieldSearch', fieldSearch });
              dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
              onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
            }} />
          </Form.Item>
        } else if (f.style == '3') {
          let _options = {};
          try {
            _options = f.options ? JSON.parse(f.options) : {};
          } catch (error) {
            console.error("导入的字段有误：", f.options);
          }
          return <Form.Item label={f.prefix}>
            <Radio.Group value={fieldSearch[i]['value']}>
              <Radio value="" onChange={e => {
                fieldSearch[i]['value'] = '';
                dispatch({ type: 'rfieldSearch', fieldSearch });
                dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
                onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
              }}>全部</Radio>
              {Object.keys(_options).map(k => (<Radio value={k} onChange={e => {
                fieldSearch[i]['value'] = e.target.value;
                dispatch({ type: 'rfieldSearch', fieldSearch });
                dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
                onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
              }}>{_options[k]}</Radio>))}
            </Radio.Group>
          </Form.Item>
        } else if (f.style == '4') {
          let _options = {};
          try {
            _options = f.options ? JSON.parse(f.options) : {};
          } catch (error) {
            console.error("导入的字段有误：", f.options);
          }
          let selOptions = Object.keys(_options).map(k => ({ "value": k, "label": _options[k] }));
          selOptions.unshift({ 'value': "", "label": "全部" });
          return <Form.Item label={f.prefix}>
            <Select options={selOptions} style={{ width: 150 }} value={fieldSearch[i]['value']} onChange={e => {
              fieldSearch[i]['value'] = e;
              dispatch({ type: 'rfieldSearch', fieldSearch });
              dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
              onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
            }} />
          </Form.Item>
        }
      })}
      <Button type="text" style={{ color: "#267bfc" }} onClick={() => {
        fieldSearch.forEach((f, i, arr) => {
          fieldSearch[i]['value'] = '';
        });
        dispatch({ type: 'application/rfieldSearch', fieldSearch });
        dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: 1, pageSize: 10 } });
        onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
      }}>清空条件</Button>
    </Form>
    // 插件按钮
    let ruleBridgeBtn = null;
    rulesData.forEach(r => {
      if (r.type == "0" && r.sourceFieldFactoryID == fieldFactoryID) {
        ruleBridgeBtn = <Button
          type="dashed" style={{ marginLeft: 10 }}
          onClick={() => dispatch({ type: "application/rbridgeRuleAdd", bridgeRuleAdd: { visible: true, data: r } })}
          disabled={selrows.selectedRows.length == 0}
        >桥梁规则</Button>
      }
    })
    const items = moduleFieldFactoryData.map(d => {
      const item = { "key": d['fieldFactoryID'], "label": d['fieldFactoryName'] };
      if (d['fieldFactoryID'] == fieldFactoryID) {
        item['children'] =
          <Row>
            <Row style={{ marginBottom: 10, width: '100%' }}>
              <Col span={16}>
                {search}
              </Col>
              <Col span={8}>
                <Button
                  type="primary" style={{ marginLeft: 10 }}
                  onClick={() => dispatch({ type: "application/rcolumnsEditData", columnsEditData: { visible: true, data: columnsEditData.data } })}
                >动态列控制</Button>
                <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "application/rfieldAddVisible", visible: true })}>新增</Button>
                <Button type="dashed" style={{ marginLeft: 10 }} onClick={() => {
                  dispatch({ type: 'application/ruploadVisible', visible: true });
                }}>批量导入</Button>
                <Button type="dashed" style={{ marginLeft: 10 }} onClick={() => {
                  const cond = fieldSearch.map(f => ({ 'style': f.style, 'key': f.key, 'value': f.value }));
                  dispatch({
                    type: 'application/download',
                    formData: cond,
                    applicationFactoryID, moduleFactoryID, fieldFactoryID,
                  })
                }}>批量导出</Button>
                <Popconfirm
                  title={`删除数据`}
                  description="删除字段不可恢复！确定删除？"
                  onConfirm={() => {
                    const _ids = selrows.selectedRows.map(s => s._id).join(",");
                    dispatch({
                      type: "application/fieldDelBatch",
                      _ids: _ids,
                      applicationFactoryID, moduleFactoryID, fieldFactoryID,
                      cb: () => {
                        dispatch({ type: "application/rselrows", selrows: { selectedRowKeys: [], selectedRows: [] } });
                        onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
                      }
                    });
                  }}
                  onCancel={() => { }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button size='small' style={{ marginLeft: 5 }} disabled={selrows.selectedRows.length == 0} danger>批量删除</Button>
                </Popconfirm>
                {ruleBridgeBtn}
              </Col>
            </Row>
            <MyTable
              titles={_fieldTitle}
              dataIndexs={_fieldDataIndexs}
              data={fieldBody}
              rowSelection={rowSelection}
              pagination={fieldPagination}
              onChange={(current, pageSize) => {
                dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: current, pageSize: pageSize } });
                onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
              }}
              onShowSizeChange={(current, pageSize) => {
                dispatch({ type: "application/rfieldPagination", fieldPagination: { ...fieldPagination, pageIndex: current, pageSize: pageSize } });
                onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
              }}
            />
          </Row>

      }
      return item;
    });

    const selectOptions = allData.map(d => ({ "label": d.name, "value": d._id }));
    const mapApplicationFactory = {};
    allData.forEach(d => {
      mapApplicationFactory[d._id] = d;
    });

    return (
      <>
        {
          selectTable == "1" ?
            <>
              <Row>
                <Col span={12}>
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "application/raddVisible", visible: true })}>新增</Button>
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "实例管理", value: "1", icon: <BarsOutlined /> }, { label: "实例详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "application/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "application/list" });
                      } else {
                        tabSelect(dispatch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
                      }
                    }}
                  />
                </Col>
              </Row>
              <MyTable titles={titles} dataIndexs={dataIndexs} data={data} pagination={pagination}
                onChange={(current, pageSize) => {
                  dispatch({ type: "application/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "application/list" });
                }}
                onShowSizeChange={(current, pageSize) => {
                  dispatch({ type: "application/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                  dispatch({ type: "application/list" });
                }}
              />
            </> :
            <>
              <Row>
                <Col span={12}>
                  <Select options={selectOptions} style={{ width: 250 }} value={applicationFactoryID} onChange={e => {
                    dispatch({
                      type: "application/rselectApplicationFactory",
                      selectApplicationFactory: {
                        applicationFactoryID: mapApplicationFactory[e]['_id'],
                        moduleFactoryID: mapApplicationFactory[e]['moduleFactoryID'],
                      }
                    });
                    tabSelect(dispatch, mapApplicationFactory[e]['_id'], mapApplicationFactory[e]['moduleFactoryID'], '');
                  }} />
                </Col>
                <Col span={12}>
                  <Segmented style={{ float: "right" }} value={selectTable}
                    options={[{ label: "实例管理", value: "1", icon: <BarsOutlined /> }, { label: "实例详情", value: "2", icon: <AppstoreOutlined /> }]}
                    onChange={e => {
                      dispatch({ type: "application/rselectTable", selectTable: e });
                      if (e == "1") {
                        dispatch({ type: "application/list" });
                      } else {
                        tabSelect(dispatch, applicationFactoryID, moduleFactoryID, fieldFactoryID);
                      }
                    }}
                  />
                </Col>
              </Row>
              <div style={{ width: '100%' }}>
                <Tabs activeKey={fieldFactoryID} items={items} onChange={e => {
                  dispatch({ type: "application/rfieldTitle", fieldTitle: [] });
                  dispatch({ type: "application/rfieldBody", fieldBody: [] });
                  dispatch({ type: "application/rcolumnsEditData", columnsEditData: { data: [], visible: false } });
                  dispatch({ type: 'application/rselectApplicationFactory', selectApplicationFactory: { ...selectApplicationFactory, fieldFactoryID: e } });
                  dispatch({
                    type: "application/applicationSearchList",
                    applicationFactoryID: applicationFactoryID,
                    moduleFactoryID: moduleFactoryID,
                    fieldFactoryID: e,
                  });
                  dispatch({
                    type: "application/applicationTitleList",
                    applicationFactoryID: applicationFactoryID,
                    moduleFactoryID: moduleFactoryID,
                    fieldFactoryID: e,
                  });
                  onSearch(fieldSearch, applicationFactoryID, moduleFactoryID, e);

                }} />
              </div>
            </>
        }
        {addVisible ? <MyAdd dispatch={dispatch} visible={addVisible} moduleFactoryData={moduleFactoryData} /> : null}
        {editData.visible ? <MyEdit dispatch={dispatch} visible={editData.visible} data={editData.data} /> : null}
        {fieldAddVisible ? <MyFieldAdd
          dispatch={dispatch} visible={fieldAddVisible} groupData={groupData}
          selectApplicationFactory={selectApplicationFactory}
        /> : null}
        {fieldEditData.visible ? <MyFieldEdit
          dispatch={dispatch} visible={fieldEditData.visible} data={fieldEditData.data}
          dataIndexs={sourceFieldDataIndexs} groupData={groupData}
          selectApplicationFactory={selectApplicationFactory}
        /> : null}
        {columnsEditData.visible ? <MyColumnsEdit
          dispatch={dispatch} visible={columnsEditData.visible} data={columnsEditData.data}
          groupData={groupData} selectApplicationFactory={selectApplicationFactory}
        /> : null}
        {uploadVisible ? <MyUpload dispatch={dispatch} visible={uploadVisible} selectApplicationFactory={selectApplicationFactory} /> : null}
        {bridgeRuleAdd.visible ? <BridgeRule
          dispatch={dispatch} visible={bridgeRuleAdd.visible} rows={selrows.selectedRows} jm={jm}
          data={bridgeRuleAdd.data} selectApplicationFactory={selectApplicationFactory}
          sourceField={_fieldDataIndexs[0]}
        /> : null}
      </>
    );
  }
}

export default Application;