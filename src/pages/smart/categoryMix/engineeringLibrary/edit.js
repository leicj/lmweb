import { Form, Input, message, Modal, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEdit = ({ dispatch, visible, data, engineerings }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "engineeringLibrary/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "engineeringLibrary/reditData", editData: { data: {}, visible: false } });
          dispatch({ type: "engineeringLibrary/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "engineeringLibrary/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    form.setFieldsValue({
      _id: data._id, name: data.name, engineeringids: data.engineeringids,
    });
  });
  const engineeringOptions = engineerings.map(e => ({ label: e.name, value: e._id }));
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 1000 }}>
      <Form form={form} name="编辑工程方案" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入工程名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="engineeringids" label="工程方案" rules={[{ required: true, message: "请选择工程" }]}>
          <Checkbox.Group options={engineeringOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;