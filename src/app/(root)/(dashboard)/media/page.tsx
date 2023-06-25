'use client';

import { CopyOutlined, DeleteOutlined, FileOutlined, InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Popconfirm, Space, Spin, Upload, UploadProps, message } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as mediaService from './service';
import { TabType } from './types/TabType';
import type { MediaEntity } from './types/media.entity';
import { MediaIndexRequest } from './types/media.index.request';

const { Dragger } = Upload;

export interface MediaProps {
  onSelect?: (media: MediaEntity) => void;
}

const Media = (props: MediaProps) => {
  const { onSelect } = props;

  const [list, setList] = useState<MediaEntity[]>();
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState<MediaEntity>();
  const [tab, setTab] = useState<TabType>(TabType.ALL);
  const [loading, setLoading] = useState(false);

  /**
   * 查询已上传列表
   * @param values
   */
  const index = async (values?: MediaIndexRequest) => {
    const result = await mediaService.index({ ...values, limit: 99999 });
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
  };

  /**
   * 上传的参数
   */
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: `${
      process.env.NODE_ENV === 'development' ? '//127.0.0.1:7002' : 'https://api.guanweisong.com'
    }/media`,
    headers: {
      'x-auth-token': localStorage.getItem('token')!,
    },
    onChange(info: any) {
      setLoading(true);
      const { response } = info.file;
      if (response) {
        setLoading(false);
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
          setTab(TabType.ALL);
          setCurrentItem(response);
          index();
        } else {
          message.error(response.error);
        }
      }
    },
  };

  useEffect(() => {
    index();
  }, []);

  useEffect(() => {
    if (onSelect && currentItem) {
      onSelect(currentItem);
    }
  }, [currentItem]);

  /**
   * 编辑图片
   * @param item
   */
  const onEditItem = (item: MediaEntity) => {
    setCurrentItem(item);
  };

  /**
   * 删除图片
   * @param ids
   */
  const onDeleteItem = async (ids: string) => {
    const result = await mediaService.destroy([ids]);
    if (result.status === 204) {
      index();
      setCurrentItem(undefined);
      message.success('删除成功');
    }
  };

  /**
   * 切换Tab事件
   * @param value
   */
  const handleSwitchTab = (value: string) => {
    setTab(value as TabType);
  };

  return (
    <PageContainer
      tabList={[
        {
          tab: '媒体库',
          key: TabType.ALL,
        },
        {
          tab: '上传文件',
          key: TabType.UPLOAD,
        },
      ]}
      onTabChange={handleSwitchTab}
      tabActiveKey={tab}
      loading={typeof list === 'undefined'}
    >
      <Card>
        {tab === TabType.ALL && list && (
          <div className="flex">
            {list?.length !== 0 ? (
              <ul className="flex flex-wrap overflow-hidden">
                {list.map((item) => (
                  <li
                    className={classNames(
                      'relative w-32 h-32 mr-2 mb-2 border-2 border-gray-100 bg-gray-100',
                      {
                        'border-blue-500': item.id === currentItem?.id,
                      },
                    )}
                    key={item.id}
                    onClick={() => onEditItem(item)}
                    title={item.name}
                  >
                    {item.type.indexOf('image') !== -1 ? (
                      <div
                        className="w-full h-full"
                        style={{
                          background: `url(//${item.url}?imageMogr2/thumbnail/114x)`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                        }}
                      />
                    ) : (
                      <FileOutlined className="text-2xl" />
                    )}
                    <div className="absolute text-2xl transition-all inset-0 flex text-white justify-center opacity-0 hover:opacity-100 hover:bg-black/40">
                      <Space>
                        <CopyToClipboard
                          text={`//${item?.url}`}
                          onCopy={() => message.success('已复制至剪切板')}
                        >
                          <CopyOutlined title={'复制链接'} />
                        </CopyToClipboard>
                        <Popconfirm
                          title="确定要删除吗？"
                          onConfirm={() => onDeleteItem(currentItem?.id as string)}
                        >
                          <DeleteOutlined title="删除资源" />
                        </Popconfirm>
                      </Space>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-300 text-xl">
                暂无媒体文件，请点击上方的上传文件按钮上传媒体
              </div>
            )}
          </div>
        )}
        {tab === TabType.UPLOAD && (
          <Spin spinning={loading} tip="正在上传中...">
            <div style={{ height: 400 }}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击此处或者直接拖拽文件到此处上传</p>
                <p className="ant-upload-hint">
                  支持单个或者多个文件上传，严禁上传数据文件或者其他侵权文件
                </p>
              </Dragger>
            </div>
          </Spin>
        )}
      </Card>
    </PageContainer>
  );
};

export default Media;
