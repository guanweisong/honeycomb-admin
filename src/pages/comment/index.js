import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Row, Col, Input, Radio } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { commentStatusMap } from '@/utils/mapping';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Comment extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [

      {
        title: '评论内容',
        dataIndex: 'comment_content',
        key: 'comment_content',
        width: 300,
      },
      {
        title: '评论文章',
        dataIndex: 'comment_post',
        key: 'comment_post',
        render: (text, record) => {
          return text.post_title
        }
      },
      {
        title: '评论人',
        dataIndex: 'comment_author',
        key: 'comment_author',
      },
      {
        title: '评论人邮箱',
        dataIndex: 'comment_email',
        key: 'comment_email',
      },
      {
        title: '评论IP',
        dataIndex: 'comment_ip',
        key: 'comment_ip',
      },
      {
        title: '评论状态',
        dataIndex: 'comment_status',
        key: 'comment_status',
        filters: commentStatusMap,
        filteredValue: props.location.query.comment_status,
        render: (text) => {
          return commentStatusMap.find(item => item.value === text).text;
        }
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
          <div>
            {this.renderOpt(record)}&nbsp;
            <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDelete(record._id)}>
              <a>删除</a>
            </Popconfirm>
          </div>
        )
      }
    ];
  }
  renderOpt = record => {
    let dom;
    switch(record.comment_status) {
      case 0:
        dom = (
          <p>
            <Popconfirm title="确定要通过吗？" onConfirm={() => this.handleSetStatus(record._id, 1)}>
              <a>通过</a>
            </Popconfirm>&nbsp;
            <Popconfirm title="确定要驳回吗？" onConfirm={() => this.handleSetStatus(record._id, 2)}>
              <a>驳回</a>
            </Popconfirm>
          </p>
        );
        break;
      case 1:
        dom = (
          <Popconfirm title="确定要屏蔽吗？" onConfirm={() => this.handleSetStatus(record._id, 3)}>
            <a>屏蔽</a>
          </Popconfirm>
        );
        break;
      case 2:
        dom = (
          <Popconfirm title="确定要通过吗？" onConfirm={() => this.handleSetStatus(record._id, 1)}>
            <a>通过</a>
          </Popconfirm>
        );
        break;
      case 3:
        dom = (
          <Popconfirm title="确定要解除屏蔽吗？" onConfirm={() => this.handleSetStatus(record._id, 1)}>
            <a>解除屏蔽</a>
          </Popconfirm>
        );
        break;
      default:;
    }
    return dom;
  };
  handleSetStatus = (id, type) => {
    this.props.dispatch({
      type: 'comments/update',
      payload: {id: id , values: { 'comment_status': type }},
    });
  };
  handleDelete = (id) => {
    this.props.dispatch({
      type: 'comments/distory',
      payload: id,
    });
  };
  handelSearchChange = (value) => {
    this.props.dispatch(
      routerRedux.push({
        query: { ...this.props.location.query, keyword: value }
      })
    );
  };
  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.props.dispatch(
      routerRedux.push({
        query: {...this.props.location.query, page: pagination.current, limit: pagination.pageSize, ...filters}
      })
    );
  };
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
    return (
      <div>
        <Card>
          <Form layout="inline" style={{marginBottom: "20px"}}>
            <FormItem
              {...formItemLayout}
              label="搜索"
            >
              <Search
                defaultValue={this.props.location.query.keyword || ''}
                onSearch={this.handelSearchChange}
                placeholder="按内容、评论者、IP"
              />
            </FormItem>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.comments.list}
            pagination={{
              total: this.props.comments.total,
              pageSize: this.props.location.query.limit * 1,
              current: this.props.location.query.page * 1,
            }}
            onChange={this.handleTableChange}
            loading={this.props.comments.loading}
          />
        </Card>
      </div>
    )
  }
}

export default Comment;
