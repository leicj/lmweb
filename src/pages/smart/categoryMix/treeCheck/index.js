import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Segmented, Select, Tabs, message, Tag, Popconfirm } from 'antd';
import { COLORS } from '@/constants/index';
import { stakeFormat } from '@/components/help';
import { MyTable } from '@/components/table';
import MyUpload from './upload';
import { Form } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

@connect(({ treeCheck }) => ({ treeCheck }))
class TreeCheck extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, treeCheck } = this.props;
    const {
      treeData, treeID,
      names, selectName, uploadVisible, pqiData, pagination,
      costNames, selectCostName, selectTable,
      resultData, resultPagination,
    } = treeCheck;
    // 原始数据
    const titles = ["序号", "起点桩号", "终点桩号", "PQI", "PCI", "RQI", "RDI", "SRI"];
    const dataIndexs = ["index", "startStake_name", "endStake_name", "pqi_name", "pci_name", "rqi_name", "rdi_name", "sri_name"];
    const indexStart = (pagination.pageIndex - 1) * pagination.pageSize;
    pqiData.forEach((d, i, arr) => {
      d.index = indexStart + i + 1;
      d.startStake_name = stakeFormat(d.startStake);
      d.endStake_name = stakeFormat(d.endStake);
      d.pqi_name = d.pqi == 0 ? "- -" : parseFloat(d.pqi.toFixed(2));
      d.pci_name = d.pci == 0 ? "- -" : parseFloat(d.pci.toFixed(2));
      d.rqi_name = d.rqi == 0 ? "- -" : parseFloat(d.rqi.toFixed(2));
      d.rdi_name = d.rdi == 0 ? "- -" : parseFloat(d.rdi.toFixed(2));
      d.sri_name = d.sri == 0 ? "- -" : parseFloat(d.sri.toFixed(2));
    });

    // 验证数据
    const resultTitles = ["起点桩号", "终点桩号", "PCI", "RQI", "RDI", "SRI", "权重等级", "匹配规则", "对策", "工程方案", "诊断结果", "费用(元)"];
    const resultDataIndexs = ["startStake_name", "endStake_name", "pci_name", "rqi_name", "rdi_name", "sri_name", "weight_name", "rules_name", "category_name", "engineeringLibrary_name", "diseaseCheckResult_name", "cost_name"];
    resultData.forEach((d, i, arr) => {
      const color = COLORS[parseInt(d.weight)]
      d.startStake_name = stakeFormat(d.startStake);
      d.endStake_name = stakeFormat(d.endStake);
      d.pci_name = d.pci == 0 ? "- -" : d.pci < 92 ? <Tag color={color}>{parseFloat(d.pci.toFixed(2))}</Tag> : parseFloat(d.pci.toFixed(2));
      d.rqi_name = d.rqi == 0 ? "- -" : d.rqi < 90 ? <Tag color={color}>{parseFloat(d.rqi.toFixed(2))}</Tag> : parseFloat(d.rqi.toFixed(2));
      d.rdi_name = d.rdi == 0 ? "- -" : d.rdi < 80 ? <Tag color={color}>{parseFloat(d.rdi.toFixed(2))}</Tag> : parseFloat(d.rdi.toFixed(2));
      d.sri_name = d.sri == 0 ? "- -" : d.sri < 75 ? <Tag color={color}>{parseFloat(d.sri.toFixed(2))}</Tag> : parseFloat(d.sri.toFixed(2));
      d.weight_name = <Tag color={color}>{d.weight}</Tag>;
      d.rules_name = d.rules.split(" and ").map((_rule, i, arr) => <Tag key={i} color={color}>{_rule}</Tag>);
      d.category_name = <Tag color={color}>{d.category}</Tag>;
      d.engineeringLibrary_name = <Tag color={color}>{d.engineeringLibrary}</Tag>;
      d.diseaseCheckResult_name = <Tag color={color}>{d.diseaseCheckResult}</Tag>;
      d.cost_name = parseFloat(d.cost.toFixed(2));
      d.children && d.children.forEach((c, i, arr) => {
        c.startStake_name = stakeFormat(c.startStake);
        c.endStake_name = stakeFormat(c.endStake);
        c.pqi_name = c.pqi == 0 ? "- -" : parseFloat(c.pqi.toFixed(2));
        c.pci_name = c.pci == 0 ? "- -" : parseFloat(c.pci.toFixed(2));
        c.rqi_name = c.rqi == 0 ? "- -" : parseFloat(c.rqi.toFixed(2));
        c.rdi_name = c.rdi == 0 ? "- -" : parseFloat(c.rdi.toFixed(2));
        c.sri_name = c.sri == 0 ? "- -" : parseFloat(c.sri.toFixed(2));
        c.weight_name = c.weight > 0 ? <Tag color={COLORS[c.weight]}>{c.weight}</Tag> : "";
        c.rules_name = c.weight > 0 ? c.rules.split(" and ").map((_rule, i, arr) => <Tag key={i} color={color}>{_rule}</Tag>) : "";
      })
    })


    const selectModeOptions = treeData.map(d => ({ "label": d.name, "value": d._id }));
    const selectOptions = names.map(name => ({ "label": name, "value": name }));
    const selectCostOptions = costNames.map(name => ({ "label": name, "value": name }));
    return (
      <>
        <Row style={{ marginTop: 10, marginBottom: 20 }}>
          <Col span={16}>
            <Form layout="inline">
              <Form.Item label="决策模型">
                <Select options={selectModeOptions} style={{ width: 200 }} value={treeID} onChange={e => {
                  dispatch({ type: "treeCheck/rtreeID", treeID: e });
                  if (selectTable == "1") {
                    dispatch({ type: "treeCheck/checkList", name: selectName });
                  } else {
                    dispatch({ type: "treeCheck/listResultData", name: selectName, treeID: e });
                  }
                }} />
              </Form.Item>
              <Form.Item label="模型数据名称">
                <Select options={selectOptions} style={{ width: 200 }} value={selectName} onChange={e => {
                  dispatch({ type: "treeCheck/rselectName", selectName: e });
                  if (selectTable == "1") {
                    dispatch({ type: "treeCheck/checkList", name: e });
                  } else {
                    dispatch({ type: "treeCheck/listResultData", name: e, treeID });
                  }
                }} />
              </Form.Item>
              <Form.Item label="费用模型名称">
                <Select options={selectCostOptions} style={{ width: 200 }} value={selectCostName} onChange={e => {
                  dispatch({ type: "treeCheck/rselectCostName", selectCostName: e });
                  if (selectTable == "1") {
                    dispatch({ type: "treeCheck/checkList", name: selectName });
                  } else {
                    dispatch({ type: "treeCheck/listResultData", name: selectName, treeID });
                  }
                }} />
              </Form.Item>
              <Button style={{ marginLeft: 10 }} onClick={() => {
                dispatch({
                  type: "treeCheck/checkData", name: selectName, treeID, costName: selectCostName, cb: () => {
                    dispatch({ type: "treeCheck/rselectTable", selectTable: "2" });
                    dispatch({ type: "treeCheck/listResultData", name: selectName, treeID });
                  }
                });
              }}>验证</Button>
            </Form>
          </Col>
          <Col span={8}>
            <Button style={{ marginLeft: 10 }} onClick={() => dispatch({ type: "treeCheck/ruploadVisible", visible: true })}>批量导入</Button>
            <Popconfirm
              title={`删除当前数据`}
              description="删除数据不可恢复！确定删除？"
              onConfirm={() => {
                dispatch({ type: "treeCheck/rselectName", selectName: "" });
                dispatch({ type: "treeCheck/checkDel", name: selectName, cb: () => dispatch({ type: "treeCheck/checkNames" }) });
              }}
              onCancel={() => { }}
              okText="确定"
              cancelText="取消"
            ><Button style={{ marginLeft: 10, backgroundColor: "red" }}>删除数据</Button></Popconfirm>
            <Button type="dashed" style={{ marginLeft: 10 }} onClick={() => {
              dispatch({
                type: 'treeCheck/download',
                name: selectName, treeID: treeID,
              })
            }}>批量导出</Button>
            <Segmented style={{ float: "right" }} defaultValue={selectTable}
              options={[{ label: "原始数据", value: "1", icon: <BarsOutlined /> }, { label: "区间列表", value: "2", icon: <AppstoreOutlined /> }]}
              onChange={e => {
                dispatch({ type: "treeCheck/rselectTable", selectTable: e });
                if (e == "1") {
                  dispatch({ type: "treeCheck/checkList", name: selectName });
                } else {
                  dispatch({ type: "treeCheck/listResultData", name: selectName, treeID });
                }
              }}
            />
          </Col>
        </Row>
        {
          selectTable == "1" ?
            <MyTable titles={titles} dataIndexs={dataIndexs} data={pqiData} pagination={pagination}
              onChange={(current, pageSize) => {
                dispatch({ type: "treeCheck/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                dispatch({ type: "treeCheck/checkList", name: selectName });
              }}
              onShowSizeChange={(current, pageSize) => {
                dispatch({ type: "treeCheck/rpagination", pagination: { ...pagination, pageIndex: current, pageSize: pageSize } });
                dispatch({ type: "treeCheck/checkList", name: selectName });
              }}
            /> :
            <MyTable titles={resultTitles} dataIndexs={resultDataIndexs} data={resultData} pagination={resultPagination}
              onChange={(current, pageSize) => {
                dispatch({ type: "treeCheck/rresultPagination", resultPagination: { ...resultPagination, pageIndex: current, pageSize: pageSize } });
                dispatch({ type: "treeCheck/listResultData", name: selectName, treeID });
              }}
              onShowSizeChange={(current, pageSize) => {
                dispatch({ type: "treeCheck/rresultPagination", resultPagination: { ...resultPagination, pageIndex: current, pageSize: pageSize } });
                dispatch({ type: "treeCheck/listResultData", name: selectName, treeID });
              }}
            />
        }

        {uploadVisible ? <MyUpload dispatch={dispatch} visible={uploadVisible} /> : null}
      </>
    );
  }
}

export default TreeCheck;