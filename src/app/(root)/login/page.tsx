'use client';
import { useSettingStore } from '@/stores/useSettingStore';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import md5 from 'md5';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import LoginService from './service';

const Login = () => {
  const captchaRef = useRef<any>();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const settingStore = useSettingStore();

  const { setting } = settingStore;
  const targetUrl = searchParams.get('targetUrl');

  useEffect(() => {
    // @ts-ignore
    captchaRef.current = new TencentCaptcha('2090829333', async (res: any) => {
      if (res.ret === 0) {
        const values = form.getFieldsValue();
        const result = await LoginService.login({
          ...values,
          password: md5(values.password),
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
        });
        if (result.status === 200) {
          message.success('登录成功');
          localStorage.setItem('token', result.data.token);
          window.location.href = targetUrl || '/';
        }
      }
    });
    return () => {
      captchaRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen box-border pt-48 text-center bg-green-700">
      <video
        src="https://honeycomb-1257715480.cos.ap-shanghai.myqcloud.com/common/rainAndBird.mp4"
        className="fixed inset-0"
        autoPlay={true}
        muted={true}
        loop={true}
        height="100%"
      />
      <div className="bg-white/10 backdrop-blur inline-block rounded overflow-hidden relative z-10 text-left">
        <LoginForm
          form={form}
          title={<div className="font-normal text-2xl text-white">{setting?.siteName}</div>}
          message={<div className="text-center text-gray-400 my-4">游客账号：guest 123456</div>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async () => {
            captchaRef.current.show();
          }}
        >
          <ProFormText
            name="name"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={'用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
