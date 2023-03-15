import { useState, useRef } from 'react';
import { message } from 'antd';
import { Input, Radio, Button, Modal, Form, Popconfirm } from 'antd';
import { For } from 'tsx-control-statements/components';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { RuleObject } from 'antd/es/form';
import { PlusOutlined } from '@ant-design/icons';
import { linkTableColumns } from '@/pages/link/constants/linkTableColumns';
import type { LinkEntity } from '@/pages/link/types/link.entity';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { EnableType } from '@/types/EnableType';
import { enableOptions } from '@/types/EnableType';
import { formItemLayout } from '@/constants/formItemLayout';
import * as LinkService from './service';
import * as linksService from '@/pages/link/service';

const Link = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<LinkEntity[]>([]);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    visible: boolean;
    record?: LinkEntity;
  }>({
    type: ModalType.ADD,
    visible: false,
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
            const createResult = await linksService.create(values);
            if (createResult.status === 201) {
              actionRef.current?.reload();
              message.success('添加成功');
            }
            break;
          case ModalType.EDIT:
            const updateResult = await linksService.update(modalProps.record?.id as string, values);
            if (updateResult.status === 201) {
              actionRef.current?.reload();
              message.success('更新成功');
            }
            break;
        }
        setModalProps({ visible: false });
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
      visible: true,
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
      visible: true,
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
      const result = await linksService.index({ url: value });
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
        visible={modalProps?.visible}
        onOk={handleModalOk}
        onCancel={() => setModalProps({ visible: false })}
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
              <For
                each="item"
                index="index"
                of={enableOptions}
                body={(item, index) => (
                  <Radio.Button value={item.value} key={index}>
                    {item.label}
                  </Radio.Button>
                )}
              />
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Link;
