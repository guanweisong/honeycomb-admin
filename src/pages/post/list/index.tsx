import React, { useEffect } from 'react';
import { Table, Card, Input, Row, Col, Button } from 'antd';
import { Form } from '@ant-design/compatible';
import { Link } from 'umi';
import { StringParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';
import { PostListTableColumns } from './constants/postListTableColumns';
import usePostModel from '../model';
import type { PostStatus } from '@/pages/post/types/PostStatus';
import type { PostType } from '@/pages/post/types/PostType';

const FormItem = Form.Item;
const { Search } = Input;

const PostList = () => {
  const postModel = usePostModel();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    post_type: NumberParam,
    post_status: NumberParam,
  });

  const { limit, page, post_type, post_status, keyword } = query;

  const handleDeleteItem = (id: string) => {
    postModel.destroy([id]);
  };

  useEffect(() => {
    postModel.index(query);
  }, [query]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const handleSearchChange = (value: string) => {
    setQuery({
      ...query,
      page: 1,
      keyword: value,
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
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
            post_status: post_status as PostStatus,
            post_type: post_type as PostType,
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
