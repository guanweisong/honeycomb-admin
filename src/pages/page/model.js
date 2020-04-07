import { message } from 'antd'
import { history } from 'umi'
import { createModel } from 'hox'
import { useState } from 'react'
import * as pagesService from './service'

function UsePage() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentItem, setCurrentItem] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(0) // 0:增加,1:修改
  const [loading, setLoading] = useState(false)

  const index = async (values) => {
    console.log('pages=>model=>index', values)
    setLoading(true)
    const result = await pagesService.index(values)
    if (result.status === 200) {
      setList(result.data.list)
      setTotal(result.data.total)
    }
    setLoading(false)
  }

  const detail = async (values) => {
    console.log('pages=>model=>detial', values)
    let result
    if (typeof values._id !== 'undefined') {
      result = await pagesService.index(values)
      // eslint-disable-next-line prefer-destructuring
      result = result.data.list[0]
    } else {
      result = {}
    }
    setCurrentItem(result)
  }

  const distory = async (id) => {
    console.log('pages=>model=>distory', id)
    const result = await pagesService.distory(id)
    if (result && result.status === 204) {
      index()
      message.success('删除成功')
    }
  }

  const update = async (id, values) => {
    console.log('pages=>model=>update', id, values)
    const result = await pagesService.update(id, values)
    if (result && result.status === 201) {
      message.success('更新成功')
      detail({ _id: id })
    }
  }

  const create = async (values) => {
    console.log('pages=>model=>create', values)
    const result = await pagesService.create(values)
    if (result && result.status === 201) {
      message.success('添加成功')
      history.push({
        pathname: '/page/edit',
        query: {
          _id: result.data._id,
        },
      })
    }
  }

  return {
    list,
    total,
    currentItem,
    setCurrentItem,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    loading,
    index,
    detail,
    distory,
    update,
    create,
  }
}

export default createModel(UsePage)
