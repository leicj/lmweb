import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Row, Col, Button, Select, message, Popconfirm, Tag } from 'antd';
import MyAdd from './add';
import { COLORS } from '@/constants/index'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

function setTreeColor(jm, treeData) {
  if (!treeData.children || treeData.children.length == 0) return;

  let weight = 0;
  treeData.children.forEach(c => {
    if (c.topic.includes("权重")) {
      weight = parseInt(c.data || 1);
    }
  });
  if (weight > 0) {
    jm.set_node_color(treeData.id, COLORS[(weight - 1) % COLORS.length]);
    treeData.children.forEach(c => {
      jm.set_node_color(c.id, COLORS[(weight - 1) % COLORS.length]);
    })
  }
  // 递归处理
  treeData.children.forEach(c => setTreeColor(jm, c));
}

function delTreeData(tree) {
  if (tree.children&&tree.children.length>0){
    let isDel = false;
    tree.children.forEach(c=> {
      if (['categoryID', 'diseaseCheckResultIDs', 'engineeringLibraryID', 'weight'].includes(c.type)) {
        isDel = true;
      }
    });
    if (isDel) delete tree['children'];
  }
  tree.children&&tree.children.forEach(c => delTreeData(c));
}

function expandTree(tree, startLevel, level) {
  if (startLevel==level) {
    tree.expanded = false;
    return;
  }
  tree.expanded = true;
  tree.children&&tree.children.forEach(c => expandTree(c, startLevel+1, level));
}

function getTreeMaxLevel(tree, level, r) {
  if (level>r.level) {
    r.level = level;
  }
  tree.children&&tree.children.forEach(c => {
    getTreeMaxLevel(c, level+1, r);
  });
}

@connect(({ tree }) => ({ tree }))
class Tree extends Component {
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
    dispatch({ type: "tree/rjm", jm });
  }
  render() {
    const { dispatch, tree } = this.props;
    const { jm, data, selectID, selectNode, diseaseCheckResult, engineeringLibrary, category, level } = tree;
    let mind = {
      meta: {
        name: "养护对策模型",
      },
      format: "node_tree",
      data: { id: "root", topic: "请输入对策模型名称" }
    };
    let maxLevel = 1;
    if (selectID!="") {
      mind = data.filter(d => d._id == selectID)[0].tree;
      expandTree(mind.data, 0, level);
      const r = {"level": 1};
      getTreeMaxLevel(mind.data, 0, r);
      maxLevel = r.level;
    }
    if (jm) {
      jm.show(mind);
      // 相同的权重，用相同的颜色
      setTreeColor(jm, mind.data);
    }

    const selectOptions = data.map(d => ({ "label": d.name, "value": d._id }));

    return (
      <Row>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col span={14}>
            <Select options={selectOptions} style={{ width: 250 }} value={selectID} onChange={e => {
              dispatch({ type: "tree/rselectID", selectID: e });
            }} />
            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => {
              const treedata = jm.get_data("node_tree");
              // 去掉treedata中的对策、工程等数据
              delTreeData(treedata['data']);
              const formData = { name: treedata['data']['topic'], tree: JSON.stringify(treedata) };
              if (selectID!="") {
                dispatch({
                  type: "tree/edit", _id: selectID, formData, cb: () => {
                    dispatch({ type: "tree/list" });
                  }
                });
              } else {
                dispatch({
                  type: "tree/add", formData, cb: () => {
                    dispatch({ type: "tree/list" });
                  }
                })
              }
            }}>保存</Button>

            <Button style={{ marginLeft: 10 }} onClick={() => {
              const node = jm.get_selected_node();
              if (!node) {
                message.error("未选中节点");
                return;
              }

              if (node.children.length > 0) {
                // 判断是否为叶子节点
                const _topic = node.children[0].topic.toLowerCase();
                const t1 = _topic.includes("pqi");
                const t2 = _topic.includes("pci");
                const t3 = _topic.includes("rqi");
                const t4 = _topic.includes("rdi");
                const t5 = _topic.includes("pbi");
                const t6 = _topic.includes("sri");
                const t7 = _topic.includes("pssi");
                if (t1 || t2 || t3 || t4 || t5 || t6 || t7) {
                  message.error("非最后节点，不可补充工程和诊断结果");
                  return;
                }
              } else {
                const _topic = node.topic.toLowerCase();
                const t1 = _topic.includes("pqi");
                const t2 = _topic.includes("pci");
                const t3 = _topic.includes("rqi");
                const t4 = _topic.includes("rdi");
                const t5 = _topic.includes("pbi");
                const t6 = _topic.includes("sri");
                const t7 = _topic.includes("pssi");
                if (!t1 && !t2 && !t3 && !t4 && !t5 && !t6 && !t7) {
                  message.error("非具体指标，不可补充工程和诊断结果");
                  return;
                }
              }
              // 自动触发保存
              const treedata = jm.get_data("node_tree");
              const formData = { name: treedata['data']['topic'], tree: JSON.stringify(treedata) };
              dispatch({
                type: "tree/edit", _id: selectID, formData, cb: () => {
                  dispatch({ type: "tree/list" });
                }
              });
              dispatch({ type: "tree/rselectNode", selectNode: { visible: true, node: node } });
            }}>补充工程和诊断结果</Button>
          </Col>
          <Col span={10}>
            <h1 style={{"display": "inline-block"}}>树的层级：{<Tag color="#108ee9">{level}</Tag>}</h1>
            <Button icon={<ArrowUpOutlined />} onClick={() => {
              dispatch({ type: "tree/rlevel", level: level+1 });
            }} disabled={level>=maxLevel} />
            <Button icon={<ArrowDownOutlined />} onClick={() => {
              dispatch({ type: "tree/rlevel", level: level-1 });
            }} disabled={level<=1} />
            <Button style={{ marginLeft: 15 }} onClick={() => {
              dispatch({ type: "tree/rselectID", selectID: "" });
              dispatch({ type: "tree/rlevel", level: 1 });
            }}>新增模型</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => {
              dispatch({ type: "tree/copy", _id: selectID});
              dispatch({ type: "tree/rselectID", selectID: "" });
              dispatch({ type: "tree/list" });
            }}>复制模型</Button>
            <Popconfirm
              title={`删除当前模型`}
              description="删除模型不可恢复！确定删除？"
              onConfirm={() => {
                dispatch({ type: "tree/rselectID", selectID: "" });
                dispatch({ type: "tree/del", _id: selectID, cb: () => dispatch({ type: "tree/list" }) });
              }}
              onCancel={() => { }}
              okText="确定"
              cancelText="取消"
            ><Button style={{ marginLeft: 10, backgroundColor: "red" }}>删除模型</Button></Popconfirm>
          </Col>
        </Row>
        <div id="jsmind_container" style={{ backgroundColor: "#f4f4f4", height: 1200, width: "100%", marginTop: 10 }}></div>
        {selectNode.visible ? <MyAdd
          dispatch={dispatch} selectID={selectID} visible={selectNode.visible} node={selectNode.node}
          diseaseCheckResult={diseaseCheckResult} engineeringLibrary={engineeringLibrary} category={category}
        /> : null}
      </Row>
    );
  }
}

export default Tree;