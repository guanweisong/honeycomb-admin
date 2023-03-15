import { useState, useRef } from 'react';
import { Tag, Button, Input, AutoComplete, Form } from 'antd';
import type { DataSourceItemObject } from 'antd/es/auto-complete';
import { index } from '@/pages/tag/service';
import Block from '@/pages/post/edit/components/Block';
import type { PostEntity } from '@/pages/post/types/post.entity';
import type { TagEntity } from '@/pages/tag/types/tag.entity';

const FormItem = Form.Item;

export interface MultiTagProps {
  name: 'galleryStyle' | 'movieDirector' | 'movieActor' | 'movieStyle';
  detail: PostEntity;
  title: string;
  onAddTag: (
    name: 'galleryStyle' | 'movieDirector' | 'movieActor' | 'movieStyle',
    value: string,
  ) => void;
  onTagsChange: (
    name: 'movieActor' | 'movieDirector' | 'movieStyle' | 'galleryStyle',
    tags: Omit<TagEntity, 'updatedAt' | 'createdAt'>[],
  ) => void;
}

const MultiTag = (props: MultiTagProps) => {
  const { name, detail, title, onTagsChange, onAddTag } = props;

  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [data, setData] = useState<DataSourceItemObject[]>([]);
  const timeout = useRef<any>();

  /**
   * 获取tag列表
   */
  const getTags = () => {
    return (detail[name] as Omit<TagEntity, 'updatedAt' | 'createdAt'>[]) || [];
  };

  /**
   * 删除已选Tag
   * @param removedTag
   */
  const handleClose = (removedTag: string) => {
    console.log('handleClose', removedTag);
    const tags = getTags().filter((tag) => tag.id !== removedTag);
    onTagsChange(name, tags);
  };

  /**
   * 显示tag输入框函数
   */
  const showInput = () => {
    setInputVisible(true);
  };

  const handleUpdateTags = (tag: Omit<TagEntity, 'updatedAt' | 'createdAt'>) => {
    console.log('handleUpdateTags', tag);
    const tags = getTags();
    if (tags.some((item) => item.id === tag.id)) {
      return;
    }
    onTagsChange(props.name, [...tags, tag]);
  };

  /**
   * tag选中事件
   * @param value
   * @param option
   */
  const handleInputConfirm = (value: string, option: any) => {
    console.log('handleInputConfirm', value, option.props.children);
    handleUpdateTags({ id: value, name: option.props.children });
    setInputVisible(false);
  };

  /**
   * tag输入框失焦事件
   * @param e
   */
  const handleBlur = (e: any) => {
    const { value } = e.target;
    console.log('handleBlur', value);
    if (value === '' || value.length === 0) {
      setInputVisible(false);
      return;
    }

    let has = false;
    data.forEach((item) => {
      if (item.text === value) {
        has = true;
      }
    });
    if (!has) {
      onAddTag(name, value);
    } else {
      const obj = data.find((item) => item.text === value) as DataSourceItemObject;
      handleUpdateTags({ id: obj.value, name: obj.text });
    }
    setInputVisible(false);
  };

  /**
   * 联想搜索tag列表
   * @param value
   * @param callback
   */
  const fetchTagsList = (value: string, callback: (items: DataSourceItemObject[]) => void) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
    const fake = async () => {
      const result = await index({ name: value });
      const items: DataSourceItemObject[] = [];
      console.log(result.data.list);
      result.data.list.forEach((r) => {
        items.push({
          value: r.id,
          text: r.name,
        });
      });
      callback(items);
    };
    timeout.current = setTimeout(fake, 300);
  };

  /**
   * tag输入框输入事件
   * @param value
   */
  const handleChange = (value: string) => {
    fetchTagsList(value, (items: DataSourceItemObject[]) => setData(items));
  };

  return (
    <Block title={title}>
      <FormItem style={{ display: 'none' }} name={props.name}>
        <Input type="text" />
      </FormItem>
      {getTags().map((tag) => {
        const tagElem = (
          <Tag key={tag.id} closable onClose={() => handleClose(tag.id)}>
            {tag.name}
          </Tag>
        );
        return tagElem;
      })}
      {inputVisible && (
        <AutoComplete
          autoFocus
          filterOption={false}
          size="small"
          style={{ width: 78 }}
          dataSource={data}
          onSelect={handleInputConfirm}
          onSearch={handleChange}
          onBlur={handleBlur}
        />
      )}
      {!inputVisible && (
        <Button size="small" type="dashed" onClick={showInput}>
          + 添加
        </Button>
      )}
    </Block>
  );
};

export default MultiTag;
