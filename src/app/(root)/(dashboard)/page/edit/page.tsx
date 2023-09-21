'use client';

import { FooterToolbar, PageContainer } from '@ant-design/pro-components';
import { Button, Card, Form, Input, message } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageService from '../service';
import { PageStatus } from '../types/PageStatus';
import type { PageEntity } from '../types/page.entity';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const FormItem = Form.Item;

const styles: any = {};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentItem, setCurrentItem] = useState<PageEntity>();
  const [form] = Form.useForm();

  const id = searchParams.get('id');

  /**
   * 查询详情
   * @param values
   */
  const detail = async (values: Partial<PageEntity>) => {
    console.log('pages=>model=>detail', values);
    let result;
    if (typeof values.id !== 'undefined') {
      result = await PageService.indexPageDetail(values);
      result = result.data;
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
        data.status = status;
        const result = await PageService.update(currentItem?.id as string, values);
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
        const result = await PageService.create(data);
        if (result && result.status === 201) {
          message.success('添加成功');
          router.push(`/page/edit/id?=${result.data.id}`);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 计算按钮状态
   */
  const getBtns = () => {
    const btns = [];
    if (currentItem?.id) {
      if (currentItem!.status === PageStatus.PUBLISHED) {
        btns.push(
          <Button type="primary" onClick={() => handleUpdate(PageStatus.PUBLISHED)}>
            更新
          </Button>,
        );
      }
      if (currentItem!.status === PageStatus.DRAFT) {
        btns.push(
          <Button
            type="primary"
            className={styles.rightButton}
            onClick={() => handleUpdate(PageStatus.PUBLISHED)}
          >
            发布
          </Button>,
          <Button onClick={() => handleUpdate(PageStatus.DRAFT)}>保存</Button>,
        );
      }
    } else {
      btns.push(
        <Button
          type="primary"
          className={styles.rightButton}
          onClick={() => handleSubmit.bind(PageStatus.PUBLISHED)}
        >
          发布
        </Button>,
        <Button onClick={() => handleSubmit(PageStatus.DRAFT)}>保存草稿</Button>,
      );
    }
    return btns;
  };

  return (
    <PageContainer>
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
      <FooterToolbar>{getBtns()}</FooterToolbar>
    </PageContainer>
  );
};

export default Page;
