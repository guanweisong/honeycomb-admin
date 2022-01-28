import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Input, Radio, Button, Modal, Form } from 'antd';
import { For } from 'tsx-control-statements/components';
import { StringParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';
import useLinkModel from './model';
import { linkTableColumns } from '@/pages/link/constants/linkTableColumns';
import type { LinkEntity } from '@/pages/link/types/link.entity';
import { ModalType } from '@/pages/link/types/ModalType';
import { EnableType } from '@/types/EnableType';
import { enableOptions } from '@/types/EnableType';

const Link = () => {
  const linkModel = useLinkModel();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    link_status: NumberParam,
  });

  const { page, limit, keyword, link_status } = query;

  useEffect(() => {
    linkModel.index(query);
  }, [query]);

  /**
   * 表格change事件
   * @param pagination
   * @param filters
   * @param sorter
   */
  const handleTableChange = (pagination, filters, sorter) => {
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

  /**
   * 新增、编辑弹窗表单保存事件
   */
  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (linkModel.modalType === ModalType.ADD) {
          linkModel.create(values);
        } else {
          linkModel.update(linkModel.currentItem?._id, values);
        }
        linkModel.setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 新增按钮事件
   */
  const handleAddNew = () => {
    linkModel.setModalType(ModalType.ADD);
    linkModel.setShowModal(true);
    linkModel.setCurrentItem(undefined);
    form.resetFields();
    form.setFieldsValue({ link_status: EnableType.ENABLE });
  };

  /**
   * 删除按钮事件
   * @param ids
   */
  const handleDeleteItem = (ids: string[]) => {
    linkModel.destroy(ids);
  };

  /**
   * 编辑按钮事件
   * @param record
   */
  const handleEditItem = (record: LinkEntity) => {
    form.setFieldsValue(record);
    linkModel.setCurrentItem(record);
    linkModel.setModalType(ModalType.EDIT);
    linkModel.setShowModal(true);
  };

  /**
   * 校验link_url是否存在
   * @param rule
   * @param value
   */
  const validateLinkUrl = async (rule, value: string) => {
    if (value && value.length > 0) {
      const result = await linkModel.checkExist({ link_url: value });
      if (result) {
        return Promise.reject('抱歉，URL已存在，请换一个URL');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
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
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={keyword || ''}
                  onSearch={handleSearchChange}
                  placeholder="按链接名称或者URL"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新链接
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={linkTableColumns({ handleEditItem, handleDeleteItem, link_status })}
          rowKey={(record) => record._id}
          dataSource={linkModel.list}
          pagination={{
            showSizeChanger: true,
            total: linkModel.total,
            pageSize: limit,
            current: page,
          }}
          loading={linkModel.loading}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        title={linkModel.modalType ? '修改链接' : '添加新链接'}
        visible={linkModel.showModal}
        onOk={handleModalOk}
        onCancel={() => linkModel.setShowModal(false)}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item
            {...formItemLayout}
            name="link_name"
            label="链接名称"
            rules={[{ required: true, message: '请输入链接名称' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="link_url"
            label="链接URL"
            rules={[
              { required: true, message: '请输入链接URL' },
              { type: 'url', message: '请输入正确的链接地址' },
              { validator: validateLinkUrl },
            ]}
          >
            <Input placeholder="请以http://或者https://开头" autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="link_description"
            label="链接描述："
            rules={[{ required: true, message: '请输入链接描述' }]}
          >
            <Input.TextArea rows={3} autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item {...formItemLayout} name="link_status" label="状态">
            <Radio.Group buttonStyle="solid">
              <For
                each="item"
                index="index"
                of={enableOptions}
                body={(item, index) => (
                  <Radio.Button value={item.value} key={index}>
                    {item.label}
                  </Radio.Button>
                )}
              />
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Link;
