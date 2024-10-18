import { Form, Input, message, Modal} from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEditName = ({ dispatch, visible, selectName }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      if (selectName == values.name) {
        dispatch({ type: "cost/reditNameVisible", visible: false });
        form.resetFields();
        return;
      }
      dispatch({
        type: "cost/editName", sourceName: selectName, name: values.name, cb: () => {
          dispatch({ type: "cost/reditNameVisible", visible: false });
          dispatch({ type: "cost/listNames" });
          dispatch({ type: "cost/rselectName", selectName: values.name });
          dispatch({ type: "cost/list", name: values.name });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "cost/reditNameVisible", visible: false });
    form.resetFields();
  };
  React.useEffect(() => {
    form.setFieldsValue({
      name: selectName,
    });
  });

  return (
    <Modal title={`编辑(${selectName})`} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑费用模型" {...layout} ref={formRef}>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入模型名称" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEditName;