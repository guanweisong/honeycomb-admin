import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Input, Row, Col, Button, Form } from 'antd'
import moment from 'moment'
import { Link, useLocation, history } from 'umi'
import { postStatusMap } from '@/utils/mapping'
import usePageModel from '../model'

const Page = () => {
  const location = useLocation()
  const pageModel = usePageModel()

  const columns = [
    {
      title: '文章名称',
      dataIndex: 'page_title',
      key: 'page_title',
    },
    {
      title: '作者',
      dataIndex: 'page_author',
      key: 'page_author',
      render: (text, record) => text.user_name,
    },
    {
      title: '状态',
      dataIndex: 'page_status',
      key: 'page_status',
      filters: postStatusMap,
      filteredValue: location.query.page_status,
      render: (text, record) => postStatusMap.find((item) => item.value === text).text,
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDeleteItem(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ]

  useEffect(() => {
    pageModel.index(location.query)
  }, [location])

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    history.push({
      query: {
        ...location.query,
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      },
    })
  }

  const handelSearchChange = (value) => {
    history.push({
      query: { ...location.query, page: 1, keyword: value },
    })
  }

  const handleDeleteItem = (id) => {
    pageModel.distory(id)
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }

  return (
    <div>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={location.query.keyword || ''}
                  onSearch={handelSearchChange}
                  placeholder="按文章名"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary">
                <Link to="/page/edit">添加新页面</Link>
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={pageModel.list}
          pagination={{
            showSizeChanger: true,
            total: pageModel.total,
            pageSize: parseInt(location.query.limit || 10, 10),
            current: parseInt(location.query.page || 1, 10),
          }}
          onChange={handleTableChange}
          loading={pageModel.loading}
        />
      </Card>
    </div>
  )
}

export default Page
