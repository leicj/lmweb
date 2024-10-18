import { Form, Input, message, Modal, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEdit = ({ dispatch, visible, data, fieldFactoryData }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "module/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "module/reditData", editData: { data: {}, visible: false } });
          dispatch({ type: "module/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "module/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, name: data.name,
      fieldFactoryIDs: data.fieldFactoryIDs,
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑字段工厂" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="fieldFactoryIDs" label="字段集" rules={[{ required: true, message: "请输入名称" }]}>
          <Checkbox.Group>
            {fieldFactoryData.map(d => <Checkbox key={d._id} value={d._id}>{d.name}</Checkbox>)}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;