import { message } from 'antd'
import * as categoryService from '@/services/category'
import { createModel } from 'hox'
import { useState } from 'react'

function UseCategory() {
  const [list, setList] = useState([])
  const [currentItem, setCurrentItem] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(0) // 0:增加,1:修改

  const index = async (values) => {
    console.log('category=>model=>index', values)
    const result = await categoryService.index(values)
    if (result.status === 200) {
      setList(result.data.list)
    }
  }

  const distory = async (id) => {
    console.log('category=>model=>distory', id)
    const result = await categoryService.distory(id)
    if (result.status === 204) {
      index()
      message.success('删除成功')
    }
  }

  const update = async (id, values) => {
    console.log('category=>model=>update', id, values)
    const result = await categoryService.update(id, values)
    if (result.status === 201) {
      index()
      message.success('更新成功')
    }
  }

  const create = async (values) => {
    console.log('category=>model=>create', values)
    const result = await categoryService.create(values)
    if (result.status === 201) {
      index()
      message.success('添加成功')
    }
  }

  const checkExist = async (values) => {
    console.log('category=>model=>checkExist', values)
    let exist = false
    const result = await categoryService.index(values)
    const currentId = currentItem._id
    if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
      exist = true
    }
    return exist
  }

  return {
    list,
    currentItem,
    setCurrentItem,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    index,
    distory,
    update,
    create,
    checkExist,
  }
}

export default createModel(UseCategory)
