import {
  Form, Input, InputNumber, message, Modal, Radio, Select, Tabs,
  Cascader, DatePicker, Row, Col, Upload, Button, Card
} from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const { TextArea } = Input;

const MyFieldAdd = ({ dispatch, visible, groupData, selectApplicationFactory }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      Object.keys(values).forEach(v => {
        // 判断是否为时间类型
        const isDate = values[v] && typeof (values[v].date) == 'function' ? true : false;
        values[v] = isDate ? parseInt((new Date(values[v]).getTime()) / 1000, 10) : values[v];
      })
      dispatch({
        type: "application/fieldAdd",
        formData: values,
        applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
        moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
        fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
        cb: () => {
          dispatch({ type: "application/rfieldAddVisible", visible: false });
          dispatch({
            type: "application/applicationList",
            applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
            moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
            fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
          });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      console.log("error:", info);
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "application/rfieldAddVisible", visible: false });
    form.resetFields();
  };

  function genFormItem(d1) {
    let formItem = <></>;
    let [jsonStr, options] = [{}, {}];
    try {
      jsonStr = d1.jsonStr ? JSON.parse(d1.jsonStr) : {};
    } catch (error) {
      console.error("导入的字段有误：", d1.jsonStr);
    }
    try {
      options = d1.options ? JSON.parse(d1.options) : {};
    } catch (error) {
      console.error("导入的字段有误：", d1.options);
    }
    if (d1.style == "0") {
      formItem = <Input disabled={d1.isRead == "1"} />;
    } else if (d1.style == "1") {
      formItem = <TextArea rows={2} style={{ width: '100%' }} disabled={d1.isRead == "1"} />;
    } else if (d1.style == "2") {
      formItem = <InputNumber min={jsonStr.minValue} max={jsonStr.maxValue} precision={jsonStr.precision} style={{ width: '100%' }} disabled={d1.isRead == "1"} />;
    } else if (d1.style == "3") {
      formItem = <Radio.Group disabled={d1.isRead == "1"}>
        {Object.keys(options).map(k => (<Radio value={k}>{options[k]}</Radio>))}
      </Radio.Group>;
    } else if (d1.style == "4") {
      let selOptions = Object.keys(options).map(k => ({ "value": k, "label": options[k] }));
      formItem = <Select options={selOptions} disabled={d1.isRead == "1"} />;
    } else if (d1.style == "5") {
      let selOptions = Object.keys(options).map(k => ({ "value": k, "label": options[k] }));
      formItem = <Select mode="multiple" options={selOptions} disabled={d1.isRead == "1"} />;
    } else if (d1.style == "6") {
      formItem = <Cascader options={options || []} disabled={d1.isRead == "1"} />;
    } else if (d1.style == "7") {
      if (["year", "month", "day"].includes(jsonStr.dateType)) {
        formItem = <DatePicker picker={jsonStr.dateType} style={{ width: '100%' }} disabled={d1.isRead == "1"} />;
      } else {
        // 先不支持到秒
      }
    } else if (d1.style == "8") {
      formItem = <Upload name="file" maxCount={jsonStr.maxNum} accept={jsonStr.suffix} disabled={d1.isRead == "1"}>
        <Button disabled={d1.isRead == "1"}>点击上传文件</Button>
      </Upload>;
    }
    return formItem;
  }
  function genItemChildren(d) {
    const [nums, remainder] = [parseInt(d['data'].length / 3), d['data'].length % 3];
    let index = 0;
    let rs = [];
    for (let i = 0; i < nums; i++) {
      let [d1, d2, d3] = [d['data'][index], d['data'][index + 1], d['data'][index + 2]];
      rs.push(<Row style={{ width: '100%' }}>
        <Col span={8}>
          <Form.Item name={d1['field']} label={<>{d1['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d1['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d1)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={d2['field']} label={<>{d2['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d2['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d2)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={d3['field']} label={<>{d3['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d3['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d3)}
          </Form.Item>
        </Col>
      </Row>);
      index += 3;
    }
    if (remainder == 1) {
      let d1 = d['data'][index];
      rs.push(<Row style={{ width: '100%' }}>
        <Col span={8}>
          <Form.Item name={d1['field']} label={<>{d1['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d1['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d1)}
          </Form.Item>
        </Col>
      </Row>)
    } else if (remainder == 2) {
      let [d1, d2] = [d['data'][index], d['data'][index + 1]];
      rs.push(<Row style={{ width: '100%' }}>
        <Col span={8}>
          <Form.Item name={d1['field']} label={<>{d1['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d1['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d1)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={d2['field']} label={<>{d2['isRequired']=="1" ? <div style={{ color: "red" }}>*</div> : null}{d2['name']}</>} style={{ "width": '100%' }}>
            {genFormItem(d2)}
          </Form.Item>
        </Col>
      </Row>)
    }
    return <Row>{rs}</Row>;
  }

  function genItemLevel2Children(d) {
    return d['children'].map(c => {
      let _index = c.group.indexOf("/");
      return <Card title={c.group.slice(_index + 1)}>{genItemChildren(c)}</Card>
    })
  }

  const item0 = groupData[0].map(d => ({ "key": d['group'], "label": d['group'], "children": genItemChildren(d) }))
  const item1 = groupData[1].map(d => ({ "key": d['group'], "label": d['group'], "children": genItemChildren(d) }));
  const item2 = groupData[2].map(d => ({ "key": d['group'], "label": d['group'], "children": genItemLevel2Children(d) }));
  const items = item1.concat(item2).concat(item0);

  return (
    <Modal title={<>新增<div style={{ color: "gray", fontSize: 12 }}>红色星星的必填是提示，非强制填写</div></>} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 1200 }}>
      <Form form={form} name="新增字段数据" {...layout} ref={formRef}>
        <Tabs items={items} />
      </Form>
    </Modal>
  );
}

export default MyFieldAdd;