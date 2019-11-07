import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Row, Col, Input, Button, Modal } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Tag extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '标签名称',
        dataIndex: 'tag_name',
        key: 'tag_name',
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
        query: { ...this.props.location.query, page: 1, keyword: value }
      })
    );
  }
  handleModalOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = this.props.form.getFieldsValue();
      if (this.props.tags.modalType === 0) {
        this.props.dispatch({
          type: 'tags/create',
          payload: data,
        });
      } else {
        this.props.dispatch({
          type: 'tags/update',
          payload: {id: this.props.tags.currentItem._id , values: data},
        });
      }
      this.props.dispatch({
        type: 'tags/setModalHide'
      });
    })
  }
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'tags/setModalHide'
    });
  }
  handleAddNew = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'tags/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'tags/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'tags/setModalShow'
    });
  }
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'tags/distory',
      payload: id,
    });
  }
  handleEditItem = (record) => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'tags/saveCurrentItem',
      payload: record,
    });
    this.props.dispatch({
      type: 'tags/switchModalType',
      payload: 1,
    });
    this.props.dispatch({
      type: 'tags/setModalShow'
    });
  }
  getFormDefaultValue = (stateValue, defaultValue) => {
    return (typeof stateValue === "undefined" ? defaultValue : stateValue);
  }
  validateTagName = (rule, value, callback) => {
    if (value && value.length > 0) {
      this.props.dispatch({
        type: "tags/checkExist",
        payload: {
          tag_name: value
        }
      }).then(data => {
        if ( data ) {
          callback(new Error('抱歉，标签已存在，请换一个标签'));
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
                    placeholder="按标签名"
                  />
                </FormItem>
              </Col>
              <Col span={10} style={{textAlign: "right"}}>
                <Button type="primary" onClick={this.handleAddNew}>添加新标签</Button>
              </Col>
            </Row>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.tags.list}
            pagination={{
              total: this.props.tags.total,
              pageSize: this.props.location.query.limit * 1,
              current: this.props.location.query.page * 1,
            }}
            onChange={this.handleTableChange}
            loading={this.props.tags.loading}
          />
        </Card>
        <Modal
          title={this.props.tags.modalType ? '修改标签' : '添加新标签'}
          visible={this.props.tags.showModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              {getFieldDecorator('tag_name',{
                initialValue: this.getFormDefaultValue(this.props.tags.currentItem.tag_name, ""),
                rules: [
                  {required:true, message: '请输入标签名称'},
                  {max: 20, message: '最多只能输入20个字符'},
                  {validator: this.validateTagName},
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Tag;
