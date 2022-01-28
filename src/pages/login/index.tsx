import React, { useEffect, useRef } from 'react';
import { Button, Row, Input, Form } from 'antd';
import md5 from 'md5';
import { StringParam, useQueryParams } from 'use-query-params';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLoginModel from './model';
import styles from './index.less';

const Login = () => {
  const loginModel = useLoginModel();
  const [form] = Form.useForm();
  const captchaRef = useRef<any>();

  const [query] = useQueryParams({
    targetUrl: StringParam,
  });

  const { targetUrl } = query;

  useEffect(() => {
    // @ts-ignore
    captchaRef.current = new TencentCaptcha('2090829333', (res: any) => {
      if (res.ret === 0) {
        const values = form.getFieldsValue();
        loginModel.login({
          ...values,
          user_password: md5(values.user_password),
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
          targetUrl,
        });
      }
    });
    return () => {
      captchaRef.current = null;
    };
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        captchaRef.current.show();
      })
      .catch((errorInfo) => {
        console.error('errorInfo', errorInfo);
      });
  };

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <span>管理系统</span>
      </div>
      <Form onFinish={handleOk} form={form}>
        <Form.Item
          name="user_name"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="user_password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Row>
          <Button type="primary" htmlType="submit" loading={loginModel.loading}>
            Sign in
          </Button>
          <div className={styles.tips}>访客身份：guest 123456</div>
        </Row>
      </Form>
    </div>
  );
};

export default Login;
