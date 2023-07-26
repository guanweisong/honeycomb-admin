'use client';

import { formItemLayout } from '@/constants/formItemLayout';
import { EnableType, enableOptions } from '@/types/EnableType';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, Popconfirm, Radio, message } from 'antd';
import type { RuleObject } from 'antd/es/form';
import { useRef, useState } from 'react';
import { linkTableColumns } from './constants/linkTableColumns';
import LinkService from './service';
import type { LinkEntity } from './types/link.entity';

const Link = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<LinkEntity[]>([]);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    open: boolean;
    record?: LinkEntity;
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
  const request = async (params: {
    pageSize: number;
    current: number;
    name?: string;
    url?: string;
    status?: EnableType[];
  }) => {
    const { pageSize, current, name, url, status } = params;
    const result = await LinkService.index({
      name,
      url,
      status,
      page: current,
      limit: pageSize,
    });
    return {
      data: result.data.list,
      success: true,
      total: result.data.total,
    };
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
            const createResult = await LinkService.create(values);
            if (createResult.status === 201) {
              actionRef.current?.reload();
              message.success('添加成功');
            }
            break;
          case ModalType.EDIT:
            const updateResult = await LinkService.update(modalProps.record?.id as string, values);
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
   * 新增按钮事件
   */
  const handleAddNew = () => {
    setModalProps({
      type: ModalType.ADD,
      open: true,
      record: undefined,
    });
    form.resetFields();
    form.setFieldsValue({ status: EnableType.ENABLE });
  };

  /**
   * 删除按钮事件
   * @param ids
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await LinkService.destroy(ids);
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
  const handleEditItem = (record: LinkEntity) => {
    form.setFieldsValue(record);
    setModalProps({
      type: ModalType.EDIT,
      open: true,
      record: record,
    });
  };

  /**
   * 校验link_url是否存在
   * @param rule
   * @param value
   */
  const validateLinkUrl = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      let exist = false;
      const result = await LinkService.index({ url: value });
      const currentId = modalProps.record?.id;
      if (result.data.total > 0 && result.data.list[0].id !== currentId) {
        exist = true;
      }
      if (exist) {
        return Promise.reject('抱歉，URL已存在，请换一个URL');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  return (
    <PageContainer>
      <ProTable<LinkEntity, any>
        rowKey="id"
        defaultSize={'middle'}
        request={request}
        actionRef={actionRef}
        columns={linkTableColumns({
          handleEditItem,
          handleDeleteItem,
        })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item.id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleAddNew}>
            <PlusOutlined /> 添加新链接
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
        title={`${ModalTypeName[ModalType[modalProps.type!] as keyof typeof ModalTypeName]}链接`}
        open={modalProps?.open}
        onOk={handleModalOk}
        onCancel={() => setModalProps({ open: false })}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item
            {...formItemLayout}
            name="name"
            label="链接名称"
            rules={[{ required: true, message: '请输入链接名称' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="url"
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
            name="description"
            label="链接描述："
            rules={[{ required: true, message: '请输入链接描述' }]}
          >
            <Input.TextArea rows={3} autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item {...formItemLayout} name="status" label="状态">
            <Radio.Group buttonStyle="solid">
              {enableOptions.map((item) => (
                <Radio.Button value={item.value} key={item.value}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Link;
