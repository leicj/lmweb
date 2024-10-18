import { Form, Input, message, Modal, Row, Radio, Select, Col } from 'antd';
import React from 'react';
import { layout, FORMAT } from '@/constants/index';

const MyModuleEdit = ({ dispatch, visible, data }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      dispatch({
        type: "module/moduleedit", formData: values, _id: values._id, cb: () => {
          dispatch({ type: "module/rmoduleEditData", moduleEditData: { data: {}, visible: false } });
          dispatch({ type: "module/moduleList" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    });
  }
  const onCancel = (form) => {
    dispatch({ type: "module/rmoduleEditData", moduleEditData: { data: {}, visible: false } });
    form.resetFields();
  };
  React.useEffect(() => {
    const _id = form.getFieldValue('_id');
    !_id && form.setFieldsValue({
      _id: data._id,
      no: data.no, field: data.field, name: data.name,
      group: data.group, format: data.format,
      isUse: data.isUse, isRead: data.isRead, isRequired: data.isRequired,
      isUpload: data.isUpload, isDownload: data.isDownload,
      isSearch: data.isSearch, isInputToSelect: data.isInputToSelect,
    });
  });
  return (
    <Modal title={<>编辑<div style={{ color: "gray", fontSize: 12 }}>只有：输入框，单选框，选择器(单选)，支持参与筛选</div></>} open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 900 }}>
      <Form form={form} name="编辑模块详情" {...layout} ref={formRef}>
        <Form.Item name="_id" label="_id" style={{ display: "none" }}><Input /></Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item name="no" label="序号">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="field" label="数据库字段">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="name" label="名称">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="group" label="字段分类">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="format" label="格式化展示">
              <Select options={FORMAT} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="isUse" label="是否使用">
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isRead" label="是否只读">
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isRequired" label="是否必填">
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="isUpload" label="导入模板">
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isDownload" label="导出模板">
              <Radio.Group>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="isSearch" label="参与筛选">
              <Radio.Group disabled={!["0", "1", "3", "4"].includes(data.style)}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="isInputToSelect" label="筛选中输入框转下拉框">
              <Radio.Group disabled={!["0", "1", "3", "4"].includes(data.style)}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default MyModuleEdit;