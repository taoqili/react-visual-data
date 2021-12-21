import React, { useEffect, useRef } from "react";
import { Modal, Space, Button, Typography, Badge, message, Tooltip } from "antd";
import { Link } from "react-router-dom";
import copyTOClipboard from "copy-text-to-clipboard";
import { useDesigner, useView } from "~hooks/useDesigner";
import { uuid } from "~utils";
import { generatorField, getFieldConf, getFieldOrderBy, orderBy } from "../../core/utils";
import { IconFont, MonacoEditor } from "~components";
import storage from "~utils/storage";

const FieldActionsConf = () => {
  const { state, setState } = useDesigner();
  const { view, setView } = useView();
  const editorRef = useRef(null);

  // TODO: 清空
  const handleClear = () => {
    setView({
      isShowReferLine: false,
      lines: {
        h: [],
        v: []
      }
    });
    setState({
      currentNode: '-',
      components: [],
      undo: [],
      redo: []
    });
  };

  // TODO: 复制
  const handleCopy = () => {
    const curFieldConf = getFieldConf(state.components, state.currentNode);
    const { components, fieldId } = generatorField(state.components, "field", curFieldConf);
    setState({ components: components, currentNode: fieldId });
  };

  // TODO: 删除
  const handleDelete = () => {
    const { index, components } = getFieldOrderBy(state.components, state.currentNode);
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
  };

  // TODO: 上移，与前一个元素交换顺序
  const handleUp = () => {
    const { index, components } = getFieldOrderBy(state.components, state.currentNode);

    if (index - 1 >= 0) {
      const results = orderBy(components, index, index - 1);
      setState({ components: results });
    } else {
      message.destroy();
      message.warning("图层已经置顶，无法上移");
    }
  };

  // TODO: 下移，与后一个元素交换顺序
  const handleDown = () => {
    const { index, components } = getFieldOrderBy(state.components, state.currentNode);

    if (index + 1 < components.length) {
      const results = orderBy(components, index, index + 1);
      setState({ components: results });
    } else {
      message.destroy();
      message.warning("图层已经置底，无法下移");
    }
  };

  // TODO: 置顶
  const handleTop = () => {
    const { index, components } = getFieldOrderBy(state.components, state.currentNode);

    if (index - 1 >= 0) {
      // 将要置顶的元素存储后删除
      const temp = components.splice(index, 1)[0];
      // 将元素unshift到数组第一位
      components.unshift(temp);
      setState({ components: components });
    } else {
      message.destroy();
      message.warning("图层已经置顶");
    }
  };

  // TODO: 置底
  const handleBottom = () => {
    const { index, components } = getFieldOrderBy(state.components, state.currentNode);

    if (index + 1 < components.length) {
      // 将要置底的元素存储后删除
      const temp = components.splice(index, 1)[0];
      // 将元素push到数组最后一位
      components.push(temp);
      setState({ components: components });
    } else {
      message.destroy();
      message.warning("图层已经置底");
    }
  };

  const toggleModal = () => setView({ visible: !view.visible });

  const handleModifySchema = () => {
    const value = editorRef.current?.getValue();
    setView({ visible: false });
    setState({ components: value.components });
  };

  const handleCopySchema = () => {
    let displaySchemaString = JSON.stringify(
      {
        page: state.page,
        components: state.components
      },
      null,
      4
    );
    copyTOClipboard(displaySchemaString);
    message.info("复制成功");
  };

  const { siteLogo, siteName } = state.appConfig || {}
  return (
    <header className="gc-design__hd">
      <div className="gc-design__hd--title">
        <Typography.Title level={4} className="gc-design__hd--h1">
          <img src={siteLogo} width={22} alt="" />&nbsp;&nbsp;
          {siteName}
        </Typography.Title>
      </div>
      <Space className="gc-design__hd--action">
        <Button disabled={state.currentNode === "-"} icon={<IconFont antd={true} type="CopyOutlined" />} onClick={handleCopy}>
          复制
        </Button>

        <Button
          disabled={state.currentNode === "-"}
          icon={<IconFont antd={true} type="DeleteOutlined" />}
          onClick={handleDelete}
        >
          删除
        </Button>
        <Button icon={<IconFont antd={true} type="ClearOutlined" />} onClick={handleClear}>
          清空
        </Button>
        <Button disabled={state.currentNode === "-"} icon={<IconFont antd={true} type="SwapLeftOutlined" />} onClick={handleUp}>
          上一层
        </Button>
        <Button
          disabled={state.currentNode === "-"}
          icon={<IconFont antd={true} type="SwapRightOutlined" />}
          onClick={handleDown}
        >
          下一层
        </Button>
        <Button
          disabled={state.currentNode === "-"}
          icon={<IconFont antd={true} type="VerticalAlignTopOutlined" />}
          onClick={handleTop}
        >
          置顶
        </Button>
        <Button
          disabled={state.currentNode === "-"}
          icon={<IconFont antd={true} type="VerticalAlignBottomOutlined" />}
          onClick={handleBottom}
        >
          置底
        </Button>
      </Space>
      <div className="gc-design__hd--setting">
        <Space className="gc-design__hd--save">
          <Link
            to={"/preview/" + uuid()}
            target="_blank"
            onClick={() => {
              storage.setLocal("schema_screen_config", {
                page: state.page,
                components: state.components
              });
            }}
          >
            <Button icon={<IconFont antd={true} type="DesktopOutlined" />}>预览</Button>
          </Link>
          <Button icon={<IconFont antd={true} type="CodepenOutlined" />} onClick={toggleModal}>
            调试
          </Button>
        </Space>
      </div>
      <Modal
        visible={view.visible}
        title="调试"
        style={{ top: 20 }}
        width={960}
        // okText="复制配置"
        okText="应用修改"
        cancelText="取消"
        // onOk={handleCopySchema}
        onOk={handleModifySchema}
        onCancel={toggleModal}
      >
        <MonacoEditor
          height={520}
          language="json"
          ref={editorRef}
          value={{
            page: state.page,
            components: state.components
          }}
        />
      </Modal>
    </header>
  );
};

export default FieldActionsConf;
