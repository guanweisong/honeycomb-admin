import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Form } from 'antd';
import React, { useRef, useEffect } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { StringParam, useQueryParams } from 'use-query-params';
import md5 from 'md5';
import Footer from '@/components/Footer';
import * as LoginService from './service';

import styles from './index.less';

const Login: React.FC = () => {
  const captchaRef = useRef<any>();
  const [form] = Form.useForm();
  const [query] = useQueryParams({
    targetUrl: StringParam,
  });

  const { targetUrl } = query;

  useEffect(() => {
    // @ts-ignore
    captchaRef.current = new TencentCaptcha('2090829333', async (res: any) => {
      if (res.ret === 0) {
        const values = form.getFieldsValue();
        const result = await LoginService.login({
          ...values,
          user_password: md5(values.user_password),
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
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          form={form}
          title="稻草人博客"
          subTitle="稻草人的自留地"
          message={<div className={styles.tip}>游客账号：guest guest</div>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async () => {
            captchaRef.current.show();
          }}
        >
          <ProFormText
            name="user_name"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
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
            name="user_password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
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
      <Footer />
    </div>
  );
};

export default Login;
