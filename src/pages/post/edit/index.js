import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Select, Icon, DatePicker } from 'antd';
import moment from 'moment';
import SimpleMDE from 'react-simplemde-editor';
// import PhotoPickerModal from '../../components/common/photoPicker/photoPicker';
import MultiTag from './components/MultiTag/MultiTag';
import { postTypeMap } from '@/utils/mapping';
import "simplemde/dist/simplemde.min.css";
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)

class Post extends PureComponent {
  constructor(props) {
    super(props);
  }
  handleUpdate = (status) => {
    const data = this.props.form.getFieldsValue();
    data.post_status = status;
    this.props.dispatch({
      type: 'posts/update',
      payload: {
        id: this.props.posts.currentItem._id,
        values: data,
      },
    });
  };
  handleSubmit = (status) => {
    const data = this.props.form.getFieldsValue();
    data.post_status = status;
    data.post_author = '5bcc93b8f6ca8315941b5aaf';
    this.props.dispatch({
      type: 'posts/create',
      payload: data,
    });
  };
  onAddTag = (name, value) =>{
    this.props.dispatch({
      type: 'posts/createTag',
      payload: {
        name,
        tag_name: value,
      }
    });
  };
  onUpdateTags = (name, values) => {
    console.log('onUpdateTags', name, values);
    this.props.dispatch({
      type: 'posts/updateDetailTags',
      payload: {
        name: name,
        values: values,
      },
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const currentItem = {...this.props.posts.currentItem, ...this.props.posts.detail};
    const formValues = this.props.form.getFieldsValue();
    console.log('postDetail', currentItem);
    console.log('postDetail', formValues);
    const tagProps = {
      currentItem,
      onTagsChange: this.onUpdateTags,
      onAddTag: this.onAddTag,
      form: this.props.form,
    };
    const galleryStyleProps = {...tagProps, name: 'gallery_style'};
    const movieDirectorProps = {...tagProps, name: 'movie_director'};
    const movieActorProps = {...tagProps, name: 'movie_actor'};
    const movieStyleProps = {...tagProps, name: 'movie_style'};
    return (
      <Card>
        <Form>
          <div className={styles.main}>
            <div className={styles.mainArea}>
              <FormItem>
                {getFieldDecorator('post_title', {
                  initialValue: currentItem.post_title,
                })(
                  <Input type="text" size="large" placeholder="在此输入文章标题"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('post_content', {
                  initialValue: currentItem.post_content,
                })(
                  <SimpleMDE />
                )}
              </FormItem>
            </div>
            <div className={styles.sider}>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>发布</dt>
                <dd className={styles.blockContent}>
                  <Choose>
                    <When condition={!!currentItem._id}>
                      <If condition={currentItem.post_status === 0}>
                        <Button type="primary" onClick={this.handleUpdate.bind(null, 0)}>更新</Button>
                      </If>
                      <If condition={currentItem.post_status === 1}>
                        <Button type="primary" className={styles.rightButton}
                                onClick={this.handleUpdate.bind(null, 0)}>发布</Button>
                        <Button onClick={this.handleUpdate.bind(null, 1)}>保存</Button>
                      </If>
                    </When>
                    <Otherwise>
                      <Button type="primary" className={styles.rightButton} onClick={this.handleSubmit.bind(null, 0)}>发布</Button>
                      <Button onClick={this.handleSubmit.bind(null, 1)}>保存草稿</Button>
                    </Otherwise>
                  </Choose>
                </dd>
              </dl>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>文章类型</dt>
                <dd className={styles.blockContent}>
                  <FormItem className={styles.lastMargin}>
                    {getFieldDecorator('post_type', {
                      initialValue: currentItem.post_type || 0,
                    })(
                      <Select>
                        <For each="item" of={ postTypeMap }>
                          <Option value={item.value} key={item.value}>{item.text}</Option>
                        </For>
                      </Select>
                    )}
                  </FormItem>
                </dd>
              </dl>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>分类目录</dt>
                <dd className={styles.blockContent}>
                  <FormItem>
                    {getFieldDecorator('post_category', {
                      initialValue: (!!currentItem.post_category ? currentItem.post_category : "未分类"),
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="0">未分类</Option>
                        {/*<For each="item" of={ list }>*/}
                          {/*<Option value={item._id} key={item._id}>*/}
                            {/*{creatCategoryTitleByDepth(item.category_title, item)}*/}
                          {/*</Option>*/}
                        {/*</For>*/}
                      </Select>
                    )}
                  </FormItem>
                  <Button type="dashed" icon="plus" /*onClick={onAddCategory}*/>新建分类</Button>
                </dd>
              </dl>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>封面<span className={styles.blockTitleTip}>（尺寸：360*480）</span></dt>
                <dd className={styles.blockContent}>
                  <Choose>
                    <When condition={currentItem.post_cover}>
                      <div className={styles.coverWrap}>
                        <img src={currentItem.post_cover}/>
                      </div>
                      <Button /*onClick={handlePhotoClear.bind(null, 'post_cover')} className={styles.rightButton}*/>
                        <Icon type="delete"/>清除图片</Button>
                      <Button /*onClick={onPhotoPicker.bind(null, 'post_cover')}*/ ><Icon type="upload"/>重新上传</Button>
                    </When>
                    <Otherwise>
                      <Button /*onClick={onPhotoPicker.bind(null, 'post_cover')}*/><Icon type="upload"/>点击上传</Button>
                    </Otherwise>
                  </Choose>
                </dd>
              </dl>
              <If condition={formValues.post_type === 1}>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>主图<span className={styles.blockTitleTip}>（尺寸：2560*1440）</span></dt>
                  <dd className={styles.blockContent}>
                    <Choose>
                      <When condition={!!currentItem.movie_photo}>
                        <div className={styles.coverWrap}>
                          <img src={currentItem.movie_photo}/>
                        </div>
                        <Button /*onClick={handlePhotoClear.bind(null, 'movie_photo')}*/ className={styles.rightButton}>
                          <Icon type="delete"/>清除图片</Button>
                        <Button /*onClick={onPhotoPicker.bind(null, 'movie_photo')}*/><Icon type="upload"/>重新上传</Button>
                      </When>
                      <Otherwise>
                        <Button /*onClick={onPhotoPicker.bind(null, 'movie_photo')}*/><Icon type="upload"/>点击上传</Button>
                      </Otherwise>
                    </Choose>
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>电影英文名</dt>
                  <dd className={styles.blockContent}>
                    <FormItem className={styles.lastMargin}>
                      {getFieldDecorator('movie_name_en', {
                        initialValue: currentItem.movie_name_en,
                      })(
                        <Input type="text" placeholder="请输入英文名"/>
                      )}
                    </FormItem>
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>上映年代</dt>
                  <dd className={styles.blockContent}>
                    <FormItem className={styles.lastMargin}>
                      {getFieldDecorator('movie_time', {
                        initialValue: moment(currentItem.movie_time),
                      })(
                        <DatePicker
                          placeholder="请选择上映年代"
                        />
                      )}
                    </FormItem>
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>导演</dt>
                  <dd className={styles.blockContent}>
                    <MultiTag {...movieDirectorProps} />
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>演员</dt>
                  <dd className={styles.blockContent}>
                    <MultiTag {...movieActorProps} />
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>电影风格</dt>
                  <dd className={styles.blockContent}>
                    <MultiTag {...movieStyleProps} />
                  </dd>
                </dl>
              </If>
              <If condition={formValues.post_type === 2}>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>拍摄地点</dt>
                  <dd className={styles.blockContent}>
                    <FormItem className={styles.lastMargin}>
                      {getFieldDecorator('gallery_location', {
                        initialValue: currentItem.gallery_location,
                      })(
                        <Input type="text" placeholder="请填写地址"/>
                      )}
                    </FormItem>
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>拍摄时间</dt>
                  <dd className={styles.blockContent}>
                    <FormItem className={styles.lastMargin}>
                      {getFieldDecorator('gallery_time', {
                        initialValue: currentItem.gallery_time,
                      })(
                        <DatePicker
                          placeholder="请选择拍摄时间"
                        />
                      )}
                    </FormItem>
                  </dd>
                </dl>
                <dl className={styles.block}>
                  <dt className={styles.blockTitle}>照片风格</dt>
                  <dd className={styles.blockContent}>
                    <MultiTag {...galleryStyleProps} />
                  </dd>
                </dl>
              </If>
            </div>
          </div>
        </Form>
      </Card>
    )
  }
}

export default Post;
