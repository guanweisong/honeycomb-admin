import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ChartItem from './components/chartItem';
import { PostType, PostTypeName } from '@/pages/post/types/PostType';
import { CommentStatus, CommentStatusName } from '@/pages/comment/types/CommentStatus';
import { UserLevel, UserLevelName } from '@/pages/user/types/UserLevel';
import type { StatisticsType } from '@/pages/dashboard/types/StatisticsType';
import * as statisticsService from '@/pages/dashboard/service';

const Dashboard = () => {
  const [statistics, setStatistics] = useState<StatisticsType>();

  const index = async () => {
    const result = await statisticsService.index();
    if (result.status === 200) {
      setStatistics(result.data);
    }
  };

  useEffect(() => {
    index();
  }, []);

  console.log(
    statistics?.postType?.map((n) => ({
      ...n,
      item: PostTypeName[PostType[n.item] as keyof typeof PostTypeName] as string,
    })),
  );

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <ChartItem
              data={statistics?.postType?.map((n) => ({
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
              data={statistics?.commentStatus?.map((n) => ({
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
              data={statistics?.userType?.map((n) => ({
                ...n,
                item: UserLevelName[UserLevel[n.item] as keyof typeof UserLevelName] as string,
              }))}
              title="用户"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <ChartItem data={statistics?.userPost} title="贡献" />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
