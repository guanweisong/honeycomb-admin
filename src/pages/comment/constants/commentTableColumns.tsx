import React from 'react';
import moment from 'moment';
import { Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';
import {
  CommentStatus,
  CommentStatusName,
  commentStatusOptions,
} from '@/pages/comment/types/CommentStatus';

export interface CommentTableColumnsProps {
  handleDelete: (ids: string[]) => void;
  renderOpt: (record: CommentEntity) => void;
  comment_status: CommentStatus[];
}

export const commentTableColumns = (props: CommentTableColumnsProps) =>
  [
    {
      title: '评论内容',
      dataIndex: 'comment_content',
      key: 'comment_content',
    },
    {
      title: '评论文章',
      dataIndex: 'comment_post',
      key: 'comment_post',
      render: (text) => {
        return text?.post_title;
      },
    },
    {
      title: '评论人',
      dataIndex: 'comment_author',
      key: 'comment_author',
    },
    {
      title: '评论人邮箱',
      dataIndex: 'comment_email',
      key: 'comment_email',
    },
    {
      title: '评论IP',
      dataIndex: 'comment_ip',
      key: 'comment_ip',
    },
    {
      title: '评论状态',
      dataIndex: 'comment_status',
      key: 'comment_status',
      filters: commentStatusOptions.map((item) => ({ text: item.label, value: item.value })),
      filteredValue: props.comment_status,
      render: (text) => {
        return CommentStatusName[CommentStatus[text] as keyof typeof CommentStatusName];
      },
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <div>
          {props.renderOpt(record)}&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDelete([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ColumnsType<CommentEntity>;
