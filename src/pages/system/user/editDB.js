import { Form, Input, message, Modal, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEditDB = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "user/editDB", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "user/reditDB", editDB: { data: {}, visible: false } });
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
    dispatch({ type: "user/reditDB", editDB: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, db: data.db,
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑数据库" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="db" label="数据库" rules={[{ required: true, message: "请输入数据库DB" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEditDB;