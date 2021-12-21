import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import { useStore } from "../../../hooks/useDesigner";

const clsPrefix = 'lcp-design-pane';

export default () => {
  const [layer, setLayer] = useState([
    {
      title: "图层",
      key: "-",
      children: []
    }
  ]);
  const { state, setState } = useStore();

  const onSelect = (keys) => {
    if (!keys || !keys.length) {
      return;
    }
    setState({ settingTabsKey: "base", currentNode: keys.join("") });
  };
  useEffect(() => {
    const treeList = state.components.map((component) => {
      const { uniqueId, data = {} } = component;
      return {
        key: uniqueId,
        title: <div>{data.title} </div>,
        isLeaf: true
      };
    });
    setLayer([
      {
        title: "图层",
        key: "-",
        children: treeList
      }
    ]);
  }, [state.currentNode, state.components]);

  return (
    <div className={`${clsPrefix}-outline`}>
      <Tree
        defaultExpandAll
        showLine
        blockNode
        selectedKeys={[state.currentNode]}
        onSelect={onSelect}
        treeData={layer}
      />
    </div>
  )
}
