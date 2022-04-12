import { useEffect, useState } from 'react';
import { Popconfirm, Card, Upload, Spin, message, Space } from 'antd';
import { FileOutlined, CopyOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Choose, When, Otherwise, For } from 'tsx-control-statements/components';
import styles from './index.less';
import type { MediaEntity } from '@/pages/media/types/media.entity';
import { TabType } from '@/pages/media/types/TabType';
import { MediaIndexRequest } from '@/pages/media/types/media.index.request';
import * as mediaService from '@/pages/media/service';

const { Dragger } = Upload;

const Media = () => {
  const [list, setList] = useState<MediaEntity[]>();
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState<MediaEntity>();
  const [tab, setTab] = useState<TabType>(TabType.ALL);
  const [loading, setLoading] = useState(false);

  console.log(total);

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
  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: `${
      process.env.NODE_ENV === 'development' ? '//127.0.0.1:7002' : 'https://api.guanweisong.com'
    }/media`,
    headers: {
      'x-auth-token': localStorage.getItem('token'),
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
          <div className={styles.mediaContent}>
            <Choose>
              <When condition={list?.length !== 0}>
                <div className={styles.mediaList}>
                  <ul className={styles.mediaItems}>
                    <For
                      of={list!}
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
