import { useRef, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import { PostListTableColumns } from './constants/postListTableColumns';
import type { PostStatus } from '@/pages/post/types/PostStatus';
import type { PostType } from '@/pages/post/types/PostType';
import * as postsService from '../service';
import { PostEntity } from '@/pages/post/types/post.entity';
import { PaginationRequest } from '@/types/PaginationRequest';

const PostList = () => {
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    post_type: NumericArrayParam,
    post_status: NumericArrayParam,
    sortField: StringParam,
    sortOrder: StringParam,
  });
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<PostEntity[]>([]);

  const { limit, page, post_type, post_status, keyword } = query;

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
    },
    sort,
    filter,
  ) => {
    const { pageSize, current, ...rest } = params;
    console.log(sort, filter);
    const result = await postsService.indexPostList({
      ...rest,
      ...filter,
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
   * @param id
   */
  const handleDeleteItem = async (ids: string[]) => {
    const result = await postsService.destroy(ids);
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

  return (
    <PageContainer>
      <ProTable<PostEntity, PaginationRequest>
        rowKey="_id"
        request={request}
        tableLayout="fixed"
        actionRef={actionRef}
        columns={PostListTableColumns({
          handleDeleteItem,
          post_status: post_status as PostStatus[],
          post_type: post_type as PostType[],
        })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item._id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <Link to="/post/edit">
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

export default PostList;
