import { Form, Input, message, Modal, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "user/add", formData: values, cb: () => {
          dispatch({ type: "user/raddVisible", visible: false });
          dispatch({ type: "user/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "user/raddVisible", visible: false });
    form.resetFields();
  };

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增用户" {...layout} ref={formRef}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="pwd" label="密码" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;