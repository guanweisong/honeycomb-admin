import React, { useLayoutEffect } from 'react';
import { Layout, Menu, Button, BackTop } from 'antd';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import moment from 'moment';
import { StringParam, useQueryParams } from 'use-query-params';
import { LogoutOutlined } from '@ant-design/icons';
import { If } from 'tsx-control-statements/components';
import { Link, useLocation, history } from 'umi';
import menuData, { MenuItem } from '@/utils/menu';
import Breadcrumbs from '@/components/Breadcrumbs';
import useAppModel from '@/models/app';
import styles from './index.less';
import Loader from '@/components/Loader';
import useSettingsModel from '@/pages/setting/model';
import { UserLevelName, UserLevel } from '@/pages/user/types/UserLevel';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const ContentLayout: React.FC = (props) => {
  const location = useLocation();
  const appModel = useAppModel();
  const settingsModal = useSettingsModel();
  const { user, logout, verify } = appModel;
  const { setting, querySetting } = settingsModal;

  const [query] = useQueryParams({
    targetUrl: StringParam,
  });

  const { targetUrl } = query;

  useLayoutEffect(() => {
    verify();
  }, []);

  useLayoutEffect(() => {
    if (location.pathname !== '/login' && !user?._id) {
      history.replace(
        `/login?targetUrl=${encodeURIComponent(location.pathname + location.search)}`,
      );
    }
    if (location.pathname === '/login' && user?._id && targetUrl) {
      history.replace(targetUrl);
    }
  }, [user]);

  useLayoutEffect(() => {
    if (location.pathname !== '/login') {
      querySetting();
      appModel.verify();
    }
  }, [location.pathname]);

  if (user === undefined) {
    return <Loader />;
  }

  if (location.pathname === '/login') {
    return <Layout>{props.children}</Layout>;
  }

  const renderMenuItem = (item: MenuItem) => {
    return (
      <If condition={!item.roleAuthority || item.roleAuthority.includes(user.user_level)}>
        <Menu.Item key={item.key}>
          <Link to={item.link}>
            <If condition={item.icon}>{item.icon}&nbsp;</If>
            {item.label}
          </Link>
        </Menu.Item>
      </If>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        mode="inline"
        style={{ borderRight: 'none' }}
        selectedKeys={[
          location.pathname.substring(1) ? location.pathname.substring(1) : 'dashboard',
        ]}
        defaultOpenKeys={[location.pathname.substring(1).split('/')[0]]}
      >
        {menuData.map((item) => {
          if (item.child) {
            return (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    {item.icon}&nbsp;{item.label}
                  </span>
                }
              >
                {item.child.map((subItem) => {
                  return renderMenuItem(subItem);
                })}
              </SubMenu>
            );
          }
          return renderMenuItem(item);
        })}
      </Menu>
    );
  };

  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <Layout style={{ minHeight: '100%' }}>
        <Sider theme="light" className={styles.sideBar}>
          <div className={styles.logo}>{setting?.site_name}</div>
          {renderMenu()}
        </Sider>
        <Content>
          <Layout>
            <Header className={styles.topBar}>
              <Button
                style={{
                  float: 'right',
                  marginTop: '15px',
                }}
                onClick={logout}
              >
                <LogoutOutlined />
                退出
              </Button>
              欢迎回来：{user.user_name}&ensp; 级别：
              {UserLevelName[UserLevel[user.user_level] as keyof typeof UserLevelName]}
            </Header>
            <div className={styles.breadcrumb}>
              <Breadcrumbs />
            </div>
            <Content className={styles.content} style={{ position: 'relative', zIndex: 10 }}>
              {props.children}
            </Content>
            <Footer className={styles.footer}>
              <div>{setting?.site_signature}</div>
              <div>
                ©{moment().format('YYYY')}&nbsp;{setting?.site_copyright}
              </div>
            </Footer>
            <BackTop />
          </Layout>
        </Content>
      </Layout>
    </QueryParamProvider>
  );
};

export default ContentLayout;
