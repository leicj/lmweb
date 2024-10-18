import React, { Component } from 'react';
import { connect } from '@umijs/max';
import { Tabs } from 'antd';
import Engineering from '@/pages/smart/categoryMix/engineering';
import EngineeringLibrary from '@/pages/smart/categoryMix/engineeringLibrary';
import DiseaseCheckResult from '@/pages/smart/categoryMix/diseaseCheckResult';
import Category from '@/pages/smart/categoryMix/category';
import Tree from '@/pages/smart/categoryMix/tree';
import TreeCheck from '@/pages/smart/categoryMix/treeCheck';

@connect(({ engineering, engineeringLibrary, diseaseCheckResult, category, tree, treeCheck }) =>
  ({ engineering, engineeringLibrary, diseaseCheckResult, category, tree, treeCheck }))
class CategoryMix extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dispatch, engineering, engineeringLibrary, diseaseCheckResult, category, tree, treeCheck } = this.props;
    let c = <Engineering dispatch={dispatch} engineering={engineering} status={engineering.status} />;
    if (engineering.status == "1") {
      c = <EngineeringLibrary dispatch={dispatch} engineeringLibrary={engineeringLibrary} status={engineering.status} />;
    }
    const expandItems = [
      { key: "1", label: "工程库", children: c },
      { key: "2", label: "病害诊断结果", children: <DiseaseCheckResult dispatch={dispatch} diseaseCheckResult={diseaseCheckResult} /> },
      { key: "3", label: "对策库", children: <Category dispatch={dispatch} category={category} /> },
      { key: "4", label: "决策树", children: <Tree dispatch={dispatch} tree={tree} /> },
      { key: "5", label: "决策树验证", children: <TreeCheck dispatch={dispatch} treeCheck={treeCheck} /> }
    ];
    return <Tabs items={expandItems} style={{ marginLeft: 50, marginRight: 50, marginBottom: 30 }} onChange={e => {
      if (e == "1") {
        dispatch({ type: "engineering/list" });
      } else if (e == "2") {
        dispatch({ type: "diseaseCheckResult/list" });
      } else if (e == "3") {
        dispatch({ type: "category/list" });
      } else if (e == "4") {
        dispatch({ type: "tree/list" });
        dispatch({ type: "tree/listDiseaseCheckResult" });
        dispatch({ type: "tree/listEngineeringLibrary" });
        dispatch({ type: "tree/listCategory" });
      } else if (e == "5") {
        dispatch({ type: "treeCheck/treeList" });
        dispatch({ type: "treeCheck/checkNames", cb: (name) => dispatch({ type: "treeCheck/checkList", name }) });
        dispatch({ type: "treeCheck/listCostNames" });

      }
    }} />;
  }
}

export default CategoryMix;