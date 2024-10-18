import { Form, Input, Select, message, Modal, InputNumber, Radio, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, selectID, visible, node, diseaseCheckResult, engineeringLibrary, category }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      const formData = {
        "treeID": selectID, "nodeID": node.id, "categoryID": values.category,
        "diseaseCheckResultIDs": values.diseaseCheckResult, "engineeringLibraryID": values.engineeringLibrary,
        "weight": values.weight,
      }
      dispatch({ type: "tree/addNode", formData, cb: () => {
        dispatch({ type: "tree/rselectNode", selectNode: { visible: false, node: {} } });
        dispatch({ type: "tree/list"});
        dispatch({ type: "tree/listDiseaseCheckResult"});
        dispatch({ type: "tree/listEngineeringLibrary"});
        dispatch({ type: "tree/listCategory"});
      }});
      form.resetFields();
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "tree/rselectNode", selectNode: { visible: false, node: {} } });
    form.resetFields();
  }

  React.useEffect(() => {
    if (node.children&&node.children.length>0){
      let diseaseCheckResult, engineeringLibrary, category, weight;
      node.children.forEach(c => {
        if (c.data.type=='categoryID') category = c.data.data;
        if (c.data.type=='diseaseCheckResultIDs') diseaseCheckResult = c.data.data;
        if (c.data.type=='engineeringLibraryID') engineeringLibrary = c.data.data;
        if (c.data.type=='weight') weight = c.data.data;
      });
      form.setFieldsValue({
        diseaseCheckResult, engineeringLibrary, category, weight,
      });
    }
  });

  const diseaseCheckResultOptions = diseaseCheckResult.map(d => ({ label: d.name, value: d._id }));
  const engineeringLibraryOptions = engineeringLibrary.map(d => ({ label: d.name, value: d._id }));
  const categoryOptions = category.map(d => ({ label: d.name, value: d._id }));

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 700 }}>
      <Form form={form} name="补充对策、工程和诊断结果" {...layout} ref={formRef}>
        <Form.Item name="diseaseCheckResult" label="病害诊断结果" rules={[{ required: true, message: "请选择病害诊断结果" }]}>
          <Checkbox.Group options={diseaseCheckResultOptions} />
        </Form.Item>
        <Form.Item name="engineeringLibrary" label="工程方案" rules={[{ required: true, message: "请选择工程方案" }]}>
          <Radio.Group options={engineeringLibraryOptions} />
        </Form.Item>
        <Form.Item name="category" label="对策" rules={[{ required: true, message: "请选择对策" }]}>
          <Radio.Group options={categoryOptions} />
        </Form.Item>
        <Form.Item name="weight" label="权重" rules={[{ required: true, message: "请输入权重" }]}>
          <InputNumber min={1} max={9.9} precision={1} placeholder='1.0~9.9' />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;