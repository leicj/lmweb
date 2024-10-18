import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyCopy = ({ dispatch, visible, copyName }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "cost/copy", copyName, name: values.name, cb: () => {
          dispatch({ type: "cost/rcopyData", copyData: { copyName: "", visible: false } });
          dispatch({ type: "cost/rselectName", selectName: values.name });
          dispatch({ type: "cost/listNames" });
          dispatch({ type: "cost/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "cost/rcopyData", copyData: { copyName: "", visible: false } });
    form.resetFields();
  };

  return (
    <Modal title={`复制模型(${copyName})`} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="复制模型" {...layout} ref={formRef}>
        <Form.Item name="name" label="模型名称" rules={[{ required: true, message: "请输入模型名称" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyCopy;