import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import ChartItem from './components/chartItem';
import { postTypeMap, commentStatusMap, userLevelMap } from '@/utils/mapping';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Dashboard extends PureComponent {
  constructor(props){
    super(props);
  }
  getItem = (data = [], mapping) => {
    return data.map(n => {
      return { ...n, item: mapping.find(m => m.value === n.item).text }
    });
  }
  getTotal = (data = []) => {
    let num = 0;
    data.forEach(item => {
      num += item.count;
    })
    return num;
  }
  render() {
    return (
      <Row gutter={24} style={{ height: '100px' }}>
        <Col span={6} >
          <Card>
            <ChartItem data={this.getItem(this.props.statistics.post, postTypeMap)} title="文章" total={this.getTotal(this.props.statistics.post)}/>
          </Card>
        </Col>
        <Col span={6} >
          <Card>
            <ChartItem data={this.getItem(this.props.statistics.comment, commentStatusMap)} title="评论" total={this.getTotal(this.props.statistics.comment)}/>
          </Card>
        </Col>
        <Col span={6} >
          <Card>
            <ChartItem data={this.getItem(this.props.statistics.user, userLevelMap)} title="用户" total={this.getTotal(this.props.statistics.user)}/>
          </Card>
        </Col>
        <Col span={6} >
          <Card>1</Card>
        </Col>
      </Row>
    )
  }
}

export default Dashboard;
