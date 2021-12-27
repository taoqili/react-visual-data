import { guid, cloneDeep, isEmpty, deepMergeObj } from "../../utils";

/**
 * 新建组件生成配置项
 * @param {*} components 所有组件配置项
 * @param {*} opts 当前组件配置项
 */
export function addComponent(components, opts = {}) {
  const options = cloneDeep(opts);
  const uniqueId = guid();
  options.uniqueId = uniqueId;
  return { components: components.concat(options), fieldId: uniqueId };
}

/**
 * 获取当前组件配置项
 * @param {*} fields 所有组件配置项
 * @param {*} id 当前组件id
 */
export function getComponentConf(fields, id) {
  return fields.filter((o) => id === o.uniqueId)[0];
}

/**
 * 编译具有层级的数据结构
 * @param {*} flatTree
 * @param {*} deep
 */
export function setLevelPath(nodes, parentNode, key = "drillDownLevel") {
  if (nodes.length === 0) return nodes;
  for (let i = 0; i < nodes.length; i++) {
    if (!parentNode) {
      nodes[i].data[key] = 0;
    } else {
      nodes[i].data[key] = parentNode.data[key] + 1;
    }

    if (nodes[i].data.drillDown && nodes[i].data.drillDown.length > 0) {
      setLevelPath(nodes[i].data.drillDown, nodes[i], key);
    }
  }
}

/**
 * 数据处理 so we have always a relation parent/children of each node
 * @param {*} target
 * @param {*} key
 * @param {*} level
 */
function getLevelData(target, key, level, value) {
  for (let i = 0; i < target.length; i++) {
    if (target[i].data[key] && target[i].data[key] === level) {
      target[i].data = deepMergeObj(target[i].data, value);
      break;
    }
    if (!isEmpty(target[i].data.drillDown)) {
      getLevelData(target[i].data.drillDown, key, level, value);
    }
  }
}

/**
 * 合并组件配置项
 * @param {*} fields 所有组件配置项
 * @param {*} opts 当前组件id、需要合并后的属性值、数据层级
 */
export function mergeFieldConfig(fields, opts, value) {
  let objKey = "drillDownLevel";

  const { parentId, level = 0 } = opts;

  let newFiled = fields.map((n) => {
    if (n.uniqueId === parentId) {
      if (level > 0) {
        // TODO: 数据合并
        getLevelData(n.data.drillDown, objKey, level, value);
      } else {
        n.data = deepMergeObj(n.data, value);
      }
    }
    return n;
  });

  return newFiled;
}

/**
 * 调整顺序
 * @param {*} arr
 * @param {*} next 添加元素的位置
 * @param {*} prev 删除元素的位置
 */
export function orderBy(arr, next, prev) {
  arr[next] = arr.splice(prev, 1, arr[next])[0];
  return arr;
}

/**
 * 获取组件的索引值
 * @param {*} fields 所有组件配置项
 * @param {*} id 当前组件id
 */
export function getComponentOrder(fields, id) {
  if (isEmpty(fields)) return {};

  let newFiled = cloneDeep(fields);
  const index = newFiled.findIndex((o) => o.uniqueId === id);
  return { index, components: newFiled };
}

