import React, { useMemo } from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import cx from "classnames";
import { Scrollbar } from "~components";
import SchemaRender from "@/form-render";
import pageSchema from "./page-schema";
import { useDesigner, useView } from "~hooks/useDesigner";
import { getFieldConf, mergeFieldConfig, setLevelPath } from "../renderer/utils";
import { screenToSchema } from "../configuration-schema";
import { DIMENSION } from "../constants";
import "./index.less";

const FieldSetConf = ({ selected }) => {
  const { state, setState } = useDesigner();
  const { view, setView } = useView();

  const classNames = cx("gc-design__setting", {
    "is-show": view.settingCollapsed
  });

  const currentConf = useMemo(() => {
    if (state.components.length > 0 && selected !== "-") {
      try {
        // TODO: 获取物料组件配置项
        const currentField = getFieldConf(state.components, selected);

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
  }, [selected, state.configTabsKey]);

  const onComponentValueChange = (value) => {
    let results = mergeFieldConfig(state.components, { parentId: selected }, value);
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

  if (selected === "-") {
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
        selected={state.configTabsKey}
        onTabClick={(key) => {
          setState({ configTabsKey: key });
        }}
      >
        {
          currentConf.configs.map((item) => {
            return (
              <Tabs.TabPane tab={item.name} key={item.key}>
                {state.configTabsKey === item.key && (
                  <Scrollbar>
                    <SchemaRender
                      cname={currentConf.cname}
                      cid={currentConf.cid}
                      schema={item.schema}
                      formData={currentConf.value}
                      onChange={onComponentValueChange}
                    />
                  </Scrollbar>
                )}
              </Tabs.TabPane>
            );
          })
        }
      </Tabs>
    </div>
  );
};

export default connect((state) => ({
  selected: state.component.selected
}))(FieldSetConf);
