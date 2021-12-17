import React, { Fragment, useCallback, useRef } from "react";
import designerList from "./designer-market.json";
import { Card, Col, Collapse, Row } from "antd";
const designerTotal = Object.values(designerList).flat(1);
import { IconFont } from "~components";

export default ({value}) => {
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
}
