import React, { Component } from 'react';
import { Row, Col, Modal, Form } from 'antd';
import twoLevel from '@/assets/images/双层结构.png';
import threeLevel from '@/assets/images/三层结构.png';

class BridgeRule extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const options = {
      container: 'jsmind_container',
      editable: true,
      theme: 'success',
      mode: 'full',
    };
    var jm = new jsMind(options);
    dispatch({ type: "application/rjm", jm });
  }

  render() {
    const { dispatch, visible, rows, jm, data, selectApplicationFactory, sourceField } = this.props;
    const insertID2Children = (rows, children) => {
      children.forEach(c => {
        rows.forEach(r => {
          if (r[sourceField] == c.topic) {
            c._id = r._id;
          }
        })
        if (c.children && c.children.length > 0) {
          insertID2Children(rows, c.children);
        }
      });
    }
    const onOk = () => {
      const treeData = jm.get_data("node_tree");
      // 将id存入叶子节点中
      insertID2Children(rows, treeData.data && treeData.data.children);
      const formData = treeData.data;
      formData['field'] = sourceField;
      dispatch({
        type: "application/ruleAdd",
        formData: formData,
        applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
        moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
        fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
        ruleID: data._id,
        cb: () => {
          dispatch({ type: "application/rselrows", selrows: { selectedRowKeys: [], selectedRows: [] } });
          dispatch({ type: "application/rbridgeRuleAdd", bridgeRuleAdd: { data: {}, visible: false } });
          dispatch({
            type: "application/applicationList",
            applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
            moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
            fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
          });
        }
      })
    }
    const onCancel = () => {
      dispatch({ type: "application/rselrows", selrows: { selectedRowKeys: [], selectedRows: [] } });
      dispatch({ type: "application/rbridgeRuleAdd", bridgeRuleAdd: { data: {}, visible: false } });
    };

    let mind = {
      meta: {
        name: "桥梁规则",
      },
      format: "node_tree",
      data: { id: "root", topic: "请输入桥梁名称" }
    };
    if (jm) {
      jm.show(mind);
    }

    return (
      <Modal title={<>新增<div style={{ color: "gray", fontSize: 12 }}>叶子节点是桥幅，根节点是桥梁，中间节点（如果有的话）只起到分类作用</div></>} open={visible} onOk={() => onOk()} onCancel={() => onCancel()} style={{ minWidth: 1000 }}>
        <Row>
          <Col span={12}>
            <img src={twoLevel} style={{ width: 480, height: 280, marginRight: 20 }} />
          </Col>
          <Col span={12}>
            <img src={threeLevel} style={{ width: 480, height: 280, marginLeft: 20 }} />
          </Col>
        </Row>
        <Row>
          <Form layout="inline">
            {rows.map(r => <Form.Item label="桥幅名称">{r[sourceField]}</Form.Item>)}
          </Form>
        </Row>
        <div id="jsmind_container" style={{ backgroundColor: "#f4f4f4", height: 400, width: "100%", marginTop: 10 }}></div>
      </Modal>
    );
  }
}

export default BridgeRule;