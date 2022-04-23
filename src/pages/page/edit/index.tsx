import { useEffect, useState } from 'react';
import { Card, Input, Button, Form, message } from 'antd';
import { If, When, Otherwise, Choose } from 'tsx-control-statements/components';
import SimpleMDE from 'react-simplemde-editor';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { StringParam, useQueryParams } from 'use-query-params';
import styles from './index.less';
import { PageStatus } from '@/pages/page/types/PageStatus';
import { useModel } from '@@/plugin-model/useModel';
import type { PageEntity } from '@/pages/page/types/page.entity';
import * as pagesService from '@/pages/page/service';
import showdown from 'showdown';

const converter = new showdown.Converter();
const FormItem = Form.Item;

const Page = () => {
  const { initialState } = useModel('@@initialState');
  const [currentItem, setCurrentItem] = useState<PageEntity>();
  const userInfo = initialState?.userInfo;

  const [form] = Form.useForm();

  const [query] = useQueryParams({
    _id: StringParam,
  });

  const { _id } = query;

  /**
   * 查询详情
   * @param values
   */
  const detail = async (values: Partial<PageEntity>) => {
    console.log('pages=>model=>detial', values);
    let result;
    if (typeof values._id !== 'undefined') {
      result = await pagesService.indexPageDetail(values);
      result = result.data;
      if (result.page_content) {
        result.page_content = converter.makeMarkdown(result.page_content);
      }
    }
    setCurrentItem(result);
  };

  useEffect(() => {
    if (_id) {
      detail({ _id });
    } else {
      setCurrentItem(undefined);
    }
  }, [_id]);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(currentItem);
  }, [currentItem]);

  /**
   * 更新
   * @param status
   */
  const handleUpdate = (status: PageStatus) => {
    form
      .validateFields()
      .then(async (values) => {
        const data = values;
        data.page_status = status;
        const result = await pagesService.update(currentItem?._id as string, values);
        if (result && result.status === 201) {
          message.success('更新成功');
          detail({ _id: currentItem?._id as string });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 提交
   * @param status
   */
  const handleSubmit = (status: PageStatus) => {
    form
      .validateFields()
      .then(async (values) => {
        const data = values;
        data.page_status = status;
        data.page_author = userInfo?._id;
        const result = await pagesService.create(data);
        if (result && result.status === 201) {
          message.success('添加成功');
          history.push({
            pathname: '/page/edit',
            query: {
              _id: result.data._id,
            },
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <PageContainer
      extra={[
        <Choose>
          <When condition={currentItem?._id}>
            <If condition={currentItem!.page_status === PageStatus.PUBLISHED}>
              <Button type="primary" onClick={() => handleUpdate(0)}>
                更新
              </Button>
            </If>
            <If condition={currentItem!.page_status === PageStatus.DRAFT}>
              <Button
                type="primary"
                className={styles.rightButton}
                onClick={() => handleUpdate(PageStatus.PUBLISHED)}
              >
                发布
              </Button>
              <Button onClick={() => handleUpdate(PageStatus.DRAFT)}>保存</Button>
            </If>
          </When>
          <Otherwise>
            <Button
              type="primary"
              className={styles.rightButton}
              onClick={() => handleSubmit.bind(PageStatus.PUBLISHED)}
            >
              发布
            </Button>
            <Button onClick={() => handleSubmit(PageStatus.DRAFT)}>保存草稿</Button>
          </Otherwise>
        </Choose>,
      ]}
    >
      <Card>
        <Form form={form}>
          <div className={styles.main}>
            <div className={styles.mainArea}>
              <FormItem name="page_title">
                <Input type="text" size="large" placeholder="在此输入文章标题" />
              </FormItem>
              <FormItem name="page_content">
                <SimpleMDE className="markdown-body" />
              </FormItem>
            </div>
          </div>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Page;
