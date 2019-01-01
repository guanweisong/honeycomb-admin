import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button } from 'antd';
import SimpleMDE from 'react-simplemde-editor';
// import PhotoPickerModal from '../../components/common/photoPicker/photoPicker';
import "simplemde/dist/simplemde.min.css";
import styles from './index.less';

const FormItem = Form.Item;
const mapStateToProps = (state) => state;

@Form.create()
@connect(mapStateToProps)
class Post extends PureComponent {
  constructor(props) {
    super(props)

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
  }
  handleSubmit = (status) => {
    const data = this.props.form.getFieldsValue();
    data.post_status = status;
    data.post_author = '5bcc93b8f6ca8315941b5aaf';
    this.props.dispatch({
      type: 'posts/create',
      payload: data,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const currentItem = this.props.posts.currentItem;
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
            </div>
          </div>
        </Form>
      </Card>
    )
  }
}

export default Post;
