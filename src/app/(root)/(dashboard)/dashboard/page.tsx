'use client';

import {
  CommentStatus,
  CommentStatusName,
} from '@/app/(root)/(dashboard)/comment/types/CommentStatus';
import { PostType, PostTypeName } from '@/app/(root)/(dashboard)/post/types/PostType';
import { UserLevel, UserLevelName } from '@/app/(root)/(dashboard)/user/types/UserLevel';
import { PieConfig } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Space } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import DashboardService from './service';
import type { StatisticsType } from './types/StatisticsType';

const Pie = dynamic(() => import('@ant-design/charts').then((mod) => mod.Pie) as any, {
  ssr: false,
});

const Dashboard = () => {
  const [statistics, setStatistics] = useState<StatisticsType>();

  const index = async () => {
    const result = await DashboardService.index();
    if (result.status === 200) {
      setStatistics(result.data);
    }
  };

  useEffect(() => {
    index();
  }, []);

  const defaultConfig: PieConfig = {
    data: [],
    width: 250,
    height: 250,
    angleField: 'count',
    colorField: 'item',
    radius: 1,
    innerRadius: 0.64,
  };

  return (
    <PageContainer>
      <Space>
        <div className="w-80 h-80">
          <Card>
            <Pie
              {...defaultConfig}
              // @ts-ignore
              data={
                statistics?.postType?.map((n) => ({
                  ...n,
                  item: PostTypeName[PostType[n.item] as keyof typeof PostTypeName] as string,
                })) ?? []
              }
              statistic={{
                title: {
                  content: '文章',
                  style: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Card>
        </div>
        <div className="w-80 h-80">
          <Card>
            <Pie
              {...defaultConfig}
              // @ts-ignore
              data={
                statistics?.commentStatus?.map((n) => ({
                  ...n,
                  item: CommentStatusName[
                    CommentStatus[n.item] as keyof typeof CommentStatusName
                  ] as string,
                })) ?? []
              }
              statistic={{
                title: {
                  content: '评论',
                  style: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Card>
        </div>
        <div className="w-80 h-80">
          <Card>
            <Pie
              {...defaultConfig}
              // @ts-ignore
              data={
                statistics?.userType?.map((n) => ({
                  ...n,
                  item: UserLevelName[UserLevel[n.item] as keyof typeof UserLevelName] as string,
                })) ?? []
              }
              statistic={{
                title: {
                  content: '用户',
                  style: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Card>
        </div>
        <div className="w-80 h-80">
          <Card>
            <Pie
              {...defaultConfig}
              // @ts-ignore
              data={statistics?.userPost ?? []}
              statistic={{
                title: {
                  content: '贡献',
                  style: {
                    fontSize: '16px',
                  },
                },
              }}
            />
          </Card>
        </div>
      </Space>
    </PageContainer>
  );
};

export default Dashboard;
