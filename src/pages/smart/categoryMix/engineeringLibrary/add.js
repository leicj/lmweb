import { Form, Input, message, Modal, Checkbox } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible, engineerings }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "engineeringLibrary/add", formData: values, cb: () => {
          dispatch({ type: "engineeringLibrary/raddVisible", visible: false });
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
    dispatch({ type: "engineeringLibrary/raddVisible", visible: false });
    form.resetFields();
  };

  const engineeringOptions = engineerings.map(e => ({ label: e.name, value: e._id }));
  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 1000 }}>
      <Form form={form} name="新增工程方案" {...layout} ref={formRef}>
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

export default MyAdd;