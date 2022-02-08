import React, { useEffect } from 'react';
import { Card, Col, Form, Input, Popconfirm, Row, Table } from 'antd';
import type { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import useCommentModel from './model';
import { commentTableColumns } from './constants/commentTableColumns';
import { CommentStatus } from '@/pages/comment/types/CommentStatus';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';
import { formItemLayout } from '@/constants/formItemLayout';

const Comment = () => {
  const commentModel = useCommentModel();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    comment_status: NumericArrayParam,
  });

  const { comment_status, keyword, limit, page } = query;

  useEffect(() => {
    commentModel.index(query);
  }, [query]);

  const handleSetStatus = (id: string, type: CommentStatus) => {
    commentModel.update(id, { comment_status: type });
  };

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

  const handleDelete = (ids: string[]) => {
    commentModel.destroy(ids);
  };

  const handleSearchChange = (value: string) => {
    setQuery({
      ...query,
      page: 1,
      keyword: value,
    });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    console.log(pagination, filters, sorter);
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    });
  };

  return (
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={keyword as string}
                  onSearch={handleSearchChange}
                  placeholder="按内容、评论者、IP"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={commentTableColumns({
            comment_status: comment_status as CommentStatus[],
            renderOpt,
            handleDelete,
          })}
          rowKey={(record) => record._id}
          dataSource={commentModel.list}
          pagination={{
            showSizeChanger: true,
            total: commentModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={commentModel.loading}
        />
      </Card>
    </>
  );
};

export default Comment;
