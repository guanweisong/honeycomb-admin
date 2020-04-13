import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Input, Form, Col, Row } from 'antd'
import moment from 'moment'
import { commentStatusMap } from '@/utils/mapping'
import { useLocation, history } from 'umi'
import useCommentModel from './model'

const Comment = () => {
  const location = useLocation()
  const commentModel = useCommentModel()

  useEffect(() => {
    commentModel.index(location.query)
  }, [location])

  const handleSetStatus = (id, type) => {
    commentModel.update(id, { comment_status: type })
  }

  const renderOpt = (record) => {
    let dom
    switch (record.comment_status) {
      case 0:
        dom = (
          <p>
            <Popconfirm title="确定要通过吗？" onConfirm={() => handleSetStatus(record._id, 1)}>
              <a>通过</a>
            </Popconfirm>
            &nbsp;
            <Popconfirm title="确定要驳回吗？" onConfirm={() => handleSetStatus(record._id, 2)}>
              <a>驳回</a>
            </Popconfirm>
          </p>
        )
        break
      case 1:
        dom = (
          <Popconfirm title="确定要屏蔽吗？" onConfirm={() => handleSetStatus(record._id, 3)}>
            <a>屏蔽</a>
          </Popconfirm>
        )
        break
      case 2:
        dom = (
          <Popconfirm title="确定要通过吗？" onConfirm={() => handleSetStatus(record._id, 1)}>
            <a>通过</a>
          </Popconfirm>
        )
        break
      case 3:
        dom = (
          <Popconfirm title="确定要解除屏蔽吗？" onConfirm={() => handleSetStatus(record._id, 1)}>
            <a>解除屏蔽</a>
          </Popconfirm>
        )
        break
      default:
    }
    return dom
  }

  const handleDelete = (id) => {
    commentModel.distory(id)
  }

  const handelSearchChange = (value) => {
    history.push({
      query: { ...location.query, page: 1, keyword: value },
    })
  }

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

  const columns = [
    {
      title: '评论内容',
      dataIndex: 'comment_content',
      key: 'comment_content',
    },
    {
      title: '评论文章',
      dataIndex: 'comment_post',
      key: 'comment_post',
      render: (text) => {
        return text.post_title
      },
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
      filteredValue: location.query.comment_status,
      render: (text) => {
        return commentStatusMap.find((item) => item.value === text).text
      },
    },
    {
      title: '添加时间',
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
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <div>
          {renderOpt(record)}&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ]

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
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={location.query.keyword || ''}
                  onSearch={handelSearchChange}
                  placeholder="按内容、评论者、IP"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={commentModel.list}
          pagination={{
            showSizeChanger: true,
            total: commentModel.total,
            pageSize: parseInt(location.query.limit || 10, 10),
            current: parseInt(location.query.page || 1, 10),
          }}
          onChange={handleTableChange}
          loading={commentModel.loading}
        />
      </Card>
    </>
  )
}

export default Comment
