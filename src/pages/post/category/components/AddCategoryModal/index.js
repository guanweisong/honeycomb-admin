import React, { useEffect } from 'react'
import { Form, Input, Radio, Modal, Select } from 'antd'
import { creatCategoryTitleByDepth } from '@/utils/help'
import useCategoryModel from '@/models/category'

const { Option } = Select

const AddCategoryModal = () => {
  const categoryModel = useCategoryModel()
  const [form] = Form.useForm()

  const initForm = () => {
    form.resetFields()
    form.setFieldsValue({
      category_parent: '0',
      category_status: 1,
    })
  }

  useEffect(() => {
    if (categoryModel.modalType === 0) {
      initForm()
    } else {
      form.setFieldsValue(categoryModel.currentItem)
    }
  }, [categoryModel.modalType])

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (categoryModel.modalType === 0) {
          categoryModel.create(values)
        } else {
          categoryModel.update(categoryModel.currentItem._id, values)
        }
        categoryModel.setShowModal(false)
        initForm()
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleModalCancel = () => {
    categoryModel.setShowModal(false)
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }

  console.log(1111, categoryModel)

  return (
    <Modal
      title={categoryModel.modalType ? '修改分类' : '添加新分类'}
      visible={categoryModel.showModal}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          name="category_title"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="category_title_en"
          label="分类英文名"
          rules={[{ required: true, message: '请输入分类英文名' }]}
        >
          <Input placeholder="输入小写字母，单词间以中划线分隔，用于URL显示" maxLength={20} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="category_parent"
          label="父级分类"
          rules={[{ required: true, message: '请选择父级分类' }]}
        >
          <Select>
            <Option value="0">无父级分类</Option>
            <For each="option" of={categoryModel.list}>
              <Option
                value={option._id}
                key={option._id}
                disabled={option._id === categoryModel.currentItem._id}
              >
                {creatCategoryTitleByDepth(option.category_title, option)}
              </Option>
            </For>
          </Select>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="category_description"
          label="分类描述："
          rules={[{ required: true, message: '请输入分类描述' }]}
        >
          <Input type="textarea" rows={3} autoComplete="off" maxLength={200} />
        </Form.Item>
        <Form.Item {...formItemLayout} name="category_status" label="状态">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={1}>启用</Radio.Button>
            <Radio.Button value={0}>禁用</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCategoryModal
