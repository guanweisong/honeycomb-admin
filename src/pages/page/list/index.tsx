import { useRef, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import { Link } from 'umi';
import { pageListTableColumns } from '@/pages/page/list/constants/pageListTableColumns';
import type { PageStatus } from '@/pages/page/types/PageStatus';
import { PaginationRequest } from '@/types/PaginationRequest';
import { PageEntity } from '@/pages/page/types/page.entity';
import * as PageService from '../service';

const Page = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<PageEntity[]>([]);

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    page_status: NumericArrayParam,
    keyword: StringParam,
  });

  const { page, limit, page_status, keyword } = query;

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
    const result = await PageService.indexPageList({
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
    const ids = selectedRows.map((item) => item._id);
    await handleDeleteItem(ids);
    setSelectedRows([]);
  };

  return (
    <PageContainer>
      <ProTable<PageEntity, PaginationRequest>
        rowKey="_id"
        request={request}
        actionRef={actionRef}
        columns={pageListTableColumns({
          handleDeleteItem,
          page_status: page_status as PageStatus[],
        })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item._id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <Link to="/page/edit">
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
