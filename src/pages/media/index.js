import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Popconfirm, Card, Form, Tabs, Upload, Spin, Icon, message, Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Media extends PureComponent {
  constructor(props) {
    super(props)
    this.uploadProps = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      action: 'http://127.0.0.1:7001/media/',
      onChange(info) {
        props.dispatch({type: 'media/showLoading'});
        const response = info.file.response;
        if (response) {
          props.dispatch({type: 'media/hideLoading'});
          if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            props.dispatch({
              type: 'media/setCurrentTab',
              payload: "all",
            });
            props.dispatch({
              type: 'media/saveCurrentItem',
              payload: response,
            });
            props.dispatch({
              type: 'media/index',
              payload: {}
            });
          } else {
            message.error(response.error);
          }
        }
      },
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'media/index',
      payload:{}
    });
  }
  onEditItem = (item) => {
    this.props.dispatch({
      type: 'media/saveCurrentItem',
      payload: item,
    });
  };
  onDeleteItem = (id) => {
    this.props.dispatch({
      type: 'media/distory',
      payload: id,
    });
  };
  handelSwitchTab = (value) => {
    this.props.dispatch({
      type: 'media/setCurrentTab',
      payload: value,
    });
  };
  render() {
    const currentItem = this.props.media.currentItem;
    return (
      <Card>
        <Tabs activeKey={this.props.media.tab} onChange={this.handelSwitchTab}>
          <TabPane tab="媒体库" key="all">
            <div className={styles.mediaContent}>
              <Choose>
                <When condition={ this.props.media.list.length !== 0 }>
                  <div className={styles.mediaList}>
                    <ul className={styles.mediaItems}>
                      <For each="item" of={ this.props.media.list }>
                        <li className={item._id === currentItem._id ? styles.mediaItemActive : styles.mediaItem} key={item._id}
                            onClick={() => this.onEditItem(item)}>
                          <Choose>
                            <When condition={ item.media_type.indexOf('image') != -1 }>
                              <img src={`//${item.media_url}`} className={styles.mediaImage}/>
                            </When>
                            <Otherwise>
                              <Icon type="file" className={styles.mediaFile}/>
                            </Otherwise>
                          </Choose>
                          <span className={styles.mediaTitle}>{item.media_name}</span>
                        </li>
                      </For>
                    </ul>
                  </div>
                  <div className={styles.mediaDetail}>
                    <If condition={ Object.getOwnPropertyNames(currentItem).length !== 0 }>
                      <div className={styles.mediaDetailTip}>附件详情</div>
                      <div className={styles.mediaDetailIntro}>
                        <div className={styles.mediaDetailImage}>
                          <Choose>
                            <When condition={ currentItem.media_type && currentItem.media_type.indexOf('image') !== -1 }>
                              <img src={`//${currentItem.media_url}`} alt=""/>
                            </When>
                            <Otherwise>
                              <Icon type="file"/>
                            </Otherwise>
                          </Choose>
                        </div>
                        <div className={styles.mediaDetailInfo}>
                          <div className={styles.mediaDetailName}>
                            {currentItem.media_name}
                          </div>
                          <div className={styles.mediaDetailDate}>
                            {moment(currentItem.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                          <div className={styles.mediaDetailSize}>
                            {Math.ceil(currentItem.media_size / 1024)} kb
                          </div>
                          <div>
                            <Popconfirm title="确定要删除吗？" onConfirm={() => this.onDeleteItem(currentItem._id)}>
                              <a>永久删除</a>
                            </Popconfirm>
                            <CopyToClipboard
                              text={`//${currentItem.media_url}`}
                              onCopy={() => message.success('已复制至剪切板')}
                              style={{marginTop: '10px'}}
                            >
                              <Button type="primary" icon="copy">复制链接</Button>
                            </CopyToClipboard>
                          </div>
                        </div>
                      </div>
                    </If>
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
          <TabPane tab="上传文件" key="upload">
            <Spin spinning={this.props.media.loading} tip="正在上传中...">
              <div style={{height: 400}}>
                <Dragger {...this.uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                  </p>
                  <p className="ant-upload-text">点击此处或者直接拖拽文件到此处上传</p>
                  <p className="ant-upload-hint">支持单个或者多个文件上传，严禁上传数据文件或者其他侵权文件</p>
                </Dragger>
              </div>
            </Spin>
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Media;
