'use client';

import { formItemLayout } from '@/constants/formItemLayout';
import { EnableType, enableOptions } from '@/types/EnableType';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { creatCategoryTitleByDepth } from '@/utils/help';
import { Form, Input, Modal, Radio, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import CategoryService from '../../service';
import { CategoryEntity } from '../../types/category.entity';

const { Option } = Select;

export interface ModalProps {
  type?: ModalType;
  open: boolean;
  record?: any;
}

export interface AddCategoryModalProps {
  modalProps: ModalProps;
  setModalProps: (state: ModalProps) => void;
}

const AddCategoryModal = (props: AddCategoryModalProps) => {
  const [form] = Form.useForm();
  const [list, setList] = useState<CategoryEntity[]>([]);
  const { modalProps, setModalProps } = props;

  const initForm = () => {
    form.resetFields();
    form.setFieldsValue({
      parent: '0',
      status: EnableType.ENABLE,
    });
  };

  /**
   * 分类列表获取
   */
  const index = async () => {
    const result = await CategoryService.index({ limit: 9999 });
    if (result.status === 200) {
      setList(result.data.list);
    }
  };

  useEffect(() => {
    switch (modalProps.type!) {
      case ModalType.ADD:
        initForm();
        break;
      case ModalType.EDIT:
        form.setFieldsValue(modalProps.record);
        break;
    }
  }, [modalProps.type]);

  useEffect(() => {
    index();
  }, [modalProps.open]);

  /**
   * 关闭弹窗
   */
  const handleModalCancel = () => {
    setModalProps({
      open: false,
    });
  };

  /**
   * 确认按钮事件
   */
  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (values.parent === '0') {
          delete values.parent;
        }
        switch (modalProps.type!) {
          case ModalType.ADD:
            const createResult = await CategoryService.create(values);
            if (createResult.status === 201) {
              index();
              message.success('添加成功');
            }
            break;
          case ModalType.EDIT:
            const updateResult = await CategoryService.update(
              modalProps.record?.id as string,
              values,
            );
            if (updateResult.status === 201) {
              index();
              message.success('更新成功');
            }
            break;
        }
        handleModalCancel();
        initForm();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Modal
      title={`${ModalTypeName[ModalType[modalProps.type!] as keyof typeof ModalTypeName]}分类`}
      open={modalProps.open}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <Form form={form}>
        <Form.Item
          {...formItemLayout}
          name="title"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="titleEn"
          label="分类英文名"
          rules={[{ required: true, message: '请输入分类英文名' }]}
        >
          <Input placeholder="输入小写字母，单词间以中划线分隔，用于URL显示" maxLength={20} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="parent"
          label="父级分类"
          rules={[{ required: true, message: '请选择父级分类' }]}
        >
          <Select>
            <Option value="0">无父级分类</Option>
            {list.map((option) => (
              <Option
                value={option.id}
                key={option.id}
                disabled={option.id === modalProps.record?.id}
              >
                {creatCategoryTitleByDepth(option.title, option)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="description"
          label="分类描述："
          rules={[{ required: true, message: '请输入分类描述' }]}
        >
          <Input.TextArea rows={3} autoComplete="off" maxLength={200} />
        </Form.Item>
        <Form.Item {...formItemLayout} name="status" label="状态">
          <Radio.Group buttonStyle="solid" options={enableOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
