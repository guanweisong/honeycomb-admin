import React, { useState } from 'react'
import { Tag, Button, Input, AutoComplete, Form } from 'antd'
import { index } from '../../../../tag/service'

const FormItem = Form.Item

const MultiTag = (props) => {
  const [inputVisible, setInputVisible] = useState(false)
  const [data, setData] = useState([])

  let timeout = null

  const getTags = () => {
    return props.detail[props.name] || []
  }

  const handleClose = (removedTag) => {
    console.log('handleClose', removedTag)
    const tags = getTags().filter((tag) => tag._id !== removedTag)
    props.onTagsChange(props.name, tags)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleUpdateTags = (tag) => {
    console.log('handleUpdateTags', tag)
    const tags = getTags()
    if (tags.some((item) => item._id === tag._id)) {
      return
    }
    props.onTagsChange(props.name, [...tags, tag])
  }

  const handleInputConfirm = (value, option) => {
    console.log('handleInputConfirm', value, option.props.children)
    handleUpdateTags({ _id: value, tag_name: option.props.children })
    setInputVisible(false)
  }

  const handleBlur = (e) => {
    const { value } = e.target
    console.log('handleBlur', value)
    if (value === '' || value.length === 0) {
      setInputVisible(false)
      return
    }

    let has = false
    data.forEach((item) => {
      if (item.text === value) {
        has = true
      }
    })

    if (!has) {
      props.onAddTag(props.name, value)
    } else {
      handleUpdateTags(data.find((item) => item.text === value))
    }

    setInputVisible(false)
  }

  const fetchTagsList = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    const fake = async () => {
      const result = await index({ keyword: value })
      const items = []
      console.log(result.data.list)
      result.data.list.forEach((r) => {
        items.push({
          value: r._id,
          text: r.tag_name,
        })
      })
      callback(items)
    }
    timeout = setTimeout(fake, 300)
  }

  const handleChange = (value) => {
    fetchTagsList(value, (items) => setData(items))
  }

  const { styles } = props

  return (
    <dl className={styles.block}>
      <dt className={styles.blockTitle}>{props.title}</dt>
      <dd className={styles.blockContent}>
        <FormItem style={{ display: 'none' }} name={props.name}>
          <Input type="text" />
        </FormItem>
        {getTags().map((tag) => {
          const tagElem = (
            <Tag key={tag._id} closable onClose={() => handleClose(tag._id)}>
              {tag.tag_name}
            </Tag>
          )
          return tagElem
        })}
        {inputVisible && (
          <AutoComplete
            autoFocus
            filterOption={false}
            size="small"
            style={{ width: 78 }}
            dataSource={data}
            onSelect={handleInputConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
        {!inputVisible && (
          <Button size="small" type="dashed" onClick={showInput}>
            + 添加
          </Button>
        )}
      </dd>
    </dl>
  )
}

export default MultiTag
