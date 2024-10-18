import { Form, Input, Select, message, Modal } from 'antd';
import React, { useState } from 'react';
import MyTag from '@/components/tag';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const onOk = (form) => {
    form.validateFields().then(values => {
      values.tags = tags;
      dispatch({
        type: "diseaseCheckResult/add", formData: values, cb: () => {
          dispatch({ type: "diseaseCheckResult/raddVisible", visible: false });
          dispatch({ type: "diseaseCheckResult/list" });
        }
      });
      setTags([]);
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "diseaseCheckResult/raddVisible", visible: false });
    setTags([]);
    form.resetFields();
  };

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增病害诊断结果" {...layout} ref={formRef}>
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

export default MyAdd;