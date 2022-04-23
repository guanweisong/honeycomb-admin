import moment from 'moment';
import { Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import type { LinkEntity } from '@/pages/link/types/link.entity';
import { enableOptions } from '@/types/EnableType';

export interface LinkTableColumnsProps {
  handleEditItem: (record: LinkEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
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
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: enableOptions,
      },
    },
    {
      title: '链接描述',
      dataIndex: 'link_description',
      key: 'link_description',
      search: false,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<LinkEntity>[];
