export const ROADSTATUS = [{ value: "0", label: "规划" }, { value: "1", label: "新建" }, { value: "2", label: "运营" }, { value: "3", label: "改扩建" }]
export const mapROADSTATUSKV = {};
export const mapROADSTATUSVK = {};
ROADSTATUS.forEach(v => {
  mapROADSTATUSKV[v.value] = v.label;
  mapROADSTATUSVK[v.label] = v.value
});

export const ROADTECH = [{ value: "0", label: "高速公路" }, { value: "1", label: "一级公路" }, { value: "2", label: "二级公路" }, { value: "3", label: "三级公路" }, { value: "4", label: "四级公路" }]
export const mapROADTECHKV = {};
export const mapROADTECHVK = {};
ROADTECH.forEach(v => {
  mapROADTECHKV[v.value] = v.label;
  mapROADTECHVK[v.label] = v.value;
});

export const COMPANYPROPERTY = [{ value: "0", label: "集团" }, { value: "1", label: "运营公司" }, { value: "2", label: "子公司" }, { value: "3", label: "子部门" }]
export const mapCOMPANYPROPERTYKV = {};
export const mapCOMPANYPROPERTYVK = {};
COMPANYPROPERTY.forEach(v => {
  mapCOMPANYPROPERTYKV[v.value] = v.label;
  mapCOMPANYPROPERTYVK[v.label] = v.value;
});

export const DIRECTION = [{ value: "0", label: "全幅" }, { value: "1", label: "上行" }, { value: "2", label: "下行" }]
export const mapDIRECTIONKV = {};
export const mapDIRECTIONVK = {};
DIRECTION.forEach(v => {
  mapDIRECTIONKV[v.value] = v.label;
  mapDIRECTIONVK[v.label] = v.value;
});

export const TIMETYPE = [{ value: "0", label: "新建通车时间" }, { value: "1", label: "改建通车时间" }, { value: "2", label: "扩建通车时间" }]
export const mapTIMETYPEKV = {};
export const mapTIMETYPEVK = {};
TIMETYPE.forEach(v => {
  mapTIMETYPEKV[v.value] = v.label;
  mapTIMETYPEVK[v.label] = v.value;
});

export const LANE = [{ value: "1", label: "第一车道" }, { value: "2", label: "第二车道" }, { value: "3", label: "第三车道" }, { value: "4", label: "第四车道" }, { value: "5", label: "第五车道" }, { value: "6", label: "硬路肩" }]
export const mapLANEKV = {};
export const mapLANEVK = {};
LANE.forEach(v => {
  mapLANEKV[v.value] = v.label;
  mapLANEVK[v.label] = v.value;
});

export const FIXTYPE = [{ value: "0", label: "大修养护" }, { value: "1", label: "中修养护" }, { value: "2", label: "预防养护" }, { value: "3", label: "功能性修复" }, { value: "4", label: "结构性修复" }]
export const mapFIXTYPEKV = {};
export const mapFIXTYPEVK = {};
FIXTYPE.forEach(v => {
  mapFIXTYPEKV[v.value] = v.label;
  mapFIXTYPEVK[v.label] = v.value;
});

export const ROADTYPE = [{ value: "0", label: "沥青路面" }, { value: "1", label: "水泥路面" }]
export const mapROADTYPEKV = {};
export const mapROADTYPEVK = {};
ROADTYPE.forEach(v => {
  mapROADTYPEKV[v.value] = v.label;
  mapROADTYPEVK[v.label] = v.value;
});

export const MATERIALLEVEL = [{ value: "0", label: "面层" }, { value: "1", label: "基层" }]
export const mapMATERIALLEVELKV = {};
export const mapMATERIALLEVELVK = {};
MATERIALLEVEL.forEach(v => {
  mapMATERIALLEVELKV[v.value] = v.label;
  mapMATERIALLEVELVK[v.label] = v.value;
});

export const UNITS = [{ value: "m", label: "m(米)" }, { value: "㎡", label: "㎡(平方米)" }, { value: "m³", label: "m³(立方米)" }]
export const mapUNITSKV = {};
export const mapUNITSVK = {};
UNITS.forEach(v => {
  mapUNITSKV[v.value] = v.label;
  mapUNITSVK[v.label] = v.value;
});

export const ROADSTRUCT = [{ value: "0", label: "路" }, { value: "1", label: "桥" }, { value: "2", label: "隧" }]
export const mapROADSTRUCTKV = {};
export const mapROADSTRUCTVK = {};
ROADSTRUCT.forEach(v => {
  mapROADSTRUCTKV[v.value] = v.label;
  mapROADSTRUCTVK[v.label] = v.value;
});

export const CONSERVATION = [{ value: "0", label: "预防养护" }, { value: "1", label: "修复养护" }, { value: "2", label: "日常养护" }]
export const mapCONSERVATIONKV = {};
export const mapCONSERVATIONVK = {};
CONSERVATION.forEach(v => {
  mapCONSERVATIONKV[v.value] = v.label;
  mapCONSERVATIONVK[v.label] = v.value;
});

export const FIELDSTYLE = [
  { value: "0", label: "输入框(单行)" }, { value: "1", label: "输入框(多行)" }, { value: "2", label: "数字输入框" },
  { value: "3", label: "单选框" }, { value: "4", label: "选择器(单选)" }, { value: "5", label: "选择器(多选)" },
  { value: "6", label: "级联选择" }, { value: "7", label: "日期选择框" }, { value: "8", label: "上传(文件、图片)" }
]
export const mapFIELDSTYLEKV = {};
export const mapFIELDSTYLEVK = {};
FIELDSTYLE.forEach(v => {
  mapFIELDSTYLEKV[v.value] = v.label;
  mapFIELDSTYLEVK[v.label] = v.value;
});

export const FORMAT = [
  { "label": "无", "value": "" }, { "label": "桩号格式化", "value": "0" }
];
export const mapFORMATKV = {};
export const mapFORMATVK = {};
FORMAT.forEach(v => {
  mapFORMATKV[v.value] = v.label;
  mapFORMATVK[v.label] = v.value;
});

export const COLORS = ["lime", "blue", "gray", "maroon", "green", "red", "yellow"];

export const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};