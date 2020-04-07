import React, { useEffect } from 'react'
import { Table, Popconfirm, Card, Button, Form, Col, Row } from 'antd'
import moment from 'moment'
import { enableStatusMap } from '@/utils/mapping'
import { creatCategoryTitleByDepth } from '@/utils/help'
import useCategoryModel from '@/models/category'
import AddCategoryModal from './components/AddCategoryModal'

const Category = () => {
  const categoryModel = useCategoryModel()
  const [form] = Form.useForm()

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'category_title',
      key: 'category_title',
      render: (text, record) => creatCategoryTitleByDepth(text, record),
    },
    {
      title: '分类英文名',
      dataIndex: 'category_title_en',
      key: 'category_title_en',
    },
    {
      title: '分类描述',
      dataIndex: 'category_description',
      key: 'category_description',
    },
    {
      title: '状态',
      dataIndex: 'category_status',
      key: 'category_status',
      render: (text, record) => enableStatusMap.find((item) => item.value === text).text,
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
    categoryModel.index()
  }, [])

  const handleAddNew = () => {
    categoryModel.setShowModal(true)
    categoryModel.setModalType(0)
    categoryModel.setCurrentItem({})
  }

  const handleEditItem = (record) => {
    categoryModel.setCurrentItem(record)
    categoryModel.setModalType(1)
    categoryModel.setShowModal(true)
  }

  const handleDeleteItem = (id) => {
    categoryModel.distory(id)
  }

  return (
    <div>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px', textAlign: 'right' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12} />
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新分类
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={categoryModel.list}
          size="middle"
          pagination={false}
        />
      </Card>
      <AddCategoryModal form={form} />
    </div>
  )
}

export default Category
