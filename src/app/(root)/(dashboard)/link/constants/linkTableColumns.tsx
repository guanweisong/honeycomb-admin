import { enableOptions } from '@/types/EnableType';
import type { ProColumns } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import type { LinkEntity } from '../types/link.entity';

export interface LinkTableColumnsProps {
  handleEditItem: (record: LinkEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
}

export const linkTableColumns = (props: LinkTableColumnsProps) =>
  [
    {
      title: '链接名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: enableOptions,
      },
    },
    {
      title: '链接描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text: string, record: LinkEntity) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<LinkEntity>[];
