import { useEffect, useState } from 'react';
import { Form, Input, Radio, Modal, Select, message } from 'antd';
import { For } from 'tsx-control-statements/components';
import { creatCategoryTitleByDepth } from '@/utils/help';
import { formItemLayout } from '@/constants/formItemLayout';
import { enableOptions, EnableType } from '@/types/EnableType';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import * as CategoryService from '../../service';
import * as categoryService from '@/pages/post/category/service';
import { CategoryEntity } from '@/pages/post/category/types/category.entity';

const { Option } = Select;

export interface ModalProps {
  type?: ModalType;
  visible: boolean;
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
      category_parent: '0',
      category_status: EnableType.ENABLE,
    });
  };

  /**
   * 分类列表获取
   */
  const index = async () => {
    const result = await categoryService.index({ limit: 9999 });
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
  }, [modalProps.visible]);

  /**
   * 关闭弹窗
   */
  const handleModalCancel = () => {
    setModalProps({
      visible: false,
    });
  };

  /**
   * 确认按钮事件
   */
  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (values.category_parent === '0') {
          delete values.category_parent;
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
              modalProps.record?._id as string,
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
      visible={modalProps.visible}
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
              of={list}
              body={(option) => (
                <Option
                  value={option._id}
                  key={option._id}
                  disabled={option._id === modalProps.record?._id}
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
