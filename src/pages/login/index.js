import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Icon, Input } from 'antd';
import md5 from 'md5';

import styles from './index.less';
const FormItem = Form.Item;

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
@Form.create()
class Login extends PureComponent {
  componentDidMount() {
    this.captcha = new TencentCaptcha('2090829333', (res) => {
      if (res.ret === 0) {
        const values = this.props.form.getFieldsValue();
        this.props.dispatch({
          type: 'login/login',
          payload: {
            ...values,
            password: md5(values.password),
            captcha: {
              ticket: res.ticket,
              randstr: res.randstr
            },
          }
        })
      }
    });
  };
  handleOk = () => {
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      this.captcha.show();
    })
  };
  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <span>管理系统</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  onPressEnter={this.handleOk}
                  placeholder={`Username`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  type="password"
                  onPressEnter={this.handleOk}
                  placeholder={`Password`}
                />
              )}
            </FormItem>
            <Row>
              <Button
                type="primary"
                onClick={this.handleOk}
                loading={loading.effects.login}
              >
                Sign in
              </Button>
              <div className={styles.tips}>访客身份：guest 123456</div>
            </Row>
          </form>
        </div>
      </Fragment>
    )
  }
}

export default Login;
