import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Select, Icon, DatePicker } from 'antd';
import moment from 'moment';
import SimpleMDE from 'react-simplemde-editor';
import PhotoPickerItem from './components/PhotoPickerItem';
import PhotoPickerModal from '@/components/PhotoPicker';
import AddCategoryModal from '../category/components/AddCategoryModal';
import MultiTag from './components/MultiTag';
import { postTypeMap } from '@/utils/mapping';
import { creatCategoryTitleByDepth } from '@/utils/help';
import "simplemde/dist/simplemde.min.css";
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)

class Post extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'categories/index',
      payload: {},
    });
  };
  handleSubmit = (status, type) => {
    const data = this.props.form.getFieldsValue();
    data.post_status = status;
    if (data.gallery_style) {
      data.gallery_style = data.gallery_style.split(',');
    }
    if (data.movie_director) {
      data.movie_director = data.movie_director.split(',');
    }
    if (data.movie_actor) {
      data.movie_actor = data.movie_actor.split(',');
    }
    if (data.movie_style) {
      data.movie_style = data.movie_style.split(',');
    }
    switch (type) {
      case 'create':
        data.post_author = this.props.app.user._id;
        this.props.dispatch({
          type: 'posts/create',
          payload: data,
        });
        break;
      case 'update':
        this.props.dispatch({
          type: 'posts/update',
          payload: {
            id: this.props.posts.currentItem._id,
            values: data,
          },
        });
        break;
      default:;
    }
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
      type: 'posts/updateDetail',
      payload: {
        name: name,
        values: values,
      },
    });
  };
  openPhotoPicker = (type = '') => {
    this.props.dispatch({
      type: 'posts/openPhotoPicker',
      payload: type,
    });
  };
  closePhotoPicker = () => {
    this.props.dispatch({
      type: 'posts/closePhotoPicker',
      payload: {},
    });
  };
  handlePhotoPickerOk = () => {
    this.closePhotoPicker();
    this.props.dispatch({
      type: 'posts/addPhoto',
      payload: {},
    })
  };
  handlePhotoPickerCancel = () => {
    this.closePhotoPicker();
  };
  handlePhotoClear = (type) => {
    this.props.dispatch({
      type: 'posts/updateDetail',
      payload: {
        name: type,
        values: {},
      },
    });
  };
  handleAddNewCategory = () => {
    this.props.dispatch({
      type: 'categories/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'categories/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'categories/setModalShow'
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const currentItem = this.props.posts.currentItem;
    const detail = this.props.posts.detail;
    const formValues = this.props.form.getFieldsValue();
    console.log('postDetail', currentItem);
    console.log('postDetail', formValues);
    const tagProps = {
      detail,
      onTagsChange: this.onUpdateTags,
      onAddTag: this.onAddTag,
      form: this.props.form,
      styles,
    };
    const galleryStyleProps = {...tagProps, name: 'gallery_style', title: '照片风格'};
    const movieDirectorProps = {...tagProps, name: 'movie_director', title: '导演'};
    const movieActorProps = {...tagProps, name: 'movie_actor', title: '演员'};
    const movieStyleProps = {...tagProps, name: 'movie_style', title: '电影风格'};
    const photoProps = {
      styles,
      detail,
      form: this.props.form,
      handlePhotoClear: this.handlePhotoClear,
      openPhotoPicker: this.openPhotoPicker,
    };
    const postCoverProps = {...photoProps, name: 'post_cover', title: '封面', size: '1280*720'};
    return (
      <Card>
        <Form>
          <div className={styles.main}>
            <div className={styles.mainArea}>
              <FormItem>
                {getFieldDecorator('post_title', {
                  initialValue: currentItem.post_title,
                  rules: [
                    {max: 20, message: '最多只能输入20个字符'}
                  ]
                })(
                  <Input type="text" size="large" placeholder="在此输入文章标题"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('post_content', {
                  initialValue: currentItem.post_content,
                  rules: [
                    {max: 20000, message: '最多只能输入20000个字符'}
                  ]
                })(
                  <SimpleMDE/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('post_excerpt', {
                  initialValue: currentItem.post_excerpt,
                  rules: [
                    {max: 200, message: '最多只能输入200个字符'}
                  ]
                })(
                  <TextArea rows={4} placeholder="内容简介"/>
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
                        <Button type="primary" onClick={() => this.handleSubmit(0, 'update')}>更新</Button>
                      </If>
                      <If condition={currentItem.post_status === 1}>
                        <Button type="primary" className={styles.rightButton}
                                onClick={() => this.handleSubmit(0, 'update')}>发布</Button>
                        <Button onClick={() => this.handleUpdate(1, 'update')}>保存</Button>
                      </If>
                    </When>
                    <Otherwise>
                      <Button type="primary" className={styles.rightButton} onClick={() => this.handleSubmit(0, 'create')}>发布</Button>
                      <Button onClick={() => this.handleSubmit(1, 'create')}>保存草稿</Button>
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
                      initialValue: (currentItem._id ? currentItem.post_category._id : '0'),
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        <Option value="0">未分类</Option>
                        <For each="item" of={ this.props.categories.list }>
                          <Option value={item._id} key={item._id}>
                            {creatCategoryTitleByDepth(item.category_title, item)}
                          </Option>
                        </For>
                      </Select>
                    )}
                  </FormItem>
                  <Button type="dashed" icon="plus" onClick={this.handleAddNewCategory}>新建分类</Button>
                </dd>
              </dl>
              <PhotoPickerItem {...postCoverProps} />
              <If condition={formValues.post_type === 1}>
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
                <MultiTag {...movieDirectorProps} />
                <MultiTag {...movieActorProps} />
                <MultiTag {...movieStyleProps} />
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
                        initialValue: moment(currentItem.gallery_time),
                      })(
                        <DatePicker
                          placeholder="请选择拍摄时间"
                        />
                      )}
                    </FormItem>
                  </dd>
                </dl>
                <MultiTag {...galleryStyleProps} />
              </If>
            </div>
          </div>
        </Form>
        <PhotoPickerModal
          showPhotoPicker={this.props.posts.showPhotoPicker}
          handlePhotoPickerOk={this.handlePhotoPickerOk}
          handlePhotoPickerCancel={this.handlePhotoPickerCancel}
        />
        <AddCategoryModal />
      </Card>
    )
  }
}

export default Post;
