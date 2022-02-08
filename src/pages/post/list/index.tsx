import React, { useEffect } from 'react';
import { Table, Card, Input, Row, Col, Button } from 'antd';
import type { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { Form } from '@ant-design/compatible';
import { Link } from 'umi';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import { PostListTableColumns } from './constants/postListTableColumns';
import usePostModel from '../model';
import type { PostStatus } from '@/pages/post/types/PostStatus';
import type { PostType } from '@/pages/post/types/PostType';
import { formItemLayout } from '@/constants/formItemLayout';

const FormItem = Form.Item;
const { Search } = Input;

const PostList = () => {
  const postModel = usePostModel();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    post_type: NumericArrayParam,
    post_status: NumericArrayParam,
    sortField: StringParam,
    sortOrder: StringParam,
  });

  const { limit, page, post_type, post_status, keyword } = query;

  /**
   * 删除事件
   * @param id
   */
  const handleDeleteItem = (id: string) => {
    postModel.destroy([id]);
  };

  useEffect(() => {
    postModel.index(query);
  }, [query]);

  /**
   * 表格change事件
   * @param pagination
   * @param filters
   * @param sorter
   */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    console.log(pagination, filters, sorter);
    const { field, order } = sorter as SorterResult<any>;
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
      sortField: field as string,
      sortOrder: order,
    });
  };

  /**
   * 搜索事件
   * @param value
   */
  const handleSearchChange = (value: string) => {
    setQuery({
      ...query,
      page: 1,
      keyword: value,
    });
  };

  return (
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <FormItem {...formItemLayout}>
                <Search
                  defaultValue={keyword as string}
                  onSearch={handleSearchChange}
                  placeholder="按文章名、引用内容、引用作者"
                />
              </FormItem>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary">
                <Link to="/post/edit">添加新文章</Link>
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={PostListTableColumns({
            handleDeleteItem,
            post_status: post_status as PostStatus[],
            post_type: post_type as PostType[],
          })}
          rowKey={(record) => record._id}
          dataSource={postModel.list}
          pagination={{
            showSizeChanger: true,
            total: postModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={postModel.loading}
        />
      </Card>
    </>
  );
};

export default PostList;
