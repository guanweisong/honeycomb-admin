import React, { useEffect } from 'react';
import { Button, Card, Checkbox, Col, Row, Tabs, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';
import useMenuModel from './model';
import useCategoryModel from '@/pages/post/category/model';
import { creatCategoryTitleByDepth } from '@/utils/help';
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
  TreeItem,
} from 'react-sortable-tree';
import { menuTypeMap } from '@/utils/mapping';
import 'react-sortable-tree/style.css';
import styles from './index.less';
import type { MenuEntity } from '@/pages/menu/types/menu.entity';
import { CategoryEntity } from '@/pages/post/category/types/category.entity';
import { PageEntity } from '@/pages/page/types/page.entity';
import { MenuType } from '@/pages/menu/types/MenuType';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Menu = () => {
  const menuModel = useMenuModel();
  const categoryModel = useCategoryModel();

  useEffect(() => {
    categoryModel.index();
    menuModel.indexPage();
    menuModel.indexMenu();
  }, []);

  /**
   * 可选菜单的取消选中事件
   * @param id
   */
  const removeItem = (id: string) => {
    const newArr = [...menuModel.checkedList];
    menuModel.checkedList.forEach((item, index) => {
      if (item._id === id) {
        newArr.splice(index, 1);
      }
    });
    menuModel.setCheckedList(newArr);
  };

  /**
   * 可选菜单的选中事件
   * @param e
   * @param type
   */
  const onCheck = (e: any, type: MenuType) => {
    if (e.target.checked) {
      menuModel.setCheckedList([
        ...menuModel.checkedList,
        { ...e.target.value, parent: '0', type },
      ]);
    } else {
      removeItem(e.target.value._id);
    }
  };

  /**
   * 获取可选菜单选中状态
   * @param item
   * @returns {boolean}
   */
  const getCheckedStatus = (item: CategoryEntity | PageEntity) => {
    let checked = false;
    menuModel.checkedList.forEach((m) => {
      if (m._id === item._id) {
        checked = true;
      }
    });
    return checked;
  };

  /**
   * 获取可选菜单禁用状态
   * @param item
   * @returns {boolean}
   */
  const getDisabledStatus = (item: CategoryEntity | PageEntity) => {
    let disabled = false;
    menuModel.checkedList.forEach((m) => {
      if (m.parent === item._id) {
        disabled = true;
      }
    });
    return disabled;
  };

  /**
   * 排序的回调
   * @param treeData
   */
  const onDragEnd = (treeData: TreeItem[]) => {
    const listData = getFlatDataFromTree({
      treeData,
      // @ts-ignore
      getNodeKey: (node) => node._id,
    });
    const list = listData.map(({ node, parentNode }) => ({
      ...node,
      parent: parentNode ? parentNode._id : '0',
      expanded: !!node.children,
    }));
    // @ts-ignore
    menuModel.setCheckedList(list);
  };

  /**
   * 获取数据树的标题字段
   * @param item
   * @returns {string}
   */
  const getTreeNodeTitle = (item: MenuEntity) => {
    let title = '';
    switch (item.type) {
      case MenuType.PAGE:
        title = item.page_title!;
        break;
      case MenuType.POST:
        title = item.category_title!;
        break;
      default:
    }
    return title;
  };

  /**
   * 将菜单扁平数据转换为树组件输入数据
   * @returns {Object[]}
   */
  const getMenuFormat = () => {
    const format: any[] = [];
    menuModel.checkedList.forEach((item) => {
      format.push({
        ...item,
        title: getTreeNodeTitle(item),
        subtitle: menuTypeMap[item.type],
        expanded: true,
      });
    });
    const tree = getTreeFromFlatData({
      flatData: format,
      getKey: (node) => node._id,
      getParentKey: (node) => node.parent,
    });
    return tree;
  };

  /**
   * 保存数据
   */
  const submit = () => {
    const data: MenuEntity[] = [];
    menuModel.checkedList.forEach((item, index) => {
      const menu = {
        _id: item._id,
        type: item.type,
        power: index,
      } as MenuEntity;
      if (item.parent !== '0') {
        menu.parent = item.parent;
      }
      data.push(menu);
    });
    menuModel.updateMenu(data);
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={6}>
            <Title level={4}>可选菜单项</Title>
            <Text>勾选菜单项添加到右侧</Text>
            <Tabs defaultActiveKey="1">
              <TabPane tab="分类" key="1">
                <div className={styles.items}>
                  {categoryModel.list.map((item) => (
                    <li key={item._id} className={styles.item}>
                      <Checkbox
                        value={item}
                        onChange={(e) => onCheck(e, MenuType.POST)}
                        checked={getCheckedStatus(item)}
                        disabled={getDisabledStatus(item)}
                      >
                        {creatCategoryTitleByDepth(item.category_title, item)}
                      </Checkbox>
                    </li>
                  ))}
                </div>
              </TabPane>
              <TabPane tab="页面" key="2">
                <div className={styles.items}>
                  {menuModel.pageList.map((item) => (
                    <li key={item._id} className={styles.item}>
                      <Checkbox
                        value={item}
                        onChange={(e) => onCheck(e, MenuType.PAGE)}
                        defaultChecked={getCheckedStatus(item)}
                        disabled={getDisabledStatus(item)}
                      >
                        {item.page_title}
                      </Checkbox>
                    </li>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={16} offset={2}>
            <Title level={4}>菜单结构</Title>
            <Text>
              <Choose>
                <When condition={menuModel.checkedList.length > 0}>拖拽下方菜单进行排序</When>
                <Otherwise>请先从左侧选择菜单</Otherwise>
              </Choose>
            </Text>
            <div className={styles.menus}>
              <SortableTree
                treeData={getMenuFormat()}
                onChange={(treeData) => onDragEnd(treeData)}
                rowHeight={50}
              />
            </div>
            <Button type="primary" icon={<SaveOutlined />} onClick={submit}>
              保存
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Menu;
