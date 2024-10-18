import { Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyRuleAdd = ({dispatch,visible,allData})=>{
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/ruleAdd", formData: values, cb: () => {
          dispatch({ type: "field/rruleAddVisible", visible: false });
          dispatch({ type: "field/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "field/rruleAddVisible", visible: false });
    form.resetFields();
  };
  
  const selectOptions = allData.map(d => ({ "label": d.name, "value": d._id }));
  return (
    <Modal title="新增插件" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增插件" {...layout} ref={formRef}>
        <Form.Item name="sourceFieldFactoryID" label="原字段集" rules={[{ required: true, message: "请输入名称" }]}>
          <Select options={selectOptions} />
        </Form.Item>
        <Form.Item name="targetFieldFactoryID" label="目标字段集" rules={[{ required: true, message: "请输入名称" }]}>
          <Select options={selectOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyRuleAdd;