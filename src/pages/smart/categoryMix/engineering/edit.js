import { Form, Input, Select, message, Modal, InputNumber } from 'antd';
import React, { useState } from 'react';
import { UNITS, layout } from '@/constants/index';
import MyTag from '@/components/tag';

const MyEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState(data.tags);
  const onOk = (form) => {
    form.validateFields().then(values => {
      values.tags = tags;
      dispatch({
        type: "engineering/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "engineering/reditData", editData: { data: {}, visible: false } });
          dispatch({ type: "engineering/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "engineering/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, name: data.name, unit: data.unit
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑工程" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入工程名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unit" label="单位" rules={[{ required: true, message: "请选择单位" }]}>
          <Select options={UNITS} />
        </Form.Item>
        <Form.Item name="tags" label="标签">
          <MyTag tags={tags} setTags={setTags} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;