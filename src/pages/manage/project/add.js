import { Form, Input, message, Modal, Select, InputNumber, DatePicker } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible, roadsectiondata }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "project/add", body: values, cb: () => {
          dispatch({ type: "project/raddVisible", visible: false });
          dispatch({ type: "project/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "project/raddVisible", visible: false });
    form.resetFields();
  };
  const optionsByRoadsection = roadsectiondata.map((d, i, arr) => {
    return { "label": d.路段名称, "value": d.Id }
  });
  return (
    <Modal title="新增项目" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增项目" {...layout} ref={formRef}>
        <Form.Item name="项目名称" label="项目名称" rules={[{ required: true, message: "请输入项目名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="路段档案" label="路段档案">
          <Select options={optionsByRoadsection} />
        </Form.Item>
        <Form.Item name="检测年份" label="检测年份">
          <InputNumber />
        </Form.Item>
        <Form.Item name="委托方" label="委托方">
          <Input />
        </Form.Item>
        <Form.Item name="检测开始时间" label="检测开始时间">
          <DatePicker picker='day' style={{ width: '100%' }}  />
        </Form.Item>
        <Form.Item name="检测结束时间" label="检测结束时间">
          <DatePicker picker='day' style={{ width: '100%' }}  />
        </Form.Item>
        <Form.Item name="所属部门" label="所属部门">
          <Input />
        </Form.Item>
        <Form.Item name="项目负责人" label="项目负责人">
          <Input />
        </Form.Item>
        <Form.Item name="检测人员" label="检测人员">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;