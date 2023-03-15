import { Popconfirm } from 'antd';
import moment from 'moment';
import { ProColumns } from '@ant-design/pro-table';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import { EnableType, EnableTypeName } from '@/types/EnableType';
import { creatCategoryTitleByDepth } from '@/utils/help';

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
      render: (text: string, record) => creatCategoryTitleByDepth(text, record),
    },
    {
      title: '分类英文名',
      dataIndex: 'titleEn',
      key: 'titleEn',
    },
    {
      title: '分类描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
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
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
