import React, { useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import ChartItem from './components/chartItem';
import useStatisticsModel from './model';
import { PostType, PostTypeName } from '@/pages/post/types/PostType';
import { CommentStatus, CommentStatusName } from '@/pages/comment/types/CommentStatus';
import { UserLevel, UserLevelName } from '@/pages/user/types/UserLevel';

const Dashboard = () => {
  const statisticsModel = useStatisticsModel();

  useEffect(() => {
    statisticsModel.index();
  }, []);

  return (
    <Row gutter={24}>
      <Col span={6}>
        <Card>
          <ChartItem
            data={statisticsModel.statistics?.postType?.map((n) => ({
              ...n,
              item: PostTypeName[PostType[n.item] as keyof typeof PostTypeName] as string,
            }))}
            title="文章"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem
            data={statisticsModel.statistics?.commentStatus?.map((n) => ({
              ...n,
              item: CommentStatusName[
                CommentStatus[n.item] as keyof typeof CommentStatusName
              ] as string,
            }))}
            title="评论"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem
            data={statisticsModel.statistics?.userType?.map((n) => ({
              ...n,
              item: UserLevelName[UserLevel[n.item] as keyof typeof UserLevelName] as string,
            }))}
            title="用户"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <ChartItem data={statisticsModel.statistics?.userPost} title="贡献" />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
