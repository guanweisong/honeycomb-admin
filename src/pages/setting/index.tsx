import { useEffect } from 'react';
import { Card, Input, Button, Space, Form, message } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { formItemLayout } from '@/constants/formItemLayout';
import { useModel } from '@@/plugin-model/useModel';
import * as SettingService from './service';

const Setting = () => {
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');
  const setting = initialState?.setting;

  useEffect(() => {
    form.setFieldsValue(setting);
  }, [setting]);

  /**
   * 保存事件
   */
  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      const result = await SettingService.update(setting!._id, values);
      if (result.status === 201) {
        const settingInfo = await SettingService.querySetting();
        setInitialState({ ...initialState, setting: settingInfo.data?.[0] });
        message.success('更新成功');
      }
    });
  };

  return (
    <PageContainer>
      <Form form={form}>
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
