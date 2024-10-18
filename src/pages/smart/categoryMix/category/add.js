import { Form, Input, Select, message, Modal } from 'antd';
import React from 'react';
import { ROADSTRUCT, CONSERVATION, layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "category/add", formData: values, cb: () => {
          dispatch({ type: "category/raddVisible", visible: false });
          dispatch({ type: "category/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "category/raddVisible", visible: false });
    form.resetFields();
  };

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增对策" {...layout} ref={formRef}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入对策名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="养护状态" rules={[{ required: true, message: "请选择养护状态" }]}>
          <Select options={CONSERVATION} />
        </Form.Item>
        <Form.Item name="struct" label="路面结构" rules={[{ required: true, message: "请选择路面结构" }]}>
          <Select options={ROADSTRUCT} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;