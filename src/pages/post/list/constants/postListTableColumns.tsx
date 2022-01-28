import React from 'react';
import moment from 'moment';
import { Link } from 'umi';
import type { TableProps } from 'antd';
import { Popconfirm } from 'antd';
import type { CategoryReadOnly, PostEntity, UserReadOnly } from '@/pages/post/types/post.entity';
import { PostType, postTypeOptions, PostTypeName } from '@/pages/post/types/PostType';
import { PostStatus, PostStatusName, postStatusOptions } from '@/pages/post/types/PostStatus';

export interface PostListTableColumnsProps {
  post_type: PostType;
  post_status: PostStatus;
  handleDeleteItem: (id: string) => void;
}

export const PostListTableColumns = (props: PostListTableColumnsProps) =>
  [
    {
      title: '文章名称',
      dataIndex: 'post_title',
      key: 'post_title',
    },
    {
      title: '引用内容',
      dataIndex: 'quote_content',
      key: 'quote_content',
    },
    {
      title: '分类',
      dataIndex: 'post_category',
      key: 'post_category',
      render: (text: CategoryReadOnly) => (text ? text.category_title : '无'),
    },
    {
      title: '类型',
      dataIndex: 'post_type',
      key: 'post_type',
      filters: postTypeOptions,
      filteredValue: props.post_type,
      render: (text: PostType) => PostTypeName[PostType[text] as keyof typeof PostTypeName],
    },
    {
      title: '作者',
      dataIndex: 'post_author',
      key: 'post_author',
      render: (text: UserReadOnly) => (text ? text.user_name : '无'),
    },
    {
      title: '状态',
      dataIndex: 'post_status',
      key: 'post_status',
      filters: postStatusOptions,
      filteredValue: props.post_status,
      render: (text: PostStatus) => PostStatusName[PostStatus[text] as keyof typeof PostStatusName],
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'post_views',
      key: 'post_views',
      sorter: true,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text: string, record: PostEntity) => (
        <p>
          <Link to={`/post/edit?_id=${record._id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as Pick<TableProps<PostEntity>, 'columns'>;
