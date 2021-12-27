import React, { useEffect, useRef } from "react";
import { Divider } from 'antd';
import storage from "../../../utils/storage";
import { CopyOutlined, DeleteOutlined, RedoOutlined, UndoOutlined, HighlightOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { generatorField, getFieldConf, getFieldOrderBy } from "../../core/utils";
import MonacoEditor from '../../components/MonacoEditor'

const buttonStyle = {
  fontSize: 12,
  border: '1px solid rgba(200,200,200,0.4)',
  borderRadius: 4,
  padding: '6px 12px',
  cursor: 'pointer'
}

// TODO 基本的编辑操作要内部封装起来，如复制、删除、清空、置顶、置底、上移、下移等
export default [
  {
    name: 'copy',
    title: '复制',
    icon: ({state}) => {
      return state.currentNode !== '-' ? <CopyOutlined /> : <span style={{opacity: .5}}><CopyOutlined /></span>
    },
    place: 'left',
    onClick: ({state,setState}) => {
      if (state.currentNode === '-') {
        return
      }
      // TODO 这两个方法需要暴露出来，不能让用户直接调用用
      const curFieldConf = getFieldConf(state.components, state.currentNode);
      const { components, fieldId } = generatorField(state.components, curFieldConf);
      setState({ components: components, currentNode: fieldId });
    }
  },
  {
    name: 'delete',
    title: '删除',
    icon: ({state}) => {
      return state.currentNode !== '-' ? <CloseCircleOutlined /> : <span style={{opacity: .5}}><CloseCircleOutlined /></span>
    },
    place: 'left',
    onClick:({state, setState}) => {
      const { currentNode } = state;
      if (currentNode === '-') {
        return
      }
      const { index, components } = getFieldOrderBy(state.components, currentNode);
      let fieldId;
      if (components.length === 1) {
        fieldId = "-";
      } else if (index > 0) {
        fieldId = components[index - 1].uniqueId;
      } else {
        fieldId = components[index + 1].uniqueId;
      }
      components.splice(index, 1);
      setState({ components: components, currentNode: fieldId });
    }
  },
  {
    name: 'clear',
    title: '清空',
    icon: <DeleteOutlined />,
    place: 'left',
    onClick: ({setState, setView}) => {
      setView({
        isShowReferLine: false,
        lines: {
          h: [],
          v: []
        }
      });
      setState({
        currentNode: '-',
        settingTabsKey: 'base',
        components: [],
        undo: [],
        redo: []
      });
    }
  },
  {
    name: 'setting',
    title: '页面设置',
    icon: <span style={buttonStyle}>页面设置</span>, //<SettingOutlined />,
    place: 'right',
    onClick: ({setState}) => {
      setState({currentNode: '-'})
    }
  },
  {
    name: 'divider1',
    tittle: '',
    icon: <Divider type="vertical" style={{borderLeft: '1px solid rgba(200, 200, 200, .8)'}} />,
    place: 'right'
  },
  {
    name: 'undo',
    title: '撤销',
    icon: <UndoOutlined />,
    place: 'right',
    onClick: ({state, setState}) => {
      console.log('撤销')
    }
  },
  {
    name: 'redo',
    title: '重做',
    icon: <RedoOutlined />,
    place: 'right',
    onClick: ({state, setState}) => {
      console.log('重做')
    }
  },
  {
    name: 'debug',
    title: 'Schema 调试',
    icon: <HighlightOutlined />,
    place: 'right',
    popupProps: ({ state, setState, view, setView }) => {
      return {
        okText: "应用修改",
        title: "调试",
        style: { top: 20 },
        width: 960,
        onOk: () => {
          const value = state.refs.debugEditorRef.current?.getValue();
          setState({ components: value.components });
        },
        onCancel: () => {
          setView({ visible: !view.visible })
        }
      }
    },
    component: ({ state, setState }) => {
      const debugEditorRef = useRef(null);
      useEffect(() => {
        setState({refs: {debugEditorRef}})
      }, [])
      return (
        <MonacoEditor
          height={520}
          language="json"
          ref={debugEditorRef}
          value={{
            page: state.page,
            components: state.components
          }}
        />
      )
    }
  },
  {
    name: 'divider2',
    tittle: '',
    icon: <Divider type="vertical" style={{borderLeft: '1px solid rgba(200, 200, 200, .8)'}} />,
    place: 'right'
  },
  {
    name: 'save',
    title: '',
    icon: <span style={buttonStyle}>保存代码</span>,
    place: 'right',
    onClick: ({state, setState}) => {
      console.log('保存成功')
    }
  },
  {
    name: 'preview',
    title: '',
    icon: <span style={buttonStyle}>预览</span>,
    place: 'right',
    onClick: ({ state }) => {
       storage.setLocal("schema_screen_config", {
          page: state.page,
          components: state.components
       });
       window.open('/preview/' + Date.now())
    }
  }
]
