import React, { useEffect } from 'react'
import { Row, Col, Card } from 'antd'
import ChartItem from './components/chartItem'
import { postTypeMap, commentStatusMap, userLevelMap } from '@/utils/mapping'
import useStatisticsModel from './model'

const Dashboard = () => {
  const statisticsModel = useStatisticsModel()

  useEffect(() => {
    statisticsModel.index()
  }, [])

  const getItem = (data = [], mapping) => {
    return data.map((n) => {
      return { ...n, item: mapping.find((m) => m.value === n.item).text }
    })
  }

  const getTotal = (data = []) => {
    let num = 0
    data.forEach((item) => {
      num += item.count
    })
    return num
  }

  return (
    <Row gutter={24}>
      <Col span={6}>
        <Card>
          <ChartItem
            data={getItem(statisticsModel.statistics.postType, postTypeMap)}
            title="文章"
            total={getTotal(statisticsModel.statistics.postType)}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem
            data={getItem(statisticsModel.statistics.commentStutas, commentStatusMap)}
            title="评论"
            total={getTotal(statisticsModel.statistics.commentStutas)}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem
            data={getItem(statisticsModel.statistics.userType, userLevelMap)}
            title="用户"
            total={getTotal(statisticsModel.statistics.userType)}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem
            data={statisticsModel.statistics.userPost}
            title="贡献"
            total={getTotal(statisticsModel.statistics.userPost)}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
