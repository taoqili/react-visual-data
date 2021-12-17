import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import { useDesigner } from "~hooks/useDesigner";

const clsPrefix = 'lcp-design-pane';

export default ({ selected }) => {
  const [layer, setLayer] = useState([
    {
      title: "图层",
      key: "-",
      children: []
    }
  ]);
  const { state, setState } = useDesigner();

  const onSelect = (keys) => {
    if (!keys || !keys.length) {
      return;
    }
    setState({ configTabsKey: "base" });
    dispatch({ type: "component/selected", data: keys.join("") });
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
  }, [selected, state.components]);

  return (
    <div className={`${clsPrefix}-outline`}>
      <Tree
        defaultExpandAll
        showLine
        blockNode
        selectedKeys={[selected]}
        onSelect={onSelect}
        treeData={layer}
      />
    </div>
  )
}
