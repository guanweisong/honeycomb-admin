import React, { useEffect } from 'react';
import { Form, Input, Radio, Modal, Select } from 'antd';
import { For } from 'tsx-control-statements/components';
import { creatCategoryTitleByDepth } from '@/utils/help';
import useCategoryModel from '@/pages/post/category/model';
import { formItemLayout } from '@/constants/formItemLayout';
import { enableOptions, EnableType } from '@/types/EnableType';
import { ModalType, ModalTypeName } from '@/types/ModalType';

const { Option } = Select;

const AddCategoryModal = () => {
  const categoryModel = useCategoryModel();
  const [form] = Form.useForm();

  const initForm = () => {
    form.resetFields();
    form.setFieldsValue({
      category_parent: '0',
      category_status: EnableType.ENABLE,
    });
  };

  useEffect(() => {
    switch (categoryModel.modalType) {
      case ModalType.ADD:
        initForm();
        break;
      case ModalType.EDIT:
        form.setFieldsValue(categoryModel.currentItem);
        break;
    }
  }, [categoryModel.modalType]);

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.category_parent === '0') {
          delete values.category_parent;
        }
        switch (categoryModel.modalType) {
          case ModalType.ADD:
            categoryModel.create(values);
            break;
          case ModalType.EDIT:
            categoryModel.update(categoryModel.currentItem?._id as string, values);
            break;
        }
        categoryModel.setShowModal(false);
        initForm();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleModalCancel = () => {
    categoryModel.setShowModal(false);
  };

  return (
    <Modal
      title={`${
        ModalTypeName[ModalType[categoryModel.modalType] as keyof typeof ModalTypeName]
      }分类`}
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
            <For
              each="option"
              of={categoryModel.list}
              body={(option) => (
                <Option
                  value={option._id}
                  key={option._id}
                  disabled={option._id === categoryModel.currentItem?._id}
                >
                  {creatCategoryTitleByDepth(option.category_title, option)}
                </Option>
              )}
            />
          </Select>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="category_description"
          label="分类描述："
          rules={[{ required: true, message: '请输入分类描述' }]}
        >
          <Input.TextArea rows={3} autoComplete="off" maxLength={200} />
        </Form.Item>
        <Form.Item {...formItemLayout} name="category_status" label="状态">
          <Radio.Group buttonStyle="solid" options={enableOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
