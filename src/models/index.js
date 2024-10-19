// const API = "http://localhost:8001"
const API = "http://localhost:8080";
const GLOBAL = {
  "company": `${API}/api/v2/tables/m8qw4atiqvnfi12/records`,
  "road": `${API}/api/v2/tables/m0pod6cru7p2bb0/records`,
  "roadsection": `${API}/api/v2/tables/m7vi991pypdvxyh/records`,
  "roadsectionroadlink": `${API}/api/v2/tables/m7vi991pypdvxyh/links/cihylgqnj3ulwkl/records`,
  "roadsectioncompanylink": `${API}/api/v2/tables/m7vi991pypdvxyh/links/cq2dvae00r86diq/records`,
  "project": `${API}/api/v2/tables/mykd612pao0j5md/records`,
  "projectroadsectionlink": `${API}/api/v2/tables/mykd612pao0j5md/links/cujdolixvnatx2c/records`,
}

const GLOBAL1 = {
  // ===============================基础数据========================
  // 路线管理
  "road": `${API}/road`,
  "roadDownload": `${API}/road/download`,
  "roadUpload": `${API}/road/upload`,
  "roadDownloadTemplate": `${API}/static/路线批量导入模板.xlsx`,

  // 路段管理
  "roadsection": `${API}/roadsection`,
  "roadsectionDownload": `${API}/roadsection/download`,
  "roadsectionUpload": `${API}/roadsection/upload`,
  "roadsectionDownloadTemplate": `${API}/static/路段批量导入模板.xlsx`,

  // 单位管理
  "company": `${API}/company`,

  // 通车时间
  "roadopentime": `${API}/roadopentime`,

  // 车道数量
  "roadlane": `${API}/roadlane`,

  // 桥梁分段
  "roadslicebridge": `${API}/roadslicebridge`,
  "roadslicebridgeDownload": `${API}/roadslicebridge/download`,
  "roadslicebridgeUpload": `${API}/roadslicebridge/upload`,
  "roadslicebridgeDownloadTemplate": `${API}/static/桥隧分段桥梁批量导入模板.xlsx`,
  // 隧道分段
  "roadslicetunnel": `${API}/roadslicetunnel`,
  "roadslicetunnelDownload": `${API}/roadslicetunnel/download`,
  "roadslicetunnelUpload": `${API}/roadslicetunnel/upload`,
  "roadslicetunnelDownloadTemplate": `${API}/static/桥隧分段隧道批量导入模板.xlsx`,

  // 养护历史
  "roadhistory": `${API}/roadhistory`,
  "roadhistoryBatchDel": `${API}/roadhistory/batchdel`,
  "roadhistoryDownload": `${API}/roadhistory/download`,
  "roadhistoryUpload": `${API}/roadhistory/upload`,
  "roadhistoryDownloadTemplate": `${API}/static/养护历史批量导入模板.xlsx`,

  // 材料管理
  "roadmaterial": `${API}/roadmaterial`,
  "roadmaterialDownload": `${API}/roadmaterial/download`,
  "roadmaterialUpload": `${API}/roadmaterial/upload`,
  "roadmaterialDownloadTemplate": `${API}/static/材料批量导入模板.xlsx`,

  // ===============================养护智能决策========================
  "engineering": `${API}/smart/engineering`,
  "engineeringLibrary": `${API}/smart/engineeringLibrary`,
  "diseaseCheckResult": `${API}/smart/diseaseCheckResult`,
  "category": `${API}/smart/category`,
  "tree": `${API}/smart/tree`,
  "treeNode": `${API}/smart/tree/node`,
  "treeCheck": `${API}/smart/treecheck`,
  "treeCheckTemplate": `${API}/static/决策树验证导入模板.xlsx`,
  // 养护决策模型
  "solution": `${API}/smart/solution`,
  "solutionCheckNames": `${API}/smart/solutioncheck/names`,
  "solutionCheck": `${API}/smart/solutioncheck`,
  "solutionCheckResult": `${API}/smart/solutioncheckresult`,
  // 养护费用模型
  "costNames": `${API}/smart/cost/names`,
  "cost": `${API}/smart/cost`,

  // ===============================通用管理管理========================
  "cookie": `${API}/cookie`,
  // ===============================基础字段管理========================
  "fieldFactory": `${API}/base/fieldFactory`,
  "field": `${API}/base/field`,
  "fieldTemplate": `${API}/static/base/字段批量导入模板.xlsx`,
  "moduleFactory": `${API}/base/moduleFactory`,
  "module": `${API}/base/module`,
  "applicationFactory": `${API}/base/applicationFactory`,
  "application": `${API}/base/application`,
  // ===============================规则配置管理========================
  "rule": `${API}/rule`,
  "rule_bridge": `${API}/rule/bridge`,
  // ===============================系统管理========================
  "user": `${API}/system/user`,
}

export default GLOBAL;