import { Form, Input, message, Modal, Row, Col, Select, InputNumber, Radio } from 'antd';
import React, { useState } from 'react';
import { layout, FIELDSTYLE } from '@/constants/index';

const { TextArea } = Input;

const MyFieldEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [style, setStyle] = useState(data.style);
  const onOk = (form) => {
    form.validateFields().then(values => {
      try {
        if (values.style == "3" || values.style == "4" || values.style == "5" || values.style == "6") {
          JSON.parse(values.options);
        }
      } catch (error) {
        message.error("输入的下拉选项非json格式，请检查数据");
        return;
      }
      let formData = {
        "fieldFactoryID": values.fieldFactoryID, "no": values.no, "field": values.field, "name": values.name,
        "style": values.style, "unit": values.unit,
        "definition": values.definition, "description": values.description, "example": values.example,
      };
      if (values.style == "0" || values.style == "1") {
        formData["jsonStr"] = JSON.stringify({ "regex": values.regex, "regexDescription": values.regexDescription });
      } else if (values.style == "2") {
        if (values.minValue > values.maxValue) {
          message.error("最小值大于最大值，请检查数据！");
          return;
        }
        formData["jsonStr"] = JSON.stringify({ "maxValue": values.maxValue, "minValue": values.minValue, "precision": values.precision });
      } else if (values.style == "3" || values.style == "4" || values.style == "5" || values.style == "6") {
        formData["options"] = values.options;
      } else if (values.style == "7") {
        formData["jsonStr"] = JSON.stringify({ "dateType": values.dateType });
      } else if (values.style == "8") {
        values.suffix = values.suffix.replaceAll("，", ",");
        formData["jsonStr"] = JSON.stringify({ "suffix": values.suffix, "maxNum": values.maxNum, "maxSize": values.maxSize });
      }
      dispatch({
        type: "field/fieldEdit", formData, _id: values._id, cb: () => {
          dispatch({ type: "field/rfieldEditData", fieldEditData: { data: {}, visible: false } });
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
    dispatch({ type: "field/rfieldEditData", fieldEditData: { data: {}, visible: false } });
    form.resetFields();
  };

  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    if (_id) return;
    let jsonStr = data.jsonStr ? JSON.parse(data.jsonStr) : {};
    form.setFieldsValue({
      _id: data._id, fieldFactoryID: data.fieldFactoryID, no: data.no, field: data.field,
      name: data.name, style: data.style, unit: data.unit,
      definition: data.definition, description: data.description, example: data.example,
    });
    if (data.style == "0" || data.style == "1") {
      form.setFieldsValue({
        regex: jsonStr.regex, regexDescription: jsonStr.regexDescription,
      });
    } else if (data.style == "2") {
      form.setFieldsValue({
        maxValue: jsonStr.maxValue, minValue: jsonStr.minValue, precision: jsonStr.precision,
      });
    } else if (data.style == "3" || data.style == "4" || data.style == "5" || data.style == "6") {
      form.setFieldsValue({
        options: data.options
      });
    } else if (data.style == "7") {
      form.setFieldsValue({
        dateType: jsonStr.dateType
      });
    } else if (data.style == "8") {
      form.setFieldsValue({
        suffix: jsonStr.suffix, maxNum: jsonStr.maxNum, maxSize: jsonStr.maxSize,
      });
    }
  });

  const Component = ({ style }) => {
    if (style == "0" || style == "1") {
      // 输入框(单行)、输入框(多行)
      return (
        <>
          <Form.Item name="regex" label="正则表达式">
            <Input />
          </Form.Item>
          <Form.Item name="regexDescription" label="正则表达式说明">
            <TextArea rows={2} />
          </Form.Item>
        </>
      );
    } else if (style == "2") {
      // 数字输入框
      return (
        <Row>
          <Col span={8}>
            <Form.Item name="minValue" label="最小值">
              <InputNumber precision={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxValue" label="最大值">
              <InputNumber precision={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="precision" label="保留几位小数">
              <InputNumber min={0} max={6} />
            </Form.Item>
          </Col>
        </Row>
      );
    } else if (style == "3" || style == "4" || style == "5" || style == "6") {
      // 单选框、选择器(单选)、选择器(多选)、级联选择
      return (
        <Form.Item name="options" label="下拉选项" rules={[{ required: true, message: "请输入下拉选项" }]}>
          <TextArea rows={4} />
        </Form.Item>
      );
    } else if (style == "7") {
      return (
        <Form.Item name="dateType" label="日期类型">
          <Radio.Group>
            <Radio value="year">年</Radio>
            <Radio value="month">月</Radio>
            <Radio value="day">日</Radio>
            {/* <Radio value="second">秒</Radio> */}
          </Radio.Group>
        </Form.Item>
      );
    } else if (style == "8") {
      return (
        <Row>
          <Col span={8}>
            <Form.Item name="suffix" label="文件类型后缀名">
              <Input placeholder='逗号分割的字符串' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxNum" label="最大上传数量">
              <InputNumber min={0} max={100} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxSize" label="最大文件大小(M)">
              <InputNumber min={0} max={1024} />
            </Form.Item>
          </Col>
        </Row>
      );
    }
  }

  return (
    <Modal title="新增" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 1100 }}>
      <Form form={form} name="新增字段详情" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Form.Item name="fieldFactoryID" label="fieldFactoryID" style={{ display: "none" }}><Input /></Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item name="no" label="序号">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="field" label="数据库字段" rules={[{ required: true, message: "请输入数据库字段" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="style" label="控件类型" rules={[{ required: true, message: "请选择控件类型" }]}>
              <Select options={FIELDSTYLE} onChange={e => setStyle(e)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="unit" label="单位">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Component style={style} />
        <Form.Item name="definition" label="定义">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="example" label="示例">
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyFieldEdit;