import { Form, Input, message, Modal, Radio } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyLink = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "field/linkEdit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "field/rlinkEditData", linkEditData: { data: {}, visible: false } });
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
    dispatch({ type: "field/rlinkEditData", linkEditData: { data: {}, visible: false } });
    form.resetFields();
  };

  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id, table: data.table, field: data.field,
      opr: data.opr, oprValue: data.oprValue,
    });
  });

  return (
    <Modal title="字段组合" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="编辑字段组合" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="table" label="数据库表名" rules={[{ required: true, message: "请输入表名" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="field" label="数据库字段" rules={[{ required: true, message: "请输入字段" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="opr" label="组合方式" rules={[{ required: true, message: "请选择组合方式" }]}>
          <Radio.Group>
            <Radio value="join">分隔符拼接</Radio>
            <Radio value="sum">求和</Radio>
            <Radio value="max">最大值</Radio>
            <Radio value="min">最小值</Radio>
            <Radio value="avg">平均值</Radio>
            <Radio value="same">去重取一</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="oprValue" label="拼接字段">
          <Input placeholder="默认为逗号拼接" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyLink;