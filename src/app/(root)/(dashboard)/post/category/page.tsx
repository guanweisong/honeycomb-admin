'use client';

import { ModalType } from '@/types/ModalType';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';
import AddCategoryModal from './components/AddCategoryModal';
import { categoryListTableColumns } from './constans/categoryListTableColumns';
import CategoryService from './service';
import type { CategoryEntity } from './types/category.entity';

const Category = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<CategoryEntity[]>([]);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    open: boolean;
    record?: CategoryEntity;
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
    title?: string;
    path?: string;
  }) => {
    const { pageSize, current, title, path } = params;
    const result = await CategoryService.index({
      title,
      path,
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
   * 编辑事件
   * @param record
   */
  const handleEditItem = (record: CategoryEntity) => {
    setModalProps({
      record,
      open: true,
      type: ModalType.EDIT,
    });
  };

  /**
   * 删除事件
   * @param ids
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await CategoryService.destroy(ids);
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
   * 新增事件
   */
  const handleAddNew = () => {
    setModalProps({
      open: true,
      type: ModalType.ADD,
      record: undefined,
    });
  };

  return (
    <PageContainer>
      <ProTable<CategoryEntity, any>
        rowKey="id"
        defaultSize={'middle'}
        request={request}
        form={{ syncToUrl: true }}
        tableLayout="fixed"
        actionRef={actionRef}
        columns={categoryListTableColumns({ handleEditItem, handleDeleteItem })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item.id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleAddNew}>
            <PlusOutlined /> 添加新分类
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
      <AddCategoryModal modalProps={modalProps} setModalProps={setModalProps} />
    </PageContainer>
  );
};

export default Category;
