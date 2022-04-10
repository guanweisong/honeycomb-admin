import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Row, Tabs, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';
import { creatCategoryTitleByDepth } from '@/utils/help';
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
  TreeItem,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import styles from './index.less';
import type { MenuEntity } from '@/pages/menu/types/menu.entity';
import { CategoryEntity } from '@/pages/post/category/types/category.entity';
import { PageEntity } from '@/pages/page/types/page.entity';
import { MenuType, MenuTypeName } from '@/pages/menu/types/MenuType';
import * as pagesService from '@/pages/page/service';
import * as menusService from '@/pages/menu/service';
import * as categoryService from '@/pages/post/category/service';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Menu = () => {
  const [pageList, setPageList] = useState<PageEntity[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryEntity[]>([]);
  const [checkedList, setCheckedList] = useState<MenuEntity[]>([]);

  /**
   * 查询页面集合
   */
  const indexPage = async () => {
    console.log('pages=>model=>index');
    const result = await pagesService.indexPageList();
    if (result.status === 200) {
      setPageList(result.data.list);
    }
  };

  /**
   * 查询分类列表
   */
  const indexCategory = async () => {
    const result = await categoryService.index({ limit: 9999 });
    if (result.status === 200) {
      setCategoryList(result.data.list);
    }
  };

  /**
   * 查询菜单集合
   */
  const indexMenu = async () => {
    const result = await menusService.index();
    if (result.status === 200) {
      setCheckedList(result.data.list);
    }
  };

  useEffect(() => {
    indexCategory();
    indexPage();
    indexMenu();
  }, []);

  /**
   * 可选菜单的取消选中事件
   * @param id
   */
  const removeItem = (id: string) => {
    const newArr = [...checkedList];
    checkedList.forEach((item, index) => {
      if (item._id === id) {
        newArr.splice(index, 1);
      }
    });
    setCheckedList(newArr);
  };

  /**
   * 可选菜单的选中事件
   * @param e
   * @param type
   */
  const onCheck = (e: any, type: MenuType) => {
    if (e.target.checked) {
      setCheckedList([...checkedList, { ...e.target.value, parent: '0', type }]);
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
    checkedList.forEach((m) => {
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
    checkedList.forEach((m) => {
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
    setCheckedList(list);
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
    checkedList.forEach((item) => {
      format.push({
        ...item,
        title: getTreeNodeTitle(item),
        subtitle: MenuTypeName[MenuType[item.type]],
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
  const submit = async () => {
    const data: MenuEntity[] = [];
    checkedList.forEach((item, index) => {
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
    const result = await menusService.update(data);
    if (result.status === 201) {
      message.success('更新成功');
      indexMenu();
    }
  };

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={6}>
            <Title level={4}>可选菜单项</Title>
            <Text>勾选菜单项添加到右侧</Text>
            <Tabs defaultActiveKey="1">
              <TabPane tab="分类" key="1">
                <div className={styles.items}>
                  {categoryList.map((item) => (
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
                  {pageList.map((item) => (
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
                <When condition={checkedList.length > 0}>拖拽下方菜单进行排序</When>
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
    </PageContainer>
  );
};

export default Menu;
