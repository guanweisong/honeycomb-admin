import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import menuData from '@/utils/menu.js';
import Breakcrumbs from '@/components/Breakcrumbs/Breakcrumbs';
import { userLevelMap } from '@/utils/mapping.js';
import styles from './index.less';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
@connect(({ app }) => ({ app }))
class BasicLayout extends PureComponent {
  onLoginOut = () => {
    this.props.dispatch({ type: 'app/logout', payload: this.props.app.user._id });
  }
  renderMenu() {
    return (
      <Menu
        mode="inline"
        style={{borderRight: "none"}}
        selectedKeys={[this.props.location.pathname.substring(1) ? this.props.location.pathname.substring(1) : 'dashboard']}
        defaultOpenKeys={[this.props.location.pathname.substring(1).split('/')[0]]}
      >
      {
        menuData.map(item => {
          if (item.child) {
            return (
              <SubMenu key={item.key} title={<span><Icon type={item.icon} />{item.label}</span>}>
              {
                item.child.map(subItem => {
                  return this.renderMenuItem(subItem)
                })
              }
              </SubMenu>
            )
          } else {
            return this.renderMenuItem(item);
          }
        })
      }
      </Menu>
    );
  }
  renderMenuItem(item) {
    return (
      <Menu.Item key={item.key}>
        <Link to={item.link}>
          <If condition={item.icon}>
            <Icon type={item.icon} />
          </If>
          {item.label}
        </Link>
      </Menu.Item>
    )
  }
  render() {
    if (!this.props.app.user._id) {
      if (this.props.location.pathname === '/login') {
        return <Layout>{ this.props.children }</Layout>
      } else {
        return <Redirect to='/login' />
      }
    }
    if (this.props.app.user._id && this.props.location.pathname === '/login') {
      return <Redirect to='/' />
    }
    return (
      <Layout style={{minHeight: "100%"}}>
        <Sider theme="light" className={styles.sideBar}>
          <div className={styles.logo}>{this.props.app.setting.site_name}</div>
          {this.renderMenu()}
        </Sider>
        <Content>
          <Layout>
            <Header className={styles.topBar}>
              <Button
                icon="logout"
                style={{
                  float: 'right',
                  marginTop: '15px'
                }}
                onClick={this.onLoginOut}
              >
                退出
              </Button>
              欢迎回来：{this.props.app.user.user_name}&ensp;
              级别：{userLevelMap.find(item => item.value === this.props.app.user.user_level).text}
            </Header>
            <div className={styles.breadcrumb}><Breakcrumbs /></div>
            <Content className={styles.content} style={{position: 'relative', zIndex: 600}}>
              { this.props.children }
            </Content>
            <Footer className={styles.footer}>©{moment().format('YYYY')}&nbsp;{this.props.app.setting.site_copyright}</Footer>
          </Layout>
        </Content>
      </Layout>
    )
  }
}

export default BasicLayout;
