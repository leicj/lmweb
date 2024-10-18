import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible})=>{
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/add", formData: values, cb: () => {
          dispatch({ type: "field/raddVisible", visible: false });
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
    dispatch({ type: "field/raddVisible", visible: false });
    form.resetFields();
  };

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增字段工厂" {...layout} ref={formRef}>
        <Form.Item name="no" label="顺序号">
          <Input />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="table" label="数据库表名" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;