import React, { PureComponent } from 'react';
import { Tag, Button, Select } from 'antd';
import { index } from '../../../../tag/service';

let timeout;
let currentValue;
function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  function fake() {
    index({tag_name: value})
      .then((result)=>{
        if (currentValue === value){
          const data = [];
          console.log(result.data.list);
          result.data.list.forEach((r) => {
            data.push({
              value: r._id,
              text: r.tag_name,
            });
          });
          callback(data);
        }
      });
  }
  timeout = setTimeout(fake, 300);
}

class MultiTag extends PureComponent {
  state = {
    inputVisible: false,
    data: [],
    value: '',
  };
  getTags = () => {
    return this.props.currentItem[this.props.name] && this.props.currentItem[this.props.name].value || [];
  };
  handleClose = (removedTag) => {
    const tags = this.getTags().filter(tag => tag !== removedTag);
    this.props.onTagsChange(this.props.name, tags);
  };
  showInput = () => {
    this.handleInputVisibleState(true);
  };
  handleChange = (value) => {
    this.setState({ value });
    fetch(value, data => this.setState({ data }));
  };
  handleInputConfirm = (value) => {
    console.log(value);
    this.handleUpdateTags(value);
    this.handleInputVisibleState(false);
  };
  handleUpdateTags = (value) => {
    let tags = this.getTags();
    if (value && tags.indexOf(value) === -1) {
      this.props.onAddTag(value);
      tags = [...tags, value];
    }
    this.props.onTagsChange(this.props.name, tags);
  };
  handleInputVisibleState = (state) => {
    this.setState({
      inputVisible: state
    });
  };
  render() {
    const {inputVisible} = this.state;
    const options = this.state.data.map(d => <Option key={d.text}>{d.text}</Option>);
    return (
      <div>
        {this.getTags().map((tag, index) => {
          console.log('tag', tag);
          const tagElem = (
            <Tag key={tag._id} closable={true} afterClose={() => this.handleClose(tag._id)}>
              {tag.tag_name}
            </Tag>
          );
          return tagElem;
        })}
        {inputVisible && (
          <Select
            mode = "combobox"
            autoFocus = {true}
            showArrow = {false}
            filterOption = {false}
            value = {this.state.value}
            size = "small"
            style = {{width: 78}}
            onBlur = {this.handleInputConfirm}
            onSelect = {this.handleInputConfirm}
            onChange = {this.handleChange}
          >
            {options}
          </Select>
        )}
        {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 添加</Button>}
      </div>
    )
  }
}

export default MultiTag;
