import React, { PureComponent } from 'react';
import { Tag, Button, Select, Form, Input, AutoComplete } from 'antd';
import { index } from '../../../../tag/service';

const FormItem = Form.Item;
const Option = Select.Option;

class MultiTag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputVisible: false,
      data: [],
    };
    this.const = {
      timeout: null,
    }
  }
  getTags = () => {
    return this.props.currentItem[this.props.name] || [];
  };
  handleClose = (removedTag) => {
    console.log('handleClose', removedTag);
    const tags = this.getTags().filter(tag => tag._id !== removedTag);
    this.props.onTagsChange(this.props.name, tags);
  };
  showInput = () => {
    this.handleInputVisibleState(true);
  };
  handleChange = (value) => {
    this.setState({ value });
    this.fetchTagsList(value, data => this.setState({ data }));
  };
  handleInputConfirm = (value, option) => {
    console.log('handleInputConfirm', value, option.props.children);
    this.handleUpdateTags({_id: value, tag_name: option.props.children});
    this.handleInputVisibleState(false);
  };
  handleBlur = (value) => {
    console.log('handleBlur', value);
    if (typeof value === 'undefined') {
      this.handleInputVisibleState(false);
      return;
    }
    if (value.length === 0) {
      return;
    }
    this.props.onAddTag(this.props.name, value);
    this.handleInputVisibleState(false);
  };
  handleUpdateTags = (tag) => {
    console.log('handleUpdateTags', tag);
    let tags = this.getTags();
    if (tags.some((item) => item._id === tag._id)) {
      return;
    }
    this.props.onTagsChange(this.props.name, [...tags, tag]);
  };
  handleInputVisibleState = (state) => {
    this.setState({
      inputVisible: state
    });
  };
  fetchTagsList = (value, callback) => {
    if (this.const.timeout) {
      clearTimeout(this.const.timeout);
      this.const.timeout = null;
    }
    const fake = async () => {
      const result = await index({keyword: value});
      const data = [];
      console.log(result.data.list);
      result.data.list.forEach((r) => {
        data.push({
          value: r._id,
          text: r.tag_name,
        });
      });
      callback(data);
    };
    this.const.timeout = setTimeout(fake, 300);
  };
  getHiddenInputValue = () => {
    let ids = [];
    this.props.currentItem[this.props.name].forEach((item) => {
      ids.push(item._id);
    });
    return ids.join(',');
  };
  render() {
    const {inputVisible} = this.state;
    const { styles } = this.props;
    return (
      <dl className={styles.block}>
        <dt className={styles.blockTitle}>{this.props.title}</dt>
        <dd className={styles.blockContent}>
          <FormItem style={{display: 'none'}}>
            {this.props.form.getFieldDecorator(this.props.name, {
              initialValue: this.getHiddenInputValue(),
            })(
              <Input type="text"/>
            )}
          </FormItem>
          {this.getTags().map((tag) => {
            const tagElem = (
              <Tag key={tag._id} closable={true} afterClose={() => this.handleClose(tag._id)}>
                {tag.tag_name}
              </Tag>
            );
            return tagElem;
          })}
          {inputVisible && (
            <AutoComplete
              autoFocus = {true}
              filterOption = {false}
              size = "small"
              style = {{width: 78}}
              dataSource={this.state.data}
              onSelect = {this.handleInputConfirm}
              onChange = {this.handleChange}
              onBlur={this.handleBlur}
            />
          )}
          {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 添加</Button>}
        </dd>
      </dl>
    )
  }
}

export default MultiTag;
