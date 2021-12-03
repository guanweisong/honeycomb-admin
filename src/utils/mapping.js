import React from 'react'
import { Tag } from 'antd'

export const userLevelMap = [
  {
    text: '管理员',
    value: 1,
  },
  {
    text: '编辑',
    value: 2,
  },
  {
    text: '访客',
    value: 3,
  },
]

export const postStatusMap = [
  {
    text: '已发布',
    value: 0,
  },
  {
    text: '草稿',
    value: 1,
  },
  {
    text: '待审核',
    value: 2,
  },
]

export const enableStatusMap = [
  {
    text: '禁用',
    tag: <Tag color="gray">禁用</Tag>,
    value: 0,
  },
  {
    text: '启用',
    tag: <Tag color="blue">启用</Tag>,
    value: 1,
  },
  {
    text: '已删除',
    tag: <Tag color="lightgray">已删除</Tag>,
    value: -1,
  },
]

export const postTypeMap = [
  {
    text: '普通',
    value: 0,
  },
  {
    text: '电影',
    value: 1,
  },
  {
    text: '画廊',
    value: 2,
  },
  {
    text: '引用',
    value: 3,
  },
]

export const commentStatusMap = [
  {
    text: '待审核',
    value: 0,
  },
  {
    text: '已发布',
    value: 1,
  },
  {
    text: '垃圾评论',
    value: 2,
  },
  {
    text: '已屏蔽',
    value: 3,
  },
]

export const menuTypeMap = {
  0: '分类',
  1: '页面',
}
