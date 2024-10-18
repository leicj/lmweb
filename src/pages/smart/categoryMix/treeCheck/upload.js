import { Button, Form, Upload, message, Modal, Input } from 'antd';
import React from 'react';
import GLOBAL from '@/models/index';
import { layout } from '@/constants/index';

const MyUpload = ({ dispatch, visible }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const onOk = (form) => {
    form.validateFields().then(values => {
      const file = values.upload.file;
      if (file.size >= 10 * 1024 * 1024) {
        message.error("文件大小不可超过10M！");
        form.resetFields();
        return;
      }
      const formData = new FormData();
      formData.append('file', values.upload.file.originFileObj);
      dispatch({
        type: "treeCheck/checkUpload", name: values.name, sheetName: values.sheetName, formData, cb: () => {
          dispatch({ type: "treeCheck/ruploadVisible", visible: false });
          dispatch({ type: "treeCheck/rselectName", selectName: "" });
          dispatch({ type: "treeCheck/checkNames" });
        }
      });
      form.resetFields();
    }).catch(info => {
      message.error("表单格式有误！");
      return;
    })
  };
  const onCancel = (form) => {
    dispatch({ type: "treeCheck/ruploadVisible", visible: false });
    form.resetFields();
  };

  return (
    <Modal title="批量导入" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)}>
      <Form form={form} name="批量导入" {...layout} ref={formRef} style={{ maxWidth: 600 }}>
        <Form.Item name="name" label="模型数据名称" rules={[{ required: true, message: "请输入模型名称" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sheetName" label="工作表名" rules={[{ required: true, message: "请输入工作表名" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="upload" label="上传" valuePropName='file'>
          <Upload name="file" maxCount={1}>
            <Button>点击上传文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="模板">
          <a href={`${GLOBAL.treeCheckTemplate}`} download>决策树验证导入模板.xlsx</a>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyUpload;
