import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyUniqueEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/uniqueEdit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "field/runiqueEditData", uniqueEditData: { data: {}, visible: false } });
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
    dispatch({ type: "field/runiqueEditData", uniqueEditData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, unique: data.unique,
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑唯一性字段" {...layout} ref={formRef}>
        <h3>唯一性字段用“+”号连接，如“bridge_name+road_name”</h3>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="unique" label="数据库唯一性" rules={[{ required: true, message: "请输入唯一性字段，+号关联" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyUniqueEdit;