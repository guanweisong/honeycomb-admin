import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Divider } from 'antd';

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
            <Divider dashed={true} orientation={"left"}>基础信息</Divider>
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
              label="签名"
              maxLength={100}
            >
              {getFieldDecorator('site_signature', {
                rules: [{ required: true, message: '请填写签名' }],
                initialValue: this.props.app.setting.site_signature || '',
              })(
                <TextArea
                  rows={3}
                  maxLength={100}
                  placeholder="请填写签名"
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
            <Divider dashed={true} orientation={"left"}>备案信息</Divider>
            <FormItem
              {...formItemLayout}
              label="备案号"
              maxLength={100}
            >
              {getFieldDecorator('site_record_no', {
                initialValue: this.props.app.setting.site_record_no || '',
              })(
                <Input
                  placeholder="用填写备案号"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="工信部网址"
              maxLength={100}
            >
              {getFieldDecorator('site_record_url', {
                initialValue: this.props.app.setting.site_record_url || '',
              })(
                <Input
                  placeholder="用填写工信部网址，有备案号时显示链接"
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
