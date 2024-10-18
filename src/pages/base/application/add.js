import { Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible, moduleFactoryData }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "application/add", formData: values, cb: () => {
          dispatch({ type: "application/raddVisible", visible: false });
          dispatch({ type: "application/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "application/raddVisible", visible: false });
    form.resetFields();
  };
  const options = moduleFactoryData.map(d => ({ "label": d.name, "value": d._id }));

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增实例工厂" {...layout} ref={formRef}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="moduleFactoryID" label="模块" rules={[{ required: true, message: "请选择模块" }]}>
          <Select options={options} />
        </Form.Item>
        <Form.Item name="db" label="数据库DB" rules={[{ required: true, message: "请输入数据库DB" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;