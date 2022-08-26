import { useRef, useState } from 'react';
import { Input, Button, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import type { RuleObject } from 'antd/es/form';
import { tagTableColumns } from '@/pages/tag/constants/tagTableColumns';
import type { TagEntity } from '@/pages/tag/types/tag.entity';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { formItemLayout } from '@/constants/formItemLayout';
import * as TagService from './service';
import { TagIndexRequest } from '@/pages/tag/types/tag.index.request';

const Tag = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<TagEntity[]>([]);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    visible: boolean;
    record?: TagEntity;
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
  const request = async (
    params: { pageSize: number; current: number; tag_name?: string },
    sort: any,
  ) => {
    const { pageSize, current } = params;
    const data: TagIndexRequest = {
      page: current,
      limit: pageSize,
      tag_name: params.tag_name,
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
      visible: true,
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
    const ids = selectedRows.map((item) => item._id);
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
      visible: true,
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
            const updateResult = await TagService.update(modalProps.record?._id as string, values);
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
   * 校验标签名是否存在
   * @param rule
   * @param value
   */
  const validateTagName = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      let exist = false;
      const result = await TagService.index({ tag_name: value });
      const currentId = modalProps.record?._id;
      if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
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
        rowKey="_id"
        request={request}
        actionRef={actionRef}
        columns={tagTableColumns({ handleEditItem, handleDeleteItem })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item._id),
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
        visible={modalProps.visible}
        onOk={handleModalOk}
        onCancel={() => setModalProps({ visible: false })}
      >
        <Form form={form}>
          <Form.Item
            {...formItemLayout}
            name="tag_name"
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
