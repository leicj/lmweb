import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "field/reditData", editData: { data: {}, visible: false } });
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
    dispatch({ type: "field/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, no: data.no, name: data.name,
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑字段工厂" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="no" label="顺序号">
          <Input />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;