import {
  Form, Input, InputNumber, message, Modal, Radio, Select, Tabs,
  Cascader, DatePicker, Row, Col, Upload, Button, Card
} from 'antd';
import React from 'react';
import { layout } from '@/constants/index';
import { tsFormat } from '@/components/help';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(weekday);
dayjs.extend(localeData);

const { TextArea } = Input;

const MyFieldEdit = ({ dispatch, visible, data, dataIndexs, groupData, selectApplicationFactory }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      const _id = values._id;
      delete values._id;
      Object.keys(values).forEach(v => {
        // 判断是否为时间类型
        const isDate = values[v] && typeof (values[v].date) == 'function' ? true : false;
        values[v] = isDate ? parseInt((new Date(values[v]).getTime()) / 1000, 10) : values[v];
      })
      dispatch({
        type: "application/fieldEdit",
        formData: values,
        _id: _id,
        applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
        moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
        fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
        cb: () => {
          dispatch({ type: "application/rfieldEditData", fieldEditData: { visible: false, data: {} } });
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
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "application/rfieldEditData", fieldEditData: { visible: false, data: {} } });
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
      formItem = <Input disabled={d1.isRead=="1"} />;
    } else if (d1.style == "1") {
      formItem = <TextArea rows={2} style={{ width: '100%' }} disabled={d1.isRead=="1"} />;
    } else if (d1.style == "2") {
      formItem = <InputNumber min={jsonStr.minValue} max={jsonStr.maxValue} precision={jsonStr.precision} style={{ width: '100%' }} disabled={d1.isRead=="1"} />;
    } else if (d1.style == "3") {
      formItem = <Radio.Group disabled={d1.isRead=="1"}>
        {Object.keys(options).map(k => (<Radio value={k}>{options[k]}</Radio>))}
      </Radio.Group>;
    } else if (d1.style == "4") {
      let selOptions = Object.keys(options).map(k => ({ "value": k, "label": options[k] }));
      formItem = <Select options={selOptions} disabled={d1.isRead=="1"} />;
    } else if (d1.style == "5") {
      let selOptions = Object.keys(options).map(k => ({ "value": k, "label": options[k] }));
      formItem = <Select mode="multiple" options={selOptions} disabled={d1.isRead=="1"} />;
    } else if (d1.style == "6") {
      formItem = <Cascader options={options || []} disabled={d1.isRead=="1"} />;
    } else if (d1.style == "7") {
      if (jsonStr.dateType=="year") {
        formItem = <DatePicker picker="year" style={{ width: '100%' }} disabled={d1.isRead=="1"} />;
      } else if (jsonStr.dateType=="month"){
        formItem = <DatePicker picker="month" style={{ width: '100%' }} disabled={d1.isRead=="1"} />;
      } else if (jsonStr.dateType=="day"){
        formItem = <DatePicker picker="date" style={{ width: '100%' }} disabled={d1.isRead=="1"} />;
      }else {
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
    const [nums, remainder] = [parseInt(d['data'].length / 3), d['data'].length % 3]
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
  console.log("groupData:", groupData)

  React.useEffect(() => {
    const fvs = { '_id': data._id };
    const _id = form.getFieldValue('_id');
    dataIndexs.forEach(k => {
      if (k == 'opr') return;
      // 这里，将数字为10位，当作时间控件对待（如果有一个数字输入框，且值为10位，就冲突了）
      if (typeof (data[k]) == 'number' && `${data[k]}`.length == 10) {
        fvs[k] = dayjs(tsFormat(data[k]).substring(0,10));
      } else {
        fvs[k] = data[k];
      }
    });
    !_id && form.setFieldsValue(fvs);
  });

  return (
    <Modal title={<>编辑<div style={{ color: "gray", fontSize: 12 }}>红色星星的必填是提示，非强制填写</div></>} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 1200 }}>
      <Form form={form} name="编辑字段数据" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Tabs items={items} />
      </Form>
    </Modal>
  );
}

export default MyFieldEdit;