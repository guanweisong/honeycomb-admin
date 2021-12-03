import React, { useEffect } from 'react'
import { Button, Row, Input, Form } from 'antd'
import md5 from 'md5'
import { useLocation } from 'umi'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import useLoginModel from './model'
import styles from './index.less'

const Login = () => {
  const location = useLocation()
  const loginModel = useLoginModel()
  const [form] = Form.useForm()

  let captcha = null

  useEffect(() => {
    captcha = new TencentCaptcha('2090829333', (res) => {
      if (res.ret === 0) {
        const values = form.getFieldsValue()
        const { targetUrl } = location.query
        loginModel.login({
          ...values,
          user_password: md5(values.user_password),
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
          targetUrl,
        })
      }
    })
  }, [])

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        captcha.show()
      })
      .catch((errorInfo) => {
        console.error('errorInfo', errorInfo)
      })
  }

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
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="user_password"
          type="password"
          rules={[
            {
              required: true,
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
  )
}

export default Login
