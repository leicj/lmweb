import { Form, Input, Select, message, Modal } from 'antd';
import React, { useState } from 'react';
import { UNITS, layout } from '@/constants/index';
import MyTag from '@/components/tag';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const onOk = (form) => {
    form.validateFields().then(values => {
      values.tags = tags;
      dispatch({
        type: "engineering/add", formData: values, cb: () => {
          dispatch({ type: "engineering/raddVisible", visible: false });
          dispatch({ type: "engineering/list" });
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
    dispatch({ type: "engineering/raddVisible", visible: false });
    setTags([]);
    form.resetFields();
  };

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增工程" {...layout} ref={formRef}>
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

export default MyAdd;