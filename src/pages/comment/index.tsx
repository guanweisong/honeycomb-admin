import { useRef, useState } from 'react';
import { Popconfirm, message, Button } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { commentTableColumns } from './constants/commentTableColumns';
import { CommentStatus } from '@/pages/comment/types/CommentStatus';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';
import * as CommentService from './service';
import * as commentsService from '@/pages/comment/service';

const Comment = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<CommentEntity[]>([]);

  /**
   * 列表查询方法
   * @param params
   */
  const request = async (params: {
    pageSize: number;
    current: number;
    comment_status?: CommentStatus[];
  }) => {
    const { pageSize, current, comment_status } = params;
    const result = await CommentService.index({
      comment_status,
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
   * 评论状态操作
   * @param id
   * @param type
   */
  const handleSetStatus = async (id: string, type: CommentStatus) => {
    const result = await commentsService.update(id, { comment_status: type });
    if (result.status === 201) {
      actionRef.current?.reload();
      message.success('更新成功');
    }
  };

  /**
   * 列操作栏渲染
   * @param record
   */
  const renderOpt = (record: CommentEntity) => {
    let dom;
    switch (record.comment_status) {
      case CommentStatus.TO_AUDIT:
        dom = (
          <p>
            <Popconfirm
              title="确定要通过吗？"
              onConfirm={() => handleSetStatus(record._id, CommentStatus.PUBLISH)}
            >
              <a>通过</a>
            </Popconfirm>
            &nbsp;
            <Popconfirm
              title="确定要驳回吗？"
              onConfirm={() => handleSetStatus(record._id, CommentStatus.RUBBISH)}
            >
              <a>驳回</a>
            </Popconfirm>
          </p>
        );
        break;
      case CommentStatus.PUBLISH:
        dom = (
          <Popconfirm
            title="确定要屏蔽吗？"
            onConfirm={() => handleSetStatus(record._id, CommentStatus.BAN)}
          >
            <a>屏蔽</a>
          </Popconfirm>
        );
        break;
      case CommentStatus.RUBBISH:
        dom = (
          <Popconfirm
            title="确定要通过吗？"
            onConfirm={() => handleSetStatus(record._id, CommentStatus.PUBLISH)}
          >
            <a>通过</a>
          </Popconfirm>
        );
        break;
      case CommentStatus.BAN:
        dom = (
          <Popconfirm
            title="确定要解除屏蔽吗？"
            onConfirm={() => handleSetStatus(record._id, CommentStatus.PUBLISH)}
          >
            <a>解除屏蔽</a>
          </Popconfirm>
        );
        break;
      default:
    }
    return dom;
  };

  /**
   * 删除事件
   * @param ids
   */
  const handleDelete = async (ids: string[]) => {
    const result = await commentsService.destroy(ids);
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
    await handleDelete(ids);
    setSelectedRows([]);
  };

  return (
    <PageContainer>
      <ProTable<CommentEntity, any>
        rowKey="_id"
        request={request}
        actionRef={actionRef}
        columns={commentTableColumns({
          renderOpt,
          handleDelete,
        })}
        rowSelection={{
          selectedRowKeys: selectedRows.map((item) => item._id),
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
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

export default Comment;
