import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Input, Button, Modal, Form } from 'antd';
import type { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { StringParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';
import type { RuleObject } from 'antd/es/form';
import useTagModel from './model';
import { tagTableColumns } from '@/pages/tag/constants/tagTableColumns';
import type { TagEntity } from '@/pages/tag/types/tag.entity';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { formItemLayout } from '@/constants/formItemLayout';

const Tag = () => {
  const tagModel = useTagModel();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
  });

  const { keyword, page, limit } = query;

  const handleDeleteItem = (ids: string[]) => {
    tagModel.destroy(ids);
  };

  const handleEditItem = (record: TagEntity) => {
    form.setFieldsValue(record);
    tagModel.setCurrentItem(record);
    tagModel.setModalType(ModalType.EDIT);
    tagModel.setShowModal(true);
  };

  useEffect(() => {
    tagModel.index(query);
  }, [query]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    console.log(pagination, filters, sorter);
    setQuery({ ...query, page: pagination.current, limit: pagination.pageSize, ...filters });
  };

  const handelSearchChange = (value: string) => {
    setQuery({ ...query, page: 1, keyword: value });
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (tagModel.modalType === ModalType.ADD) {
          tagModel.create(values);
        } else {
          tagModel.update(tagModel.currentItem?._id as string, values);
        }
        tagModel.setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleModalCancel = () => {
    tagModel.setShowModal(false);
  };

  const handleAddNew = () => {
    tagModel.setModalType(ModalType.ADD);
    tagModel.setShowModal(true);
    tagModel.setCurrentItem(undefined);
    form.resetFields();
  };

  const validateTagName = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      const result = await tagModel.checkExist({ tag_name: value });
      if (result) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('抱歉，标签已存在，请换一个标签');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  return (
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={keyword || ''}
                  onSearch={handelSearchChange}
                  placeholder="按标签名"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新标签
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={tagTableColumns({ handleEditItem, handleDeleteItem })}
          rowKey={(record) => record._id}
          dataSource={tagModel.list}
          pagination={{
            showSizeChanger: true,
            total: tagModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={tagModel.loading}
        />
      </Card>
      <Modal
        title={`${ModalTypeName[ModalType[tagModel.modalType] as keyof typeof ModalTypeName]}标签`}
        visible={tagModel.showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form}>
          <Form.Item
            {...formItemLayout}
            name="tag_name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }, { validator: validateTagName }]}
          >
            <Input maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Tag;
