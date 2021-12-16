import React, { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { Collapse, Tree, Select, Card, Col, Row, Tabs } from "antd";
import { AppleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { IconFont, Scrollbar } from "~components";
import { useDesigner, useView } from "~hooks/useDesigner";
import designerList from "./designer-market.json";
import "./index.less";

/**
 * 配置项汇总
 */
// const { collection } = designerList;

const designerTotal = Object.values(designerList).flat(1);

/**
 * 枚举组件
 * @param {*} value 搜索值
 */
const FieldEnum = ({ value }) => {
  const componentEnum = useRef([
    {
      key: "bar",
      name: "柱状图",
      icon: "BarChartOutlined",
      list: designerList.bar
    },
    {
      key: "line",
      name: "线形图",
      icon: "LineChartOutlined",
      list: designerList.line
    },
    {
      key: "pie",
      name: "饼状图",
      icon: "PieChartOutlined",
      list: designerList.pie
    },
    {
      key: "map",
      name: "地图",
      icon: "HeatMapOutlined",
      list: designerList.map
    },
    {
      key: "other",
      name: "其他图表",
      icon: "FundOutlined",
      list: designerList.other
    },
    {
      key: "datav",
      name: "辅助组件",
      icon: "WindowsOutlined",
      list: designerList.datav
    }
  ]).current;

  const displayField = designerTotal.filter((ele) => ele.name === value);

  const handleDragStart = useCallback((ev, name) => {
    ev.dataTransfer.setData("text", name);
    const node = ev.target.childNodes[0];
    ev.dataTransfer.setDragImage(node, node.clientWidth / 2, node.clientHeight / 2);
  }, []);

  return displayField && displayField.length === 0 ? (
    <div className="silder-tab">
      <Collapse defaultActiveKey="bar" expandIconPosition="right" accordion>
        {componentEnum.map((item) => (
          <Collapse.Panel
            header={
              <Fragment>
                <IconFont antd={true} style={{ marginRight: 5 }} type={item.icon} />
                {item.name}
              </Fragment>
            }
            key={item.key}
          >
            <Row gutter={10}>
              {item.list.map((node, idx) => {
                return (
                  <Col span={12} key={`${idx}`}>
                    <div
                      className="silder-item"
                      draggable={true}
                      onDragStart={(event) => handleDragStart(event, node.type)}
                    >
                      <Card
                        hoverable
                        cover={
                          node.icon ? (
                            <img alt="AutoComplete" draggable={false} src={`./static/component/${node.icon}.png`} />
                          ) : null
                        }
                        bodyStyle={{
                          padding: "10px 5px",
                          fontSize: 12
                        }}
                      >
                        <Card.Meta description={node.name} />
                      </Card>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  ) : (
    <Row gutter={10}>
      {displayField.map((node, idx) => {
        return (
          <Col span={12} key={`${idx}`}>
            <div className="silder-item" draggable={true} onDragStart={(event) => handleDragStart(event, node.type)}>
              <Card
                hoverable
                cover={
                  node.icon ? (
                    <img alt="AutoComplete" draggable={false} src={`./static/component/${node.icon}.png`} />
                  ) : null
                }
                bodyStyle={{
                  padding: "10px 5px",
                  fontSize: 12
                }}
              >
                <Card.Meta description={node.name} />
              </Card>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

// 组件市场汇总
const FieldMarkets = ({ selected, dispatch }) => {
  const [cname, setcname] = useState("");
  const [layer, setLayer] = useState([
    {
      title: "图层",
      key: "-",
      children: []
    }
  ]);
  const { state, setState } = useDesigner();
  const { view, setView } = useView();

  useEffect(() => {
    const treeList = state.components.map((component) => {
      const { uniqueId, data = {} } = component;
      return {
        key: uniqueId,
        title: <div>{data.title} </div>,
        isLeaf: true
      };
    });
    // 最终图层面板
    setLayer([
      {
        title: "图层",
        key: "-",
        children: treeList
      }
    ]);
  }, [selected, state.components]);

  const onChange = (value) => {
    setcname(value);
  };

  const onSelect = (keys) => {
    if (!keys || !keys.length) {
      return;
    }
    setState({ configTabsKey: "base" });
    dispatch({ type: "component/selected", data: keys.join("") });
  };

  const handleToggle = () => {
    setView({leftPaneCollapsed: !view.leftPaneCollapsed})
  }

  return (
    <aside className={view.leftPaneCollapsed ? "gc-design__silder is-show" : "gc-design__silder"}>
      <Tabs
        className="left-pane-tabs"
        tabBarExtraContent={
          <span style={{cursor: 'pointer'}} onClick={handleToggle}>
            {!view.leftPaneCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </span>
        }
        size="large"
        tabPosition="left"
        selected={state.panelTabsKey}
        onTabClick={(key) => {
          setView({leftPaneCollapsed: false})
          setState({ panelTabsKey: key });
        }}
      >
        <Tabs.TabPane key={"outline"} tab={<span><AppleOutlined />大纲树</span>} className={"outline-pane-tab"} >
          <Scrollbar>
            <Tree
              defaultExpandAll
              showLine
              blockNode
              selectedKeys={[selected]}
              onSelect={onSelect}
              treeData={layer}
            />
          </Scrollbar>
        </Tabs.TabPane>
        <Tabs.TabPane key={"material"} tab={"组件库"} className={"material-pane-tab"}>
          <Scrollbar>
            <Select
              className="silder-select"
              showSearch={true}
              allowClear={true}
              placeholder="查找对应组件"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {designerTotal.map((item) => {
                return (
                  <Select.Option value={item.name} key={item.name}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
            <FieldEnum value={cname} />
          </Scrollbar>
        </Tabs.TabPane>
        <Tabs.TabPane key={"datasource"} tab={"数据源"} className={"datasource-pane-tab"}>
          <Scrollbar>
            数据源
          </Scrollbar>
        </Tabs.TabPane>
      </Tabs>
    </aside>
  );
};

export default connect((state) => ({
  selected: state.component.selected
}))(FieldMarkets);
