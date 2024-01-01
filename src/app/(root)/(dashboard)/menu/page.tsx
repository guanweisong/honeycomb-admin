'use client';

import { PageEntity } from '@/app/(root)/(dashboard)/page/types/page.entity';
import { creatCategoryTitleByDepth } from '@/utils/help';
import { SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Checkbox, Col, Row, Tabs, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import SortableTree, {
  TreeItem,
  getFlatDataFromTree,
  getTreeFromFlatData,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import PageService from '../page/service';
import CategoryService from '../post/category/service';
import { CategoryEntity } from '../post/category/types/category.entity';
import MenuService from './service';
import { MenuType, MenuTypeName } from './types/MenuType';
import type { MenuEntity } from './types/menu.entity';

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
    const result = await PageService.indexPageList();
    if (result.status === 200) {
      setPageList(result.data.list);
    }
  };

  /**
   * 查询分类列表
   */
  const indexCategory = async () => {
    const result = await CategoryService.index({ limit: 9999 });
    if (result.status === 200) {
      setCategoryList(result.data.list);
    }
  };

  /**
   * 查询菜单集合
   */
  const indexMenu = async () => {
    const result = await MenuService.index();
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
      if (item.id === id) {
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
      removeItem(e.target.value.id);
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
      if (m.id === item.id) {
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
      if (m.parent === item.id) {
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
      getNodeKey: (node) => node.id,
    });
    const list = listData.map(({ node, parentNode }) => ({
      ...node,
      // @ts-ignore
      parent: parentNode ? parentNode.id : '0',
      expanded: !!node.children,
    }));
    // @ts-ignore
    setCheckedList(list);
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
        title: item.title.zh,
        subtitle: MenuTypeName[MenuType[item.type]],
        expanded: true,
      });
    });
    const tree = getTreeFromFlatData({
      flatData: format,
      // @ts-ignore
      getKey: (node) => node.id,
      // @ts-ignore
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
        id: item.id,
        type: item.type,
        power: index,
      } as MenuEntity;
      if (item.parent !== '0') {
        menu.parent = item.parent;
      }
      data.push(menu);
    });
    const result = await MenuService.update(data);
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
                <div className="overflow-y-auto bg-gray-50 py-2">
                  {categoryList.map((item) => (
                    <div key={item.id} className="px-3 leading-8 transition-all hover:bg-gray-100">
                      <Checkbox
                        value={item}
                        onChange={(e) => onCheck(e, MenuType.CATEGORY)}
                        checked={getCheckedStatus(item)}
                        disabled={getDisabledStatus(item)}
                      >
                        {creatCategoryTitleByDepth(item.title.zh, item)}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </TabPane>
              <TabPane tab="页面" key="2">
                <div className="overflow-y-auto bg-gray-50 py-2">
                  {pageList.map((item) => (
                    <div key={item.id} className="px-3 leading-8 transition-all hover:bg-gray-100">
                      <Checkbox
                        value={item}
                        onChange={(e) => onCheck(e, MenuType.PAGE)}
                        defaultChecked={getCheckedStatus(item)}
                        disabled={getDisabledStatus(item)}
                      >
                        {item.title.zh}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={16} offset={2}>
            <Title level={4}>菜单结构</Title>
            <Text>{checkedList.length > 0 ? '拖拽下方菜单进行排序' : '请先从左侧选择菜单'}</Text>
            <div className="bg-gray-50 h-96 my-2 py-2">
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
