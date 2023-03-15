import { Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      search: false,
      sorter: true,
      defaultSortOrder: 'desc',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<TagEntity>[];
