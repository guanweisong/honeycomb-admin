'use client';

import { formItemLayout } from '@/constants/formItemLayout';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, Popconfirm, message } from 'antd';
import type { RuleObject } from 'antd/es/form';
import { useRef, useState } from 'react';
import { tagTableColumns } from './constants/tagTableColumns';
import TagService from './service';
import type { TagEntity } from './types/tag.entity';
import { TagIndexRequest } from './types/tag.index.request';

const Tag = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<TagEntity[]>([]);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    open: boolean;
    record?: TagEntity;
  }>({
    type: ModalType.ADD,
    open: false,
  });

  /**
   * 列表查询方法
   * @param params
   * @param sort
   * @param filter
   */
  const request = async (
    params: { pageSize: number; current: number; name?: string },
    sort: any,
  ) => {
    const { pageSize, current } = params;
    const data: TagIndexRequest = {
      page: current,
      limit: pageSize,
      name: params.name,
    };

    const sortKeys = Object.keys(sort);
    if (sortKeys.length > 0) {
      data.sortField = sortKeys[0];
      data.sortOrder = sort[sortKeys[0]];
    }

    const result = await TagService.index(data);
    return {
      data: result.data.list,
      success: true,
      total: result.data.total,
    };
  };

  /**
   * 新增按钮事件
   */
  const handleAddNew = () => {
    setModalProps({
      type: ModalType.ADD,
      open: true,
      record: undefined,
    });
    form.resetFields();
  };

  /**
   * 删除按钮事件
   * @param ids
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await TagService.destroy(ids);
    if (result.status === 204) {
      actionRef.current?.reload();
      message.success('删除成功');
    }
  };

  /**
   * 批量删除
   */
  const handleDeleteBatch = async () => {
    const ids = selectedRows.map((item) => item.id);
    await handleDeleteItem(ids);
    setSelectedRows([]);
  };

  /**
   * 编辑按钮事件
   * @param record
   */
  const handleEditItem = (record: TagEntity) => {
    form.setFieldsValue(record);
    setModalProps({
      type: ModalType.EDIT,
      open: true,
      record: record,
    });
  };

  /**
   * 新增、编辑弹窗表单保存事件
   */
  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        switch (modalProps.type!) {
          case ModalType.ADD:
            const createResult = await TagService.create(values);
            if (createResult.status === 201) {
              actionRef.current?.reload();
              message.success('添加成功');
            }
            break;
          case ModalType.EDIT:
            const updateResult = await TagService.update(modalProps.record?.id as string, values);
            if (updateResult.status === 201) {
              actionRef.current?.reload();
              message.success('更新成功');
            }
            break;
        }
        setModalProps({ open: false });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 校验标签名是否存在
   * @param rule
   * @param value
   */
  const validateTagName = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      let exist = false;
      const result = await TagService.index({ name: value });
      const currentId = modalProps.record?.id;
      if (result.data.total > 0 && result.data.list[0].id !== currentId) {
        exist = true;
      }
      if (exist) {
        return Promise.reject('抱歉，标签已存在，请换一个标签');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  return (
    <PageContainer>
      <ProTable<TagEntity, any>
        form={{ syncToUrl: true }}
        size={'small'}
        rowKey="id"
        request={request}
        actionRef={actionRef}
        columns={tagTableColumns({ handleEditItem, handleDeleteItem })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item.id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleAddNew}>
            <PlusOutlined /> 添加新标签
          </Button>,
        ]}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              选择了
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>项 &nbsp;&nbsp;
            </div>
          }
        >
          <Popconfirm title="确定要删除吗？" onConfirm={handleDeleteBatch}>
            <Button type="primary">批量删除</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <Modal
        title={`${ModalTypeName[ModalType[modalProps.type!] as keyof typeof ModalTypeName]}标签`}
        open={modalProps.open}
        onOk={handleModalOk}
        onCancel={() => setModalProps({ open: false })}
      >
        <Form form={form}>
          <Form.Item
            {...formItemLayout}
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }, { validator: validateTagName }]}
          >
            <Input maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Tag;
