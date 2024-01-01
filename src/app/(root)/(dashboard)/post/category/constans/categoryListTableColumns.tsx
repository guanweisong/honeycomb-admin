import MultiLangText from '@/components/MultiLangText';
import { EnableType, EnableTypeName } from '@/types/EnableType';
import { MultiLang } from '@/types/MulitLang';
import { creatCategoryTitleByDepth } from '@/utils/help';
import { ProColumns } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import type { CategoryEntity } from '../types/category.entity';

export interface CategoryListTableColumnsProps {
  handleEditItem: (record: CategoryEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
}

export const categoryListTableColumns = (props: CategoryListTableColumnsProps) =>
  [
    {
      title: '分类名称',
      dataIndex: 'title',
      key: 'title',
      width: 120,
      render: (text: MultiLang, record) =>
        creatCategoryTitleByDepth(<MultiLangText text={text} />, record),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '分类描述',
      dataIndex: ['description'],
      key: 'description',
      search: false,
      render: (text: MultiLang) => <MultiLangText text={text} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: EnableType) => EnableTypeName[EnableType[text] as keyof typeof EnableTypeName],
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
      render: (text, record) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<CategoryEntity>[];
