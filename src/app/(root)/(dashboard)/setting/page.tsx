'use client';

import MultiLangFormItem from '@/components/MultiLangFormItem';
import { formItemLayout } from '@/constants/formItemLayout';
import { useSettingStore } from '@/stores/useSettingStore';
import { FooterToolbar, PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Input, Space, message } from 'antd';
import { useEffect } from 'react';
import SettingService from './service';

const Setting = () => {
  const [form] = Form.useForm();
  const settingStore = useSettingStore();

  const { setting, querySetting } = settingStore;

  useEffect(() => {
    form.setFieldsValue(setting);
  }, [setting]);

  /**
   * 保存事件
   */
  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const result = await SettingService.update(setting!.id, values);
      if (result.status === 201) {
        await querySetting();
        message.success('更新成功');
      }
    });
  };

  return (
    <PageContainer>
      <Form form={form}>
        <Space direction={'vertical'} style={{ width: '100%', display: 'flex' }}>
          <Card title="基础信息">
            <MultiLangFormItem>
              <Form.Item
                {...formItemLayout}
                name={'siteName'}
                label="站点名称"
                rules={[{ required: true, message: '请填写站点名称' }]}
              >
                <Input placeholder="请填写站点名称" maxLength={50} />
              </Form.Item>
            </MultiLangFormItem>
            <MultiLangFormItem>
              <Form.Item
                {...formItemLayout}
                name={'siteSubName'}
                label="副标题"
                rules={[{ required: true, message: '请填写站点副标题' }]}
              >
                <Input placeholder="请填写站点副标题" maxLength={100} />
              </Form.Item>
            </MultiLangFormItem>
            <MultiLangFormItem>
              <Form.Item
                {...formItemLayout}
                name={'siteSignature'}
                label="签名"
                rules={[{ required: true, message: '请填写签名' }]}
              >
                <Input.TextArea rows={3} placeholder="请填写签名" maxLength={200} />
              </Form.Item>
            </MultiLangFormItem>
            <MultiLangFormItem>
              <Form.Item
                {...formItemLayout}
                name={'siteCopyright'}
                label="版权信息"
                rules={[{ required: true, message: '请填写版权信息' }]}
              >
                <Input.TextArea rows={3} placeholder="请填写版权信息" maxLength={200} />
              </Form.Item>
            </MultiLangFormItem>
          </Card>
          <Card title="备案信息">
            <Form.Item {...formItemLayout} name="siteRecordNo" label="备案号">
              <Input placeholder="用填写备案号" maxLength={100} />
            </Form.Item>
            <Form.Item {...formItemLayout} name="siteRecordUrl" label="工信部网址">
              <Input placeholder="用填写工信部网址，有备案号时显示链接" maxLength={100} />
            </Form.Item>
          </Card>
        </Space>
      </Form>
      <FooterToolbar>
        <Button type="primary" onClick={handleSubmit}>
          保存
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default Setting;
