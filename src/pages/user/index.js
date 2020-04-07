import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Row, Col, Input, Radio, Button, Modal, Form } from 'antd'
import moment from 'moment'
import md5 from 'md5'
import { enableStatusMap, userLevelMap } from '@/utils/mapping'
import { useLocation, history } from 'umi'
import useuserModel from './model'

const User = () => {
  const location = useLocation()
  const userModel = useuserModel()
  const [form] = Form.useForm()

  const columns = [
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
      filteredValue: location.query.userLevelMap,
      render: (text, record) => {
        return userLevelMap.find((item) => item.value === text).text
      },
    },
    {
      title: '状态',
      dataIndex: 'user_status',
      key: 'user_status',
      filters: enableStatusMap,
      filteredValue: location.query.link_status,
      render: (text, record) => enableStatusMap.find((item) => item.value === text).tag,
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
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <a onClick={() => handleEditItem(record)}>编辑</a>&nbsp;
          <If condition={record.user_level !== 1 && record.user_status !== -1}>
            <Popconfirm title="确定要删除吗？" onConfirm={() => handleDeleteItem(record._id)}>
              <a>删除</a>
            </Popconfirm>
          </If>
        </p>
      ),
    },
  ]

  useEffect(() => {
    userModel.index(location.query)
  }, [location])

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    history.push({
      query: {
        ...location.query,
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
        sortField: sorter.field,
        sortOrder: sorter.order,
      },
    })
  }

  const handelSearchChange = (value) => {
    history.push({
      query: { ...location.query, keyword: value },
    })
  }

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.user_password && (values = { ...values, user_password: md5(values.user_password) })
        if (userModel.modalType === 0) {
          userModel.create(values)
        } else {
          userModel.update(userModel.currentItem._id, values)
        }
        userModel.setShowModal(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleModalCancel = () => {
    userModel.setShowModal(false)
  }

  const handleAddNew = () => {
    form.resetFields()
    form.setFieldsValue({ user_level: 2, user_status: 1 })
    userModel.setCurrentItem({})
    userModel.setModalType(0)
    userModel.setShowModal(true)
  }

  const handleDeleteItem = (id) => {
    userModel.distory(id)
  }

  const handleEditItem = (record) => {
    form.setFieldsValue(record)
    userModel.setCurrentItem(record)
    userModel.setModalType(1)
    userModel.setShowModal(true)
  }

  const validateUserName = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_name: value })
      if (result) {
        return Promise.reject('抱歉，用户名已存在，请换一个用户名')
      }
      return Promise.resolve()
    }
    return Promise.resolve()
  }

  const validateUserEmail = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_email: value })
      if (result) {
        return Promise.reject('抱歉，用户邮箱已存在，请换一个用户邮箱')
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
                  placeholder="按用户名或者邮箱"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新用户
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={userModel.list}
          rowClassName={(record, index) => {
            if (record.user_status === -1) {
              return 'gray'
            }
          }}
          pagination={{
            showSizeChanger: true,
            total: userModel.total,
            pageSize: parseInt(location.query.limit || 10, 10),
            current: parseInt(location.query.page || 1, 10),
          }}
          onChange={handleTableChange}
          loading={userModel.loading}
        />
      </Card>
      <Modal
        title={userModel.modalType ? '修改用户' : '添加新用户'}
        visible={userModel.showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item
            {...formItemLayout}
            name="user_name"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }, { validator: validateUserName }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="user_password"
            label="密码"
            rules={[{ required: !userModel.modalType, message: '请输入密码' }]}
          >
            <Input
              autoComplete="off"
              type="password"
              maxLength={20}
              minLength={6}
              placeholder={userModel.modalType === 1 ? '留空则为不修改' : ''}
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="邮箱"
            name="user_email"
            rules={[
              { required: true, message: '请输入用户邮箱' },
              { type: 'email', message: '请输入正确的邮箱' },
              { validator: validateUserEmail },
            ]}
          >
            <Input type="textarea" rows={3} autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item {...formItemLayout} name="user_level" label="级别">
            <Radio.Group buttonStyle="solid" disabled={userModel.currentItem.user_level === 1}>
              <For each="item" index="index" of={userLevelMap}>
                <Radio.Button value={item.value} key={index}>
                  {item.text}
                </Radio.Button>
              </For>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} name="user_status" label="状态">
            <Radio.Group buttonStyle="solid" disabled={userModel.currentItem.user_level === 1}>
              <For each="item" index="index" of={enableStatusMap}>
                <Radio.Button value={item.value} key={index}>
                  {item.text}
                </Radio.Button>
              </For>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User
