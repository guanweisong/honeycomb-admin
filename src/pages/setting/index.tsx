import React from 'react';
import { Card, Input, Button, Space, Form } from 'antd';
import useSettingsModel from './model';
import { formItemLayout } from '@/constants/formItemLayout';

const Setting = () => {
  const [form] = Form.useForm();
  const settingsModel = useSettingsModel();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      settingsModel.update(settingsModel.setting?._id as string, values);
    });
  };

  return (
    <>
      <Form initialValues={settingsModel.setting} onFinish={handleSubmit} form={form}>
        <Space direction={'vertical'} style={{ width: '100%', display: 'flex' }}>
          <Card title="基础信息">
            <Form.Item
              {...formItemLayout}
              name="site_name"
              label="站点名称"
              rules={[{ required: true, message: '请填写站点名称' }]}
            >
              <Input placeholder="请输入" maxLength={50} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="site_subName"
              label="副标题"
              rules={[{ required: true, message: '请填写站点副标题' }]}
            >
              <Input placeholder="用简洁的文字描述本站点" maxLength={100} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="site_signature"
              label="签名"
              rules={[{ required: true, message: '请填写签名' }]}
            >
              <Input.TextArea rows={3} placeholder="请填写签名" maxLength={100} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="site_copyright"
              label="版权信息"
              rules={[{ required: true, message: '请填写版权信息' }]}
            >
              <Input.TextArea rows={3} placeholder="请填写版权信息" maxLength={100} />
            </Form.Item>
          </Card>
          <Card title="备案信息">
            <Form.Item {...formItemLayout} name="site_record_no" label="备案号">
              <Input placeholder="用填写备案号" maxLength={100} />
            </Form.Item>
            <Form.Item {...formItemLayout} name="site_record_url" label="工信部网址">
              <Input placeholder="用填写工信部网址，有备案号时显示链接" maxLength={100} />
            </Form.Item>
          </Card>
          <Card>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Card>
        </Space>
      </Form>
    </>
  );
};

export default Setting;
