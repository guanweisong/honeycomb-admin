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
    id: StringParam,
  });

  const { id } = query;

  /**
   * 查询详情
   * @param values
   */
  const detail = async (values: Partial<PageEntity>) => {
    console.log('pages=>model=>detail', values);
    let result;
    if (typeof values.id !== 'undefined') {
      result = await pagesService.indexPageDetail(values);
      result = result.data;
      if (result.content) {
        result.content = converter.makeMarkdown(result.content);
      }
    }
    setCurrentItem(result);
  };

  useEffect(() => {
    if (id) {
      detail({ id });
    } else {
      setCurrentItem(undefined);
    }
  }, [id]);

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
        const result = await pagesService.update(currentItem?.id as string, values);
        if (result && result.status === 201) {
          message.success('更新成功');
          detail({ id: currentItem?.id as string });
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
        data.status = status;
        data.author = userInfo?.id;
        const result = await pagesService.create(data);
        if (result && result.status === 201) {
          message.success('添加成功');
          history.push({
            pathname: '/page/edit',
            query: {
              id: result.data.id,
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
          <When condition={currentItem?.id}>
            <If condition={currentItem!.status === PageStatus.PUBLISHED}>
              <Button type="primary" onClick={() => handleUpdate(PageStatus.PUBLISHED)}>
                更新
              </Button>
            </If>
            <If condition={currentItem!.status === PageStatus.DRAFT}>
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
              <FormItem name="title">
                <Input type="text" size="large" placeholder="在此输入文章标题" />
              </FormItem>
              <FormItem name="content">
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
