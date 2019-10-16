import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Input, Radio, Row, Col, Button } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Link from 'umi/link';
import { postStatusMap, postTypeMap } from '@/utils/mapping';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Post extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '文章名称',
        dataIndex: 'post_title',
        key: 'post_title',
      },
      {
        title: '引用内容',
        dataIndex: 'quote_content',
        key: 'quote_content',
      },
      {
        title: '分类',
        dataIndex: 'post_category',
        key: 'post_category',
        render: (text, record) => (
          text ? text.category_title : '无'
        ),
      },
      {
        title: '类型',
        dataIndex: 'post_type',
        key: 'post_type',
        filters: postTypeMap,
        filteredValue: props.location.query.post_type,
        render: (text, record) => (
          postTypeMap.find(item => item.value === text).text
        ),
      },
      {
        title: '作者',
        dataIndex: 'post_author',
        key: 'post_author',
        render: (text, record) => (
          text ? text.user_name : '无'
        ),
      },
      {
        title: '状态',
        dataIndex: 'post_status',
        key: 'post_status',
        filters: postStatusMap,
        filteredValue: props.location.query.post_status,
        render: (text, record) => (
          postStatusMap.find(item => item.value === text).text
        ),
      },
      {
        title: '发表时间',
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
        title: '点击量',
        dataIndex: 'post_views',
        key: 'post_views',
        sorter: true,
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => (
          <p>
            <Link to={`/post/edit?_id=${record._id}`}>编辑</Link>&nbsp;
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
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'posts/distory',
      payload: id,
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
                    placeholder="按文章名、引用内容、引用作者"
                  />
                </FormItem>
              </Col>
              <Col span={10} style={{textAlign: "right"}}>
                <Button type="primary"><Link to="/post/edit">添加新文章</Link></Button>
              </Col>
            </Row>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.posts.list}
            pagination={{
              showSizeChanger: true,
              total: this.props.posts.total,
              postSize: this.props.location.query.limit * 1,
              current: this.props.location.query.page * 1,
            }}
            onChange={this.handleTableChange}
            loading={this.props.posts.loading}
          />
        </Card>
      </div>
    )
  }
}

export default Post;
