import { Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "road/add", body: values, cb: () => {
          dispatch({ type: "road/raddVisible", visible: false });
          dispatch({ type: "road/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "road/raddVisible", visible: false });
    form.resetFields();
  };
  return (
    <Modal title="新增路线" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增路线" {...layout} ref={formRef}>
        <Form.Item name="路线编码" label="路线编码" rules={[{ required: true, message: "请输入路线编码" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="序号" label="序号">
          <Input />
        </Form.Item>
        <Form.Item name="路线名称" label="路线名称" rules={[{ required: true, message: "请输入路线名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="路线技术等级" label="路线技术等级" rules={[{ required: true, message: "请选择路线技术等级" }]}>
          <Select options={[
            { "label": "高速公路", "value": "高速公路" },
            { "label": "一级公路", "value": "一级公路" },
            { "label": "二级公路", "value": "二级公路" },
            { "label": "三级公路", "value": "三级公路" },
            { "label": "四级公路", "value": "四级公路" },
            { "label": "其他", "value": "其他" },
          ]} />
        </Form.Item>
        <Form.Item name="路线行政等级" label="路线行政等级" rules={[{ required: true, message: "请选择路线行政等级" }]}>
          <Select options={[
            { "label": "国道", "value": "国道" },
            { "label": "省道", "value": "省道" },
            { "label": "县道", "value": "县道" },
            { "label": "乡道", "value": "乡道" },
            { "label": "其他", "value": "其他" },
          ]} />
        </Form.Item>
        <Form.Item name="路面类型" label="路面类型" rules={[{ required: true, message: "请选择路面类型" }]}>
          <Select options={[
            { "label": "沥青混凝土", "value": "沥青混凝土" },
            { "label": "水泥混凝土", "value": "水泥混凝土" },
            { "label": "沥青碎石", "value": "沥青碎石" },
            { "label": "碎石", "value": "碎石" },
            { "label": "砾石", "value": "砾石" },
            { "label": "其他", "value": "其他" },
          ]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;