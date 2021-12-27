
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
