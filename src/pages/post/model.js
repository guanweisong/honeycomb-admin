import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'
import { history } from 'umi'
import moment from 'moment'
import useMediaModel from '@/models/media'
import * as postsService from './service'
import * as tagsService from '../tag/service'

const showdown = require('showdown')

const converter = new showdown.Converter()

function UsePost() {
  const mediaModel = useMediaModel()

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(0) // 0:增加,1:修改
  const [loading, setLoading] = useState(false)
  const [showPhotoPicker, setShowPhotoPicker] = useState('')
  const [detail, setDetail] = useState({
    gallery_style: [],
    movie_director: [],
    movie_actor: [],
    movie_style: [],
    post_cover: {},
    post_type: 0,
    post_category: '',
  })

  const resetDetail = () => {
    setDetail({
      gallery_style: [],
      movie_director: [],
      movie_actor: [],
      movie_style: [],
      post_cover: {},
      post_type: 0,
      post_category: '',
    })
  }

  const index = async (values) => {
    console.log('post=>model=>index', values)
    setLoading(true)
    const result = await postsService.indexPostList(values)
    if (result.status === 200) {
      setList(result.data.list)
      setTotal(result.data.total)
    }
    setLoading(false)
  }

  const indexDetail = async (values) => {
    console.log('post=>model=>detial', values)
    let result
    if (typeof values._id !== 'undefined') {
      result = await postsService.indexPostDetail(values)
      result = result.data
      if (result.movie_time) {
        result.movie_time = moment(result.movie_time)
      }
      if (result.gallery_time) {
        result.gallery_time = moment(result.movie_time)
      }
      if (result.post_content) {
        result.post_content = converter.makeMd(result.post_content)
      }
      result.post_category = result.post_category ? result.post_category._id : ''
      result.post_type = result.post_type ? result.post_type : 0
      result.post_cover = result.post_cover ? result.post_cover : {}
      setDetail(result)
    }
  }

  const distory = async (id) => {
    console.log('post=>model=>distory', id)
    const result = await postsService.distory(id)
    if (result.status === 204) {
      index()
      message.success('删除成功')
    }
  }

  const update = async (id, values) => {
    console.log('post=>model=>update', id, values)
    const result = await postsService.update(id, values)
    if (result.status === 201) {
      message.success('更新成功')
      indexDetail({ _id: id })
    }
  }

  const create = async (values) => {
    console.log('post=>model=>create', values)
    const result = await postsService.create(values)
    if (result.status === 201) {
      message.success('添加成功')
      history.push({
        pathname: '/post/edit',
        query: {
          _id: result.data._id,
        },
      })
    }
  }

  const createTag = async (name, tag_name) => {
    console.log('posts=>model=>createTag', name, tag_name)
    const result = await tagsService.create({ tag_name })
    if (result && result.status === 201) {
      setDetail({
        ...detail,
        [name]: [...detail[name], { _id: result.data._id, tag_name: result.data.tag_name }],
      })
    }
  }

  const updateTag = (name, tags) => {
    setDetail({
      ...detail,
      [name]: tags,
    })
  }

  const addPhoto = () => {
    setDetail({ ...detail, [showPhotoPicker]: mediaModel.currentItem })
  }

  return {
    list,
    total,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    loading,
    showPhotoPicker,
    setShowPhotoPicker,
    detail,
    setDetail,
    resetDetail,
    index,
    indexDetail,
    distory,
    update,
    create,
    createTag,
    updateTag,
    addPhoto,
  }
}

export default createModel(UsePost)
