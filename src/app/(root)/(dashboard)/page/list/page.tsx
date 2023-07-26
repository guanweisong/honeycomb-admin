'use client';

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import Link from 'next/link';
import { useRef, useState } from 'react';
import PageService from '../service';
import type { PageStatus } from '../types/PageStatus';
import type { PageEntity } from '../types/page.entity';
import { pageListTableColumns } from './constants/pageListTableColumns';

const Page = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<PageEntity[]>([]);

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
    status?: PageStatus[];
  }) => {
    const { pageSize, current, title, status } = params;
    const result = await PageService.indexPageList({
      title,
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
   * 删除事件
   * @param ids
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await PageService.destroy(ids);
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

  return (
    <PageContainer>
      <ProTable<PageEntity, any>
        rowKey="id"
        defaultSize={'middle'}
        request={request}
        form={{ syncToUrl: true }}
        actionRef={actionRef}
        columns={pageListTableColumns({
          handleDeleteItem,
        })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item.id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <Link href="/page/edit">
              <PlusOutlined /> 添加新页面
            </Link>
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
    </PageContainer>
  );
};

export default Page;
