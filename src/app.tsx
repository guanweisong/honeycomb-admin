import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import { GithubOutlined, IeOutlined } from '@ant-design/icons';
import * as CommonService from '@/services/common';
import * as SettingService from '@/pages/setting/service';
import type { UserEntity } from '@/pages/user/types/user.entity';
import type { SettingEntity } from '@/pages/setting/types/setting.entity';

const loginPath = '/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  userInfo?: UserEntity | undefined;
  setting?: SettingEntity | undefined;
}> {
  const userInfo = await CommonService.queryUser();
  if (!userInfo.data) {
    history.push(loginPath);
  }
  const settingInfo = await SettingService.querySetting();
  return {
    userInfo: userInfo.data,
    setting: settingInfo.data?.[0],
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.userInfo?.user_name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.userInfo && location.pathname !== loginPath) {
        history.push(loginPath);
      } else if (initialState?.userInfo && location.pathname === loginPath) {
        history.push('/');
      }
    },
    links: [
      <a key={'fontSite'} href="https://guanweisong.com" target={'_blank'} rel="noreferrer">
        <IeOutlined />
        <span>博客前台</span>
      </a>,
      <a key={'github'} href="https://github.com/guanweisong" target={'_blank'} rel="noreferrer">
        <GithubOutlined />
        <span>作者Github</span>
      </a>,
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      // @ts-ignore
      return <QueryParamProvider ReactRouterRoute={Route}>{children}</QueryParamProvider>;
    },
  };
};
