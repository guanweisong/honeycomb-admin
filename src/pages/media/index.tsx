import React, { useEffect } from 'react';
import { Popconfirm, Card, Tabs, Upload, Spin, message, Space } from 'antd';
import { FileOutlined, CopyOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Choose, When, Otherwise, For } from 'tsx-control-statements/components';
import useMediaModel from './model';
import styles from './index.less';
import Loader from '../../components/Loader';
import type { MediaEntity } from '@/pages/media/types/media.entity';
import { TabType } from '@/pages/media/types/TabType';

const { TabPane } = Tabs;
const { Dragger } = Upload;

const Media = () => {
  const mediaModel = useMediaModel();

  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: `${
      process.env.NODE_ENV === 'development' ? '//127.0.0.1:7002' : '//api.guanweisong.com'
    }/media`,
    withCredentials: true,
    onChange(info: any) {
      mediaModel.setLoading(true);
      const { response } = info.file;
      if (response) {
        mediaModel.setLoading(false);
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
          mediaModel.setTab(TabType.ALL);
          mediaModel.setCurrentItem(response);
          mediaModel.index();
        } else {
          message.error(response.error);
        }
      }
    },
  };

  useEffect(() => {
    mediaModel.index();
  }, []);

  if (!mediaModel.list) {
    return <Loader />;
  }

  /**
   * 编辑图片
   * @param item
   */
  const onEditItem = (item: MediaEntity) => {
    mediaModel.setCurrentItem(item);
  };

  /**
   * 删除图片
   * @param ids
   */
  const onDeleteItem = (ids: string) => {
    mediaModel.destroy([ids]);
  };

  /**
   * 切换Tab事件
   * @param value
   */
  const handleSwitchTab = (value: string) => {
    mediaModel.setTab(value as TabType);
  };

  const { currentItem } = mediaModel;

  return (
    <Card>
      <Tabs activeKey={mediaModel.tab} onChange={handleSwitchTab}>
        <TabPane tab="媒体库" key={TabType.ALL}>
          <div className={styles.mediaContent}>
            <Choose>
              <When condition={mediaModel.list.length !== 0}>
                <div className={styles.mediaList}>
                  <ul className={styles.mediaItems}>
                    <For
                      of={mediaModel.list}
                      body={(item) => (
                        <li
                          className={
                            item._id === currentItem?._id
                              ? styles.mediaItemActive
                              : styles.mediaItem
                          }
                          key={item._id}
                          onClick={() => onEditItem(item)}
                          title={item.media_name}
                        >
                          <Choose>
                            <When condition={item.media_type.indexOf('image') !== -1}>
                              <img
                                src={`//${item.media_url}?imageMogr2/thumbnail/114x`}
                                className={styles.mediaImage}
                              />
                            </When>
                            <Otherwise>
                              <FileOutlined className={styles.mediaFile} />
                            </Otherwise>
                          </Choose>
                          <div className={styles.mediaLayer}>
                            <Space>
                              <CopyToClipboard
                                text={`//${currentItem?.media_url}`}
                                onCopy={() => message.success('已复制至剪切板')}
                              >
                                <CopyOutlined title={'复制链接'} />
                              </CopyToClipboard>
                              <Popconfirm
                                title="确定要删除吗？"
                                onConfirm={() => onDeleteItem(currentItem?._id as string)}
                              >
                                <DeleteOutlined title="删除资源" />
                              </Popconfirm>
                            </Space>
                          </div>
                        </li>
                      )}
                    />
                  </ul>
                </div>
              </When>
              <Otherwise>
                <div className={styles.hasNoMedia}>
                  暂无媒体文件，请点击上方的上传文件按钮上传媒体
                </div>
              </Otherwise>
            </Choose>
          </div>
        </TabPane>
        <TabPane tab="上传文件" key={TabType.UPLOAD}>
          <Spin spinning={mediaModel.loading} tip="正在上传中...">
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
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Media;
