import { message } from 'antd'
import * as mediaService from '@/services/media'
import { createModel } from 'hox'
import { useState } from 'react'

function UseMedia() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentItem, setCurrentItem] = useState({})
  const [tab, setTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const index = async (values) => {
    console.log('media=>model=>index', values)
    const result = await mediaService.index(values)
    if (result.status === 200) {
      setList(result.data.list)
      setTotal(result.data.total)
    }
  }

  const distory = async (id) => {
    console.log('media=>model=>distory', id)
    const result = await mediaService.distory(id)
    if (result.status === 204) {
      index()
      setCurrentItem({})
      message.success('删除成功')
    }
  }

  const update = async (id, values) => {
    console.log('media=>model=>update', id, values)
    const result = await mediaService.update(id, values)
    if (result.status === 201) {
      index()
      message.success('更新成功')
    }
  }

  const create = async (values) => {
    console.log('media=>model=>create', values)
    const result = await mediaService.create(values)
    if (result.status === 201) {
      index()
      message.success('添加成功')
    }
  }

  return {
    list,
    total,
    currentItem,
    setCurrentItem,
    tab,
    setTab,
    showModal,
    setShowModal,
    loading,
    setLoading,
    index,
    distory,
    update,
    create,
  }
}

export default createModel(UseMedia)
