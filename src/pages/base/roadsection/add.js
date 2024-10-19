import { Form, Input, message, Modal, Select, InputNumber, DatePicker } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyAdd = ({ dispatch, visible, roaddata, companydata }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "roadsection/add", body: values, cb: () => {
          dispatch({ type: "roadsection/raddVisible", visible: false });
          dispatch({ type: "roadsection/list" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "roadsection/raddVisible", visible: false });
    form.resetFields();
  };
  const optionsByRoad = roaddata.map((d, i, arr) => {
    return { "label": d.路线名称, "value": d.Id }
  });
  const optionsByCompany = companydata.map((d, i, arr) => {
    return { "label": d.运营公司简称, "value": d.Id }
  });
  return (
    <Modal title="新增路段" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 600 }}>
      <Form form={form} name="新增路段" {...layout} ref={formRef}>
        <Form.Item name="路段名称" label="路段名称" rules={[{ required: true, message: "请输入路段名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="路线档案" label="路线档案">
          <Select options={optionsByRoad} />
        </Form.Item>
        <Form.Item name="运营公司" label="运营公司">
          <Select options={optionsByCompany} />
        </Form.Item>
        <Form.Item name="序号" label="序号">
          <Input />
        </Form.Item>
        <Form.Item name="巡检办" label="巡检办">
          <Input />
        </Form.Item>
        <Form.Item name="建设期路段名称" label="建设期路段名称">
          <Input />
        </Form.Item>
        <Form.Item name="起点桩号" label="起点桩号">
          <InputNumber style={{ width: "100%" }} precision={2} min={0} placeholder='米级别' />
        </Form.Item>
        <Form.Item name="终点桩号" label="终点桩号">
          <InputNumber style={{ width: "100%" }} precision={2} min={0} placeholder='米级别' />
        </Form.Item>
        <Form.Item name="里程长度" label="里程长度（km）">
          <InputNumber style={{ width: "100%" }} precision={3} min={0} placeholder='公里级别' />
        </Form.Item>
        <Form.Item name="通车时间" label="通车时间">
          <DatePicker picker={"day"} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="缺陷责任期结束时间" label="缺陷责任期结束时间">
          <DatePicker picker={"day"} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="竣工验收时间" label="竣工验收时间">
          <DatePicker picker={"day"} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="路段收费性质" label="路段收费性质">
          <Select options={[{ "label": "还贷", "value": "还贷" }, { "label": "经营", "value": "经营" }, { "label": "非收费", "value": "非收费" }, { "label": "未收费", "value": "未收费" }]} />
        </Form.Item>
        <Form.Item name="车道数量" label="车道数量">
          <Select options={[{ "label": "双向四车道", "value": "双向四车道" }, { "label": "双向六车道", "value": "双向六车道" }, { "label": "双向八车道", "value": "双向八车道" }, { "label": "双向十车道", "value": "双向十车道" }]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyAdd;