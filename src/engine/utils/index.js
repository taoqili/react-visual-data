
// 获取对象类型字符串
export function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// 转化样式布局值
export function convertLayout(value, defaultValue = "100%") {
  // 是否为数字 ex："222"、222
  function isLooselyNumber(num) {
    if (toRawType(num) === "Number") return true;
    if (toRawType(num) === "String") {
      return !Number.isNaN(Number(num));
    }
    return false;
  }

  function isCssLength(str) {
    if (typeof str !== "string") return false;
    return str.match(/^([0-9])*(%|px|rem|em)$/i);
  }

  return isLooselyNumber(value) ? Number(value) : isCssLength(value) ? value : defaultValue;
}

/**
 * 基于时间戳的 uuid
 * @return uniqueId
 */
export function uuid() {
  return (+new Date()).toString(36);
}

/**
 * 唯一id
 * @type {function(*=): string}
 */
export const guid = (() => {
  const heyStack = "0123456789abcdefghijklmnopqrstuvwxyz";
  const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length));
  return (length = 10) => {
    return Array.from({ length }, () => heyStack[randomInt()]).join("");
  }
})();

// 深度克隆对象
export function cloneDeep(obj) {
  let clone = obj;
  if (obj && typeof obj === "object") {
    clone = new obj.constructor();
    Object.getOwnPropertyNames(obj).forEach((prop) => (clone[prop] = cloneDeep(obj[prop])));
  }
  return clone;
}

// 判断是否为空
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || toRawType(value) === "String" || value instanceof String) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (toRawType(value) === "Object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

// 对象深度合并
export function deepMergeObj(obj1, obj2) {
  if (toRawType(obj2) !== "Object") return obj1;

  for (let [key, value] of Object.entries(obj2)) {
    obj1[key] =
      obj1[key] && toRawType(obj1[key]) === "Object" && value && toRawType(value) === "Object"
        ? deepMergeObj(obj1[key], value)
        : (obj1[key] = value);
  }
  return obj1;
}

/**
 * 节流机制 ps: 建议使用lodash工具库
 */
export function throttle(fn, wait = 100) {
  let timer = null;
  return function() {
    let context = this,
      args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}

/**
 * 防抖机制 ps: 建议使用lodash工具库
 */
export function debounce(fn, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate === true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = fn.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = fn.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

// 四舍五入取整
export function round(value, decimals = 0) {
  if (isNaN(value)) {
    return 0;
  }

  decimals = parseInt(decimals, 10) ?? 2;

  let multiplier = Math.pow(10, decimals);
  multiplier = (Math.round(value * multiplier) / multiplier).toFixed(decimals);
  return parseFloat(multiplier);
}

/**
 * @description 获取url地址参数
 */
export function pathToParam(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

// 异步加载js、css
export function loadScript(url, type = "js") {
  let flag = false,
    insert = type === "js" ? "body" : "head";

  return new Promise((resolve) => {
    const insertNode = document.getElementsByTagName(insert)[0];
    Array.from(insertNode.children).forEach((ele) => {
      if ((ele.src || "").indexOf(url) !== -1) {
        flag = true;
        resolve();
      }
    });

    // TODO: 加载一次即可
    if (flag) return;

    let script;
    if (type === "js") {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
    } else if (type === "css") {
      script = document.createElement("link");
      script.rel = "stylesheet";
      script.href = url;
    }

    insertNode.appendChild(script);
    script.onload = function() {
      resolve();
    };
  });
}
