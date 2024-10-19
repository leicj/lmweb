import { Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "company/add", body: values, cb: () => {
          dispatch({ type: "company/raddVisible", visible: false });
          dispatch({ type: "company/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "company/raddVisible", visible: false });
    form.resetFields();
  };
  return (
    <Modal title="新增公司" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增模块工厂" {...layout} ref={formRef}>
        <Form.Item name="运营公司名称" label="运营公司名称" rules={[{ required: true, message: "请输入运营公司名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="序号" label="序号">
          <Input />
        </Form.Item>
        <Form.Item name="运营公司简称" label="运营公司简称">
          <Input />
        </Form.Item>
        <Form.Item name="资产属性" label="资产属性" rules={[{ required: true, message: "请输入运营公司名称" }]}>
          <Select options={[{ "label": "高速公路", "value": "高速公路" }, { "label": "普通国省道", "value": "普通国省道" }]} />
        </Form.Item>
        <Form.Item name="联系人" label="联系人">
          <Input />
        </Form.Item>
        <Form.Item name="联系人手机号" label="联系人手机号">
          <Input />
        </Form.Item>
        <Form.Item name="创建人" label="创建人">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;