import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Row, Col, Input, Radio, Button, Modal } from 'antd';
import moment from 'moment';
import md5 from 'md5';
import { routerRedux } from 'dva/router';
import { enableStatusMap, userLevelMap } from '@/utils/mapping';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class User extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '级别',
        dataIndex: 'user_level',
        key: 'user_level',
        filters: userLevelMap,
        filteredValue: props.location.query.userLevelMap,
        render: (text, record) => {
          return userLevelMap.find(item => item.value === text).text
        }
      },
      {
        title: '状态',
        dataIndex: 'user_status',
        key: 'user_status',
        filters: enableStatusMap,
        filteredValue: props.location.query.link_status,
        render: (text, record) => (
          enableStatusMap.find(item => item.value === text).tag
        ),
      },
      {
        title: '用户邮箱',
        dataIndex: 'user_email',
        key: 'user_email',
      },
      {
        title: '添加时间',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        defaultSortOrder: 'descend',
        render: (text) => (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ),
      },
      {
        title: '最后更新日期',
        dataIndex: 'updated_at',
        key: 'updated_at',
        sorter: true,
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
            <If condition={record.user_level !== 1 && record.user_status !== -1}>
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDeleteItem(record._id)}>
                <a>删除</a>
              </Popconfirm>
            </If>
          </p>
        ),
      }
    ];
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, page: pagination.current, limit: pagination.pageSize, ...filters, sortField: sorter.field, sortOrder: sorter.order}
      })
    );
  }
  handelSearchChange = (value) => {
    this.props.dispatch(
      routerRedux.push({
        query: { ...this.props.location.query, keyword: value }
      })
    );
  }
  handleModalOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      let data = this.props.form.getFieldsValue();
      data.user_password && (data = {...data, user_password: md5(data.user_password)});
      if (this.props.users.modalType === 0) {
        this.props.dispatch({
          type: 'users/create',
          payload: data,
        });
      } else {
        this.props.dispatch({
          type: 'users/update',
          payload: {id: this.props.users.currentItem._id , values: data},
        });
      }
      this.props.dispatch({
        type: 'users/setModalHide'
      });
    })
  }
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'users/setModalHide'
    });
  }
  handleAddNew = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'users/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'users/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'users/setModalShow'
    });
  }
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'users/distory',
      payload: id,
    });
  }
  handleEditItem = (record) => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'users/saveCurrentItem',
      payload: record,
    });
    this.props.dispatch({
      type: 'users/switchModalType',
      payload: 1,
    });
    this.props.dispatch({
      type: 'users/setModalShow'
    });
  }
  getFormDefaultValue = (stateValue, defaultValue) => {
    return (typeof stateValue === "undefined" ? defaultValue : stateValue);
  }
  validateUserName = (rule, value, callback) => {
    if (value && value.length > 0) {
      this.props.dispatch({
        type: "users/checkExist",
        payload: {
          user_name: value
        }
      }).then(data => {
        if ( data ) {
          callback(new Error('抱歉，用户名已存在，请换一个用户名'));
        } else {
          callback();
        }
      })
    } else {
      callback();
    }
  }
  validateUserEmail = (rule, value, callback) => {
    if (value && value.length > 0) {
      this.props.dispatch({
        type: "users/checkExist",
        payload: {
          user_email: value
        }
      }).then(data => {
        if ( data ) {
          callback(new Error('抱歉，用户邮箱已存在，请换一个用户邮箱'));
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
          <Form layout="inline" style={{marginBottom: "20px"}}>
            <Row>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="搜索"
                >
                  <Search
                    defaultValue={this.props.location.query.keyword || ''}
                    onSearch={this.handelSearchChange}
                    placeholder="按用户名或者邮箱"
                  />
                </FormItem>
              </Col>
              <Col span={4} style={{textAlign: "right"}}>
                <Button type="primary" onClick={this.handleAddNew}>添加新用户</Button>
              </Col>
            </Row>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.users.list}
            rowClassName={(record, index)=> {
              if (record.user_status === -1) {
                return 'gray'
              }
            }}
            pagination={{
              showSizeChanger: true,
              total: this.props.users.total,
              pageSize: this.props.location.query.limit * 1,
              current: this.props.location.query.page * 1,
            }}
            onChange={this.handleTableChange}
            loading={this.props.users.loading}
          />
        </Card>
        <Modal
          title={this.props.users.modalType ? '修改用户' : '添加新用户'}
          visible={this.props.users.showModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('user_name',{
                initialValue: this.getFormDefaultValue(this.props.users.currentItem.user_name, ""),
                rules: [
                  {required:true, message: '请输入用户名'},
                  {max: 20, message: '最多只能输入20个字符'},
                  {validator: this.validateUserName},
                ]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('user_password',{
                rules: [
                  {required: !this.props.users.modalType, message: '请输入密码'},
                  {max: 20, message: '最多只能输入20个字符'},
                  {min: 6, message: '至少请输入6个字符'},
                ]
              })(
                <Input autoComplete="off" type="password" placeholder={this.props.users.modalType === 1 ? '留空则为不修改' : ''}/>
              )}
            </FormItem>
            <FormItem
              label="邮箱"
              {...formItemLayout}
            >
              {getFieldDecorator('user_email', {
                initialValue: this.getFormDefaultValue(this.props.users.currentItem.user_email, ""),
                rules: [
                  {required:true, message: '请输入用户邮箱'},
                  {max: 20, message: '最多只能输入20个字符'},
                  {type: 'email', message: '请输入正确的邮箱'},
                  {validator: this.validateUserEmail},
                ]
              })(
                <Input type="textarea" rows={3} autoComplete="off"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="级别"
            >
              {getFieldDecorator('user_level', {
                initialValue: this.getFormDefaultValue(this.props.users.currentItem.user_level, 2),
              })(
                <Radio.Group
                  buttonStyle="solid"
                  disabled={this.props.users.currentItem.user_level === 1}
                >
                  <For each="item" index="index" of={userLevelMap}>
                    <Radio.Button value={item.value} key={index}>{item.text}</Radio.Button>
                  </For>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('user_status', {
                initialValue: this.getFormDefaultValue(this.props.users.currentItem.user_status, 1)
              })(
                <Radio.Group
                  buttonStyle="solid"
                  disabled={this.props.users.currentItem.user_level === 1}
                >
                  <For each="item" index="index" of={enableStatusMap}>
                    <Radio.Button value={item.value} key={index}>{item.text}</Radio.Button>
                  </For>
                </Radio.Group>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User;
