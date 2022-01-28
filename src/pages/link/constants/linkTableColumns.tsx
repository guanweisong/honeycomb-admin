import React from 'react';
import moment from 'moment';
import { Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import type { LinkEntity } from '@/pages/link/types/link.entity';
import { enableOptions, EnableTypeName, EnableType } from '@/types/EnableType';

export interface LinkTableColumnsProps {
  handleEditItem: (record: LinkEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
  link_status: string;
}

export const linkTableColumns = (props: LinkTableColumnsProps) =>
  [
    {
      title: '链接名称',
      dataIndex: 'link_name',
      key: 'link_name',
    },
    {
      title: 'URL',
      dataIndex: 'link_url',
      key: 'link_url',
    },
    {
      title: '状态',
      dataIndex: 'link_status',
      key: 'link_status',
      filters: enableOptions.map((item) => ({ text: item.label, value: item.value })),
      filteredValue: props.link_status,
      render: (text: EnableType) => EnableTypeName[EnableType[text] as keyof typeof EnableTypeName],
    },
    {
      title: '链接描述',
      dataIndex: 'link_description',
      key: 'link_description',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text: string, record: LinkEntity) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as Pick<TableProps<LinkEntity & { _id: string }>, 'columns'>;
