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
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: {...values, password: md5(values.password)} })
    })
  }
  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            {/* <img alt="logo" src={} /> */}
            <span>网站名称</span>
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
            </Row>
          </form>
        </div>
      </Fragment>
    )
  }
}

export default Login;
