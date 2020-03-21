import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Form, Input, Radio, Row, Col, Button } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Link from 'umi/link';
import { postStatusMap } from '@/utils/mapping';

const FormItem = Form.Item;
const Search = Input.Search;
const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Page extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '文章名称',
        dataIndex: 'page_title',
        key: 'page_title',
      },
      {
        title: '作者',
        dataIndex: 'page_author',
        key: 'page_author',
        render: (text, record) => (
          text.user_name
        ),
      },
      {
        title: '状态',
        dataIndex: 'page_status',
        key: 'page_status',
        filters: postStatusMap,
        filteredValue: props.location.query.page_status,
        render: (text, record) => (
          postStatusMap.find(item => item.value === text).text
        ),
      },
      {
        title: '发表时间',
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
        title: '点击量',
        dataIndex: 'page_views',
        key: 'page_views',
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => (
          <p>
            <Link to={`/page/edit?_id=${record._id}`}>编辑</Link>&nbsp;
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
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'pages/distory',
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
                    placeholder="按文章名"
                  />
                </FormItem>
              </Col>
              <Col span={10} style={{textAlign: "right"}}>
                <Button type="primary"><Link to="/page/edit">添加新页面</Link></Button>
              </Col>
            </Row>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.pages.list}
            pagination={{
              showSizeChanger: true,
              total: this.props.pages.total,
              pageSize: this.props.location.query.limit * 1,
              current: this.props.location.query.page * 1,
            }}
            onChange={this.handleTableChange}
            loading={this.props.pages.loading}
          />
        </Card>
      </div>
    )
  }
}

export default Page;
