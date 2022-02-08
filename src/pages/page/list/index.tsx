import React, { useEffect } from 'react';
import { Table, Card, Input, Row, Col, Button, Form } from 'antd';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import { Link } from 'umi';
import type { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import usePageModel from '../model';
import { formItemLayout } from '@/constants/formItemLayout';
import { pageListTableColumns } from '@/pages/page/list/constants/pageListTableColumns';
import type { PageStatus } from '@/pages/page/types/PageStatus';

const Page = () => {
  const pageModel = usePageModel();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    page_status: NumericArrayParam,
    keyword: StringParam,
  });

  const { page, limit, page_status, keyword } = query;

  /**
   * 删除事件
   * @param ids
   */
  const handleDeleteItem = (ids: string[]) => {
    pageModel.destroy(ids);
  };

  useEffect(() => {
    pageModel.index(query);
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
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
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
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={keyword as string}
                  onSearch={handleSearchChange}
                  placeholder="按文章名"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary">
                <Link to="/page/edit">添加新页面</Link>
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={pageListTableColumns({
            handleDeleteItem,
            page_status: page_status as PageStatus[],
          })}
          rowKey={(record) => record._id}
          dataSource={pageModel.list}
          pagination={{
            showSizeChanger: true,
            total: pageModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={pageModel.loading}
        />
      </Card>
    </>
  );
};

export default Page;
