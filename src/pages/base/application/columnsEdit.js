import {
  Form, Input, InputNumber, message, Modal, Radio, Select, Tabs,
  Cascader, DatePicker, Row, Col, Upload, Button, Card, Tag, Checkbox
} from 'antd';
import React, { useState } from 'react';
import { layout } from '@/constants/index';

const { CheckableTag } = Tag;

const MyColumnsEdit = ({ dispatch, visible, data, groupData, selectApplicationFactory }) => {
  const formRef = React.useRef(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState(data);
  const onOk = (form) => {
    dispatch({ type: "application/rcolumnsEditData", columnsEditData: { data: tags, visible: false } });
    const key = `${selectApplicationFactory['applicationFactoryID']}|${selectApplicationFactory['moduleFactoryID']}|${selectApplicationFactory['fieldFactoryID']}`
    const value = tags.join(",");
    dispatch({ type:"application/cooketEdit", key, value, cb: ()=>{
      dispatch({ type: "application/cookieList"});
    }})
  }
  const onCancel = (form) => {
    dispatch({ type: "application/rcolumnsEditData", columnsEditData: { data: data, visible: false } });
    form.resetFields();
  };

  const item0 = groupData[0].map(d => <Card title={d['group']}><Checkbox.Group value={tags}>{
    d['data'].map(_d => <Checkbox key={_d['field']} value={_d['field']} onChange={e => {
      let _tags = [];
      if (e.target.checked) {
        _tags = tags.concat([_d['field']]);
      } else {
        _tags = tags.filter(t => t != _d['field']);
      }
      setTags(_tags);
    }}>{_d['name']}</Checkbox>)
  }</Checkbox.Group></Card>)
  const item1 = groupData[1].map(d => <Card title={d['group']}><Checkbox.Group value={tags}>{
    d['data'].map(_d => <Checkbox key={_d['field']} value={_d['field']} onChange={e => {
      let _tags = [];
      if (e.target.checked) {
        _tags = tags.concat([_d['field']]);
      } else {
        _tags = tags.filter(t => t != _d['field']);
      }
      setTags(_tags);
    }}>{_d['name']}</Checkbox>)
  }</Checkbox.Group></Card>);
  const item2 = groupData[2].map(d => <Card title={d['group']}><Checkbox.Group value={tags}>{
    d['children'].map(_d => _d['data'].map(_d1 => <Checkbox key={_d1['field']} value={_d1['field']} onChange={e => {
      let _tags = [];
      if (e.target.checked) {
        _tags = tags.concat([_d1['field']]);
      } else {
        _tags = tags.filter(t => t != _d1['field']);
      }
      setTags(_tags);
    }}>{_d1['name']}</Checkbox>))
  }</Checkbox.Group></Card>);
  return (
    <Modal title="列字段控制" open={visible} onOk={() => onOk(form)} onCancel={() => onCancel(form)} style={{ minWidth: 800 }}>
      <Form form={form} name="列字段控制" {...layout} ref={formRef}>
        {item1}
        {item2}
        {item0}
      </Form>
    </Modal>
  );
}

export default MyColumnsEdit;