import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'
import * as usersService from './service'

function UseUser() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentItem, setCurrentItem] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(0) // 0:增加,1:修改
  const [loading, setLoading] = useState(false)

  const index = async (values) => {
    console.log('users=>model=>index', values)
    setLoading(true)
    const result = await usersService.index(values)
    if (result.status === 200) {
      setList(result.data.list)
      setTotal(result.data.total)
    }
    setLoading(false)
  }

  const distory = async (id) => {
    console.log('users=>model=>distory', id)
    const result = await usersService.distory(id)
    if (result.status === 204) {
      index()
      message.success('删除成功')
    }
  }

  const update = async (id, values) => {
    console.log('users=>model=>update', id, values)
    const result = await usersService.update(id, values)
    if (result.status === 201) {
      index()
      message.success('更新成功')
    }
  }

  const create = async (values) => {
    console.log('users=>model=>create', values)
    const result = await usersService.create(values)
    if (result.status === 201) {
      index()
      message.success('添加成功')
    }
  }

  const checkExist = async (values) => {
    console.log('users=>model=>checkExist', values)
    let exist = false
    const result = await usersService.index(values)
    const currentId = currentItem._id
    if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
      exist = true
    }
    return exist
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
    distory,
    update,
    create,
    checkExist,
  }
}

export default createModel(UseUser)
