import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import MyTag from '@/components/tag';
import { layout } from '@/constants/index';

const MyEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState(data.tags);
  const onOk = (form) => {
    form.validateFields().then(values => {
      values.tags = tags;
      dispatch({
        type: "diseaseCheckResult/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "diseaseCheckResult/reditData", editData: { data: {}, visible: false } });
          dispatch({ type: "diseaseCheckResult/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "diseaseCheckResult/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    form.setFieldsValue({
      _id: data._id, name: data.name
    });
  });
  return (
    <Modal title="编辑" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑病害诊断结果" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入病害诊断结果名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tags" label="标签">
          <MyTag tags={tags} setTags={setTags} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;