import React, { useMemo } from "react";
import { Tabs } from "antd";
import cx from "classnames";
import { Scrollbar } from "~components";
import SchemaRender from "@/form-render";
import pageSchema from "./page-schema";
import { useDesigner, useView } from "~hooks/useDesigner";
import { getFieldConf, mergeFieldConfig, setLevelPath } from "../../core/utils";
import { screenToSchema } from "../../configuration-schema";
import { DIMENSION } from "../../constants";
import "./index.less";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const FieldSetConf = () => {
  const { state, setState } = useDesigner();
  const { view, setView } = useView();

  const classNames = cx("gc-design__setting", {
    "is-show": view.rightPaneCollapsed
  });

  const currentConf = useMemo(() => {
    if (state.components.length > 0 && state.currentNode !== "-") {
      try {
        // TODO: 获取物料组件配置项
        const currentField = getFieldConf(state.components, state.currentNode);

        return {
          cname: currentField.type,
          cid: currentField.uniqueId,
          value: currentField.data,
          configs: screenToSchema.find((o) => o.materials === currentField.type).fields
        };
      } catch (error) {
      }
    }

    return {
      cname: null,
      cid: null,
      value: {},
      configs: []
    };
  }, [state.currentNode, state.settingTabsKey]);

  const onComponentValueChange = (value) => {
    let results = mergeFieldConfig(state.components, { parentId: state.currentNode }, value);
    setLevelPath(results, null);
    setState({ components: results });
  };

  const onPageValueChange = (value) => {
    const { pageSize } = value.page;
    let realValue = { ...value.page };

    if (DIMENSION[pageSize]) {
      realValue = { ...realValue, ...DIMENSION[pageSize] };
    } else {
      realValue = { ...realValue, ...realValue.customPageSize };
    }
    setState({ page: realValue });
    setView({...realValue.customPageSize});
  };
  const handleToggle = () => {
    setView({rightPaneCollapsed: !view.rightPaneCollapsed})
  }

  if (state.currentNode === "-") {
    return (
      <div className={classNames}>
        <Scrollbar>
          <SchemaRender
            cname={"rootPage"}
            cid={"root-page-schema"}
            schema={pageSchema}
            formData={{ page: state.page }}
            onChange={onPageValueChange}
          />
        </Scrollbar>
      </div>
    );
  }

  return (
    <div className={classNames}>
      <Tabs
        className="right-pane-tabs"
        size="large"
        tabPosition="right"
        tabBarExtraContent={
          <span style={{cursor: 'pointer'}} onClick={handleToggle}>
            {view.rightPaneCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </span>
        }
        selected={state.settingTabsKey}
        onTabClick={(key) => {
          setView({rightPaneCollapsed: false})
          setState({ settingTabsKey: key });
        }}
      >
        {
          currentConf.configs.map((item) => {
            return (
              <Tabs.TabPane tab={item.name} key={item.key}>
                <Scrollbar>
                  <SchemaRender
                    cname={currentConf.cname}
                    cid={currentConf.cid}
                    schema={item.schema}
                    formData={currentConf.value}
                    onChange={onComponentValueChange}
                  />
                </Scrollbar>
              </Tabs.TabPane>
            );
          })
        }
      </Tabs>
    </div>
  );
};

export default FieldSetConf;
