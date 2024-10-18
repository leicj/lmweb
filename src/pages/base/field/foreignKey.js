import { Form, Input, message, Modal, Radio } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyForeignKey = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/foreignKeyEdit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "field/rforeignKeyEditData", foreignKeyEditData: { data: {}, visible: false } });
          dispatch({ type: "field/fieldList" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "field/rforeignKeyEditData", foreignKeyEditData: { data: {}, visible: false } });
    form.resetFields();
  };

  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, table: data.table, field: data.field,
    });
  });

  return (
    <Modal title="字段关联" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑字段关联" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="table" label="数据库表名" rules={[{ required: true, message: "请输入表名" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="field" label="数据库字段" rules={[{ required: true, message: "请输入字段" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyForeignKey;