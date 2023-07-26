'use client';

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import Link from 'next/link';
import { useRef, useState } from 'react';
import PostService from '../service';
import type { PostStatus } from '../types/PostStatus';
import type { PostType } from '../types/PostType';
import type { PostEntity } from '../types/post.entity';
import type { PostIndexRequest } from '../types/post.index.request';
import { PostListTableColumns } from './constants/postListTableColumns';

const PostList = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<PostEntity[]>([]);

  /**
   * 列表查询方法
   * @param params
   * @param sort
   * @param filter
   */
  const request = async (
    params: {
      pageSize: number;
      current: number;
      title?: string;
      type?: PostType[];
      status?: PostStatus[];
    },
    sort: any,
  ) => {
    const { pageSize, current, title, type, status } = params;
    const data: PostIndexRequest = {
      title,
      type,
      status,
      page: current,
      limit: pageSize,
    };
    const sortKeys = Object.keys(sort);
    if (sortKeys.length > 0) {
      data.sortField = sortKeys[0];
      data.sortOrder = sort[sortKeys[0]];
    }
    const result = await PostService.indexPostList(data);
    return {
      data: result.data.list,
      success: true,
      total: result.data.total,
    };
  };

  /**
   * 删除事件
   * @param id
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await PostService.destroy(ids);
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
      <ProTable<PostEntity, any>
        rowKey="id"
        size={'middle'}
        form={{ syncToUrl: true }}
        request={request}
        tableLayout="fixed"
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        columns={PostListTableColumns({
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
            <Link href="/post/edit">
              <PlusOutlined /> 添加新文章
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

export default PostList;
