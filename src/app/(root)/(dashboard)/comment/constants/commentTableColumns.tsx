import type { ProColumns } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { commentStatusOptions } from '../types/CommentStatus';
import type { CommentEntity } from '../types/comment.entity';
export interface CommentTableColumnsProps {
  handleDelete: (ids: string[]) => void;
  renderOpt: (record: CommentEntity) => React.ReactNode;
}

export const commentTableColumns = (props: CommentTableColumnsProps) =>
  [
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '评论文章',
      dataIndex: 'postId',
      key: 'postId',
      render: (text: any) => {
        return text?.post_title;
      },
    },
    {
      title: '评论人',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '评论人邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '评论IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '评论状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: commentStatusOptions,
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      search: false,
      render: (text, record) => (
        <div>
          {props.renderOpt(record)}&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDelete([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ProColumns<CommentEntity>[];
