import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Setting extends PureComponent {
  constructor(props) {
    super(props)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'settings/update',
          payload: values,
        });
      }
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card>
          <Form style={{maxWidth: '600px'}} onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="站点名称"
            >
              {getFieldDecorator('site_name', {
                rules: [{ required: true, message: '请填写站点名称' }],
                initialValue: this.props.app.setting.site_name || '',
              })(
                <Input
                  placeholder="请输入"
                  maxLength={50}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="副标题"
              maxLength={100}
            >
              {getFieldDecorator('site_subName', {
                rules: [{ required: true, message: '请填写站点副标题' }],
                initialValue: this.props.app.setting.site_subName || '',
              })(
                <Input
                  placeholder="用简洁的文字描述本站点"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="版权信息"
              maxLength={100}
            >
              {getFieldDecorator('site_copyright', {
                rules: [{ required: true, message: '请填写版权信息' }],
                initialValue: this.props.app.setting.site_copyright || '',
              })(
                <TextArea
                  rows={3}
                  maxLength={100}
                  placeholder="请填写版权信息"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="统计代码"
            >
              {getFieldDecorator('site_statistics', {
                initialValue: this.props.app.setting.site_statistics || '',
              })(
                <TextArea
                  rows={5}
                  maxLength={500}
                  placeholder="插入GA等第三方统计代码"
                />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{ offset: 4 }}
            >
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Setting;
