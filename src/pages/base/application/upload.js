import { Button, Form, Upload, message, Modal } from 'antd';
import React from 'react';
import { layout } from '@/constants/index';

const MyUpload = ({ dispatch, visible, selectApplicationFactory }) => {
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
        type: "application/upload",
        formData,
        applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
        moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
        fieldFactoryID: selectApplicationFactory['fieldFactoryID'],
        cb: () => {
          dispatch({ type: "application/ruploadVisible", visible: false });
          dispatch({
            type: "application/applicationList",
            formData: [],
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
    })
  };
  const onCancel = (form) => {
    dispatch({ type: "application/ruploadVisible", visible: false });
    form.resetFields();
  };

  return (
    <Modal title="批量导入" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)}>
      <Form form={form} name="批量导入" {...layout} ref={formRef} style={{ maxWidth: 600 }}>
        <Form.Item name="upload" label="上传" valuePropName='file'>
          <Upload name="file" maxCount={1}>
            <Button>点击上传文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="模板">
          <Button style={{ color: "#267bfc" }} type="text" onClick={() => {
            dispatch({
              type: 'application/uploadTemplate',
              applicationFactoryID: selectApplicationFactory['applicationFactoryID'],
              moduleFactoryID: selectApplicationFactory['moduleFactoryID'],
              fieldFactoryID: selectApplicationFactory['fieldFactoryID']
            })
          }}>批量导入模板.xlsx</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyUpload;
