import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Modal, Select } from 'antd';
import { enableStatusMap } from '@/utils/mapping';
import { creatCategoryTitleByDepth } from '@/utils/help';

const FormItem = Form.Item;
const Option = Select.Option;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Category extends PureComponent {
  constructor(props) {
    super(props)
  }
  handleModalOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = this.props.form.getFieldsValue();
      if (this.props.categories.modalType === 0) {
        this.props.dispatch({
          type: 'categories/create',
          payload: data,
        });
      } else {
        this.props.dispatch({
          type: 'categories/update',
          payload: {id: this.props.categories.currentItem._id , values: data},
        });
      }
      this.props.dispatch({
        type: 'categories/setModalHide'
      });
    })
  };
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'categories/setModalHide'
    });
  };
  getFormDefaultValue = (stateValue, defaultValue) => {
    return (typeof stateValue === "undefined" ? defaultValue : stateValue);
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.props.categories.modalType ? '修改分类' : '添加新分类'}
        visible={this.props.categories.showModal}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="分类名称"
          >
            {getFieldDecorator('category_title',{
              initialValue: this.getFormDefaultValue(this.props.categories.currentItem.category_title, ""),
              rules: [
                {required:true, message: '请输入分类名称'},
                {max: 20, message: '最多只能输入20个字符'}
              ]
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="分类英文名"
          >
            {getFieldDecorator('category_title_en',{
              initialValue: this.getFormDefaultValue(this.props.categories.currentItem.category_title_en, ""),
              rules: [
                {required:true, message: '请输入分类英文名'},
                {max: 20, message: '最多只能输入20个字符'}
              ]
            })(
              <Input placeholder="输入小写字母，单词间以中划线分隔，用于URL显示"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="父级分类"
          >
            {getFieldDecorator('category_parent',{
              initialValue: this.getFormDefaultValue(this.props.categories.currentItem.category_parent, "0"),
              rules: [
                {required:true, message: '请选择父级分类'},
              ]
            })(
              <Select>
                <Option value="0">无父级分类</Option>
                <For each="option" of={ this.props.categories.list }>
                  <Option value={option._id} key={option._id} disabled = {option._id === this.props.categories.currentItem._id}>
                    {creatCategoryTitleByDepth(option.category_title, option)}
                  </Option>
                </For>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="分类描述："
            {...formItemLayout}
          >
            {getFieldDecorator('category_description', {
              initialValue: this.getFormDefaultValue(this.props.categories.currentItem.category_description, ""),
              rules: [
                {required:true, message: '请输入分类描述'},
                {max: 200, message: '最多只能输入200个字符'}
              ]
            })(
              <Input type="textarea" rows={3} autoComplete="off"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('category_status', {
              initialValue: this.getFormDefaultValue(this.props.categories.currentItem.category_status, 1) + ""
            })(
              <Radio.Group
                buttonStyle="solid"
              >
                <Radio.Button value="1">启用</Radio.Button>
                <Radio.Button value="0">禁用</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Category;
