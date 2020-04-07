import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Row, Col, Input, Button, Modal, Form } from 'antd'
import moment from 'moment'
import { useLocation, history } from 'umi'
import useTagModel from './model'

const Tag = () => {
  const location = useLocation()
  const tagModel = useTagModel()
  const [form] = Form.useForm()

  const columns = [
    {
      title: '标签名称',
      dataIndex: 'tag_name',
      key: 'tag_name',
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
        <p>
          <a onClick={() => handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDeleteItem(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ]

  useEffect(() => {
    tagModel.index(location.query)
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

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (tagModel.modalType === 0) {
          tagModel.create(values)
        } else {
          tagModel.update(tagModel.currentItem._id, values)
        }
        tagModel.setShowModal(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleModalCancel = () => {
    tagModel.setShowModal(false)
  }

  const handleAddNew = () => {
    tagModel.setModalType(0)
    tagModel.setShowModal(true)
    tagModel.setCurrentItem({})
    form.resetFields()
  }

  const handleDeleteItem = (id) => {
    tagModel.distory(id)
  }

  const handleEditItem = (record) => {
    form.setFieldsValue(record)
    tagModel.setCurrentItem(record)
    tagModel.setModalType(1)
    tagModel.setShowModal(true)
  }

  const validateTagName = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await tagModel.checkExist({ tag_name: value })
      if (result) {
        return Promise.reject('抱歉，标签已存在，请换一个标签')
      }
      return Promise.resolve()
    }
    return Promise.resolve()
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
                  placeholder="按标签名"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新标签
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={tagModel.list}
          pagination={{
            showSizeChanger: true,
            total: tagModel.total,
            pageSize: parseInt(location.query.limit || 10, 10),
            current: parseInt(location.query.page || 1, 10),
          }}
          onChange={handleTableChange}
          loading={tagModel.loading}
        />
      </Card>
      <Modal
        title={tagModel.modalType ? '修改标签' : '添加新标签'}
        visible={tagModel.showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form}>
          <Form.Item
            {...formItemLayout}
            name="tag_name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }, { validator: validateTagName }]}
          >
            <Input maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Tag
