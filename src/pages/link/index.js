import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Row, Col, Input, Radio, Button, Modal, Form } from 'antd'
import moment from 'moment'
import { enableStatusMap } from '@/utils/mapping'
import { useLocation, history } from 'umi'
import useLinkModel from './model'

const Link = () => {
  const linkModel = useLinkModel()
  const location = useLocation()
  const [form] = Form.useForm()

  const columns = [
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
      filteredValue: location.query.link_status,
      render: (text, record) => enableStatusMap.find((item) => item.value === text).tag,
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
    linkModel.index(location.query)
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
        if (linkModel.modalType === 0) {
          linkModel.create(values)
        } else {
          linkModel.update(linkModel.currentItem._id, values)
        }
        linkModel.setShowModal(false)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleAddNew = () => {
    linkModel.setModalType(0)
    linkModel.setShowModal(true)
    linkModel.setCurrentItem({})
    form.resetFields()
    form.setFieldsValue({ link_status: 1 })
  }

  const handleDeleteItem = (id) => {
    linkModel.distory(id)
  }

  const handleEditItem = (record) => {
    form.setFieldsValue({ link_status: 1, ...record })
    linkModel.setCurrentItem(record)
    linkModel.setModalType(1)
    linkModel.setShowModal(true)
  }

  const validateLinkUrl = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await linkModel.checkExist({ link_url: value })
      if (result) {
        return Promise.reject('抱歉，URL已存在，请换一个URL')
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
                  placeholder="按链接名称或者URL"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新链接
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={linkModel.list}
          pagination={{
            showSizeChanger: true,
            total: linkModel.total,
            pageSize: parseInt(location.query.limit || 10, 10),
            current: parseInt(location.query.page || 1, 10),
          }}
          loading={linkModel.loading}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        title={linkModel.modalType ? '修改链接' : '添加新链接'}
        visible={linkModel.showModal}
        onOk={handleModalOk}
        onCancel={() => linkModel.setShowModal(false)}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item
            {...formItemLayout}
            name="link_name"
            label="链接名称"
            rules={[{ required: true, message: '请输入链接名称' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="link_url"
            label="链接URL"
            rules={[
              { required: true, message: '请输入链接URL' },
              { type: 'url', message: '请输入正确的链接地址' },
              { validator: validateLinkUrl },
            ]}
          >
            <Input placeholder="请以http://或者https://开头" autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="link_description"
            label="链接描述："
            rules={[{ required: true, message: '请输入链接描述' }]}
          >
            <Input type="textarea" rows={3} autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item {...formItemLayout} name="link_status" label="状态">
            <Radio.Group buttonStyle="solid">
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

export default Link
