import React, { PureComponent } from 'react';
import { Button, Icon, Form, Input } from 'antd';

const FormItem = Form.Item;

class PhotoPickerItem extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { styles, currentItem, name, title, size } = this.props;
    return (
      <dl className={styles.block}>
        <dt className={styles.blockTitle}>{title}<span className={styles.blockTitleTip}>（尺寸：{size}）</span></dt>
        <dd className={styles.blockContent}>
          <FormItem style={{display: 'none'}}>
            {this.props.form.getFieldDecorator(name, {
              initialValue: currentItem[name]._id || '',
            })(
              <Input type="text"/>
            )}
          </FormItem>
          <Choose>
            <When condition={currentItem[name]._id}>
              <div className={styles.coverWrap}>
                <img src={`//${currentItem[name].media_url}`}/>
              </div>
              <Button onClick={() => this.props.handlePhotoClear(name)} className={styles.rightButton}>
                <Icon type="delete"/>清除图片
              </Button>
              <Button onClick={() => this.props.openPhotoPicker(name)} ><Icon type="upload"/>重新上传</Button>
            </When>
            <Otherwise>
              <Button onClick={() => this.props.openPhotoPicker(name)}><Icon type="upload"/>点击上传</Button>
            </Otherwise>
          </Choose>
        </dd>
      </dl>
    )
  }
}

export default PhotoPickerItem;
