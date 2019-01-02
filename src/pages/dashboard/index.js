import React, { PureComponent } from 'react';
import { Row, Col, Card } from 'antd';

export default class Dashboard extends PureComponent {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Row gutter={24}>
        <Col span={6} >
          <Card>1</Card>
        </Col>
        <Col span={6} >
          <Card>1</Card>
        </Col>
        <Col span={6} >
          <Card>1</Card>
        </Col>
        <Col span={6} >
          <Card>1</Card>
        </Col>
      </Row>
    )
  }
}
