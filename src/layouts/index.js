import React, { useEffect } from 'react'
import { Layout, Menu, Button } from 'antd'
import moment from 'moment'
import { LogoutOutlined } from '@ant-design/icons'
import { Link, useLocation, history } from 'umi'
import menuData from '@/utils/menu'
import Breakcrumbs from '@/components/Breakcrumbs'
import { userLevelMap } from '@/utils/mapping'
import useAppModel from '../models/app'
import styles from './index.less'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

const BasicLayout = (props) => {
  const location = useLocation()
  const appModel = useAppModel()
  const { user, setting, logout, querySetting, verify } = appModel

  useEffect(() => {
    querySetting()
    verify()
  }, [])

  useEffect(() => {
    if (location.pathname !== '/login' && !user._id) {
      history.replace(`/login?targetUrl=${encodeURIComponent(location.pathname + location.search)}`)
    }
    if (location.pathname === '/login' && user._id) {
      history.replace(location.query.targetUrl)
    }
  }, [user._id])

  useEffect(() => {
    if (location.pathname !== '/login') {
      appModel.verify()
    }
  }, [location.pathname])

  if (location.pathname === '/login') {
    return <Layout>{props.children}</Layout>
  }

  const renderMenuItem = (item) => {
    return (
      <If condition={!item.roleAuthority || item.roleAuthority.includes(user.user_level)}>
        <Menu.Item key={item.key}>
          <Link to={item.link}>
            <If condition={item.icon}>{item.icon}</If>
            {item.label}
          </Link>
        </Menu.Item>
      </If>
    )
  }

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
                    {item.icon}
                    {item.label}
                  </span>
                }
              >
                {item.child.map((subItem) => {
                  return renderMenuItem(subItem)
                })}
              </SubMenu>
            )
          }
          return renderMenuItem(item)
        })}
      </Menu>
    )
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider theme="light" className={styles.sideBar}>
        <div className={styles.logo}>{setting.site_name}</div>
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
            {user.user_level && userLevelMap.find((item) => item.value === user.user_level).text}
          </Header>
          <div className={styles.breadcrumb}>
            <Breakcrumbs />
          </div>
          <Content className={styles.content} style={{ position: 'relative', zIndex: 600 }}>
            {props.children}
          </Content>
          <Footer className={styles.footer}>
            <div>{setting.site_signature}</div>
            <div>
              ©{moment().format('YYYY')}&nbsp;{setting.site_copyright}
            </div>
          </Footer>
        </Layout>
      </Content>
    </Layout>
  )
}

export default BasicLayout
