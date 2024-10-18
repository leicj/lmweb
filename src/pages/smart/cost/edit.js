import { Form, Input, message, Modal, InputNumber} from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "cost/edit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "cost/reditData", editData: { data: {}, visible: false } });
          dispatch({ type: "cost/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "cost/reditData", editData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    form.setFieldsValue({
      _id: data._id, price: data.price, width: data.width,
      depth: data.depth,
    });
  });

  return (
    <Modal title={`编辑(${data.name})`} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑费用清单" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="price" label="单价(元)" rules={[{ required: true, message: "请输入单价" }]}>
          <InputNumber style={{width: 250}} precision={2} />
        </Form.Item>
        <Form.Item name="width" label="宽度(m)">
          <InputNumber style={{width: 250}} precision={2} disabled={data.unit == "m"} />
        </Form.Item>
        <Form.Item name="depth" label="厚度(cm)">
          <InputNumber style={{width: 250}} precision={2} disabled={data.unit == "m" || data.unit == "㎡"} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyEdit;