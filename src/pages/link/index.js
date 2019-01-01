import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Row, Col, Input, Radio, Button, Modal } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { enableStatusMap } from '@/utils/mapping';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Link extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '链接名称',
        dataIndex: 'link_name',
        key: 'link_name',
      },
      {
        title: 'URL',
        dataIndex: 'link_url',
        key: 'link_url',
      },
      {
        title: '状态',
        dataIndex: 'link_status',
        key: 'link_status',
        filters: enableStatusMap,
        filteredValue: props.location.query.link_status,
        render: (text, record) => (
          enableStatusMap.find(item => item.value === text).text
        ),
      },
      {
        title: '链接描述',
        dataIndex: 'link_description',
        key: 'link_description',
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
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, page: pagination.current, limit: pagination.pageSize, ...filters}
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
      const data = this.props.form.getFieldsValue();
      if (this.props.links.modalType === 0) {
        this.props.dispatch({
          type: 'links/create',
          payload: data,
        });
      } else {
        this.props.dispatch({
          type: 'links/update',
          payload: {id: this.props.links.currentItem._id , values: data},
        });
      }
      this.props.dispatch({
        type: 'links/setModalHide'
      });
    })
  }
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'links/setModalHide'
    });
  }
  handleAddNew = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'links/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'links/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'links/setModalShow'
    });
  }
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'links/distory',
      payload: id,
    });
  }
  handleEditItem = (record) => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'links/saveCurrentItem',
      payload: record,
    });
    this.props.dispatch({
      type: 'links/switchModalType',
      payload: 1,
    });
    this.props.dispatch({
      type: 'links/setModalShow'
    });
  }
  getFormDefaultValue = (stateValue, defaultValue) => {
    return (typeof stateValue === "undefined" ? defaultValue : stateValue);
  }
  validateLinkUrl = (rule, value, callback) => {
    if (value && value.length > 0) {
      this.props.dispatch({
        type: "links/checkExist",
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
              <Col span={14}>
                <FormItem
                  {...formItemLayout}
                  label="搜索"
                >
                  <Search
                    defaultValue={this.props.location.query.keyword || ''}
                    onSearch={this.handelSearchChange}
                    placeholder="按链接名称或者URL"
                  />
                </FormItem>
              </Col>
              <Col span={10} style={{textAlign: "right"}}>
                <Button type="primary" onClick={this.handleAddNew}>添加新链接</Button>
              </Col>
            </Row>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.links.list}
            pagination={{
              total: this.props.links.total,
              pageSize: this.props.location.query.limit * 1,
            }}
            onChange={this.handleTableChange}
          />
        </Card>
        <Modal
          title={this.props.links.modalType ? '修改链接' : '添加新链接'}
          visible={this.props.links.showModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="链接名称"
            >
              {getFieldDecorator('link_name',{
                initialValue: this.getFormDefaultValue(this.props.links.currentItem.link_name, ""),
                rules: [
                  {required:true, message: '请输入链接名称'},
                  {max: 20, message: '最多只能输入20个字符'}
                ]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="链接URL"
            >
              {getFieldDecorator('link_url',{
                initialValue: this.getFormDefaultValue(this.props.links.currentItem.link_url, ""),
                rules: [
                  {required:true, message: '请输入链接URL'},
                  {max: 20, message: '最多只能输入20个字符'},
                  {type: 'url', message: '请输入正确的链接地址'},
                  {validator: this.validateLinkUrl},
                ]
              })(
                <Input placeholder="请以http://或者https://开头" autoComplete="off"/>
              )}
            </FormItem>
            <FormItem
              label="链接描述："
              {...formItemLayout}
            >
              {getFieldDecorator('link_description', {
                initialValue: this.getFormDefaultValue(this.props.links.currentItem.link_description, ""),
                rules: [
                  {required:true, message: '请输入链接描述'},
                  {max: 20, message: '最多只能输入20个字符'}
                ]
              })(
                <Input type="textarea" rows={3} autoComplete="off"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('link_status', {
                initialValue: this.getFormDefaultValue(this.props.links.currentItem.link_status, 1) + ""
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

export default Link;
