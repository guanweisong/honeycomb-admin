import React from 'react';
import { Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { TagEntity } from '@/pages/tag/types/tag.entity';

export interface TagTableColumnsProps {
  handleEditItem: (record: TagEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
}

export const tagTableColumns = (props: TagTableColumnsProps) =>
  [
    {
      title: '标签名称',
      dataIndex: 'tag_name',
      key: 'tag_name',
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
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ColumnsType<TagEntity>;
