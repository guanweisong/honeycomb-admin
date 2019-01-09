import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Input, Radio, Button, Modal, Select } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
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
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'category_title',
        key: 'category_title',
        render: (text, record) => (
          creatCategoryTitleByDepth(text, record)
        ),
      },
      {
        title: '分类英文名',
        dataIndex: 'category_title_en',
        key: 'category_title_en',
      },
      {
        title: '分类描述',
        dataIndex: 'category_description',
        key: 'category_description',
      },
      {
        title: '状态',
        dataIndex: 'category_status',
        key: 'category_status',
        render: (text, record) => (
          enableStatusMap.find(item => item.value === text).text
        ),
      },
      {
        title: '添加时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ),
      },
      {
        title: '最后更新日期',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ),
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => (
          <p>
            <a onClick={() => this.handleEditItem(record)}>编辑</a>&nbsp;
            <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDeleteItem(record._id)}>
              <a>删除</a>
            </Popconfirm>
          </p>
        ),
      }
    ];
  }
  handleStatusChange = (e) => {
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, categories_status: e.target.value}
      })
    );
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
  }
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'categories/setModalHide'
    });
  }
  handleAddNew = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'categories/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'categories/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'categories/setModalShow'
    });
  }
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'categories/distory',
      payload: id,
    });
  }
  handleEditItem = (record) => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'categories/saveCurrentItem',
      payload: record,
    });
    this.props.dispatch({
      type: 'categories/switchModalType',
      payload: 1,
    });
    this.props.dispatch({
      type: 'categories/setModalShow'
    });
  }
  getFormDefaultValue = (stateValue, defaultValue) => {
    return (typeof stateValue === "undefined" ? defaultValue : stateValue);
  }
  validateLinkUrl = (rule, value, callback) => {
    if (value && value.length > 0) {
      this.props.dispatch({
        type: "categories/checkExist",
        payload: {
          link_url: value
        }
      }).then(data => {
        if ( data ) {
          callback(new Error('抱歉，URL已存在，请换一个URL'));
        } else {
          callback();
        }
      })
    } else {
      callback();
    }
  }
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
      <div>
        <Card>
          <Form layout="inline" style={{marginBottom: "20px", textAlign: "right"}}>
            <Button type="primary" onClick={this.handleAddNew}>添加新分类</Button>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.categories.list}
            onChange={this.handleTableChange}
          />
        </Card>
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
                <Input placeHolder="输入小写字母，单词间以中划线分隔，用于URL显示"/>
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
      </div>
    )
  }
}

export default Category;
