/** 算法集锦 **/

// 1 数组相关
const arr = [
  { area: "GZ", name: "YZW", age: 27 },
  { area: "GZ", name: "TYJ", age: 25 },
  { area: "SZ", name: "AAA", age: 23 },
  { area: "FS", name: "BBB", age: 21 },
  { area: "SZ", name: "CCC", age: 19 }
];
// 分组统计
function group(list, groupName) {
  return list.reduce((pre, cur) => {
    if (pre[cur[groupName]]) {
      pre[cur[groupName]].push(cur)
    } else {
      pre[cur[groupName]] = [cur]
    }
    return pre
  }, {})
}
// console.log(group(arr, "area"));  // { GZ: Array(2), SZ: Array(2), FS: Array(1) }
// 数组转对象
function list2obj(list) {
  return list.reduce((pre, cur) => {
    pre[cur.name] = cur
    return pre
  }, {})
}
// console.log(list2obj(arr))

// 扁平化
function flat(list) {
  return list.reduce((pre,cur) => {
    return Array.isArray(cur) ? pre.concat(flat(cur)) : [...pre, cur]
  }, [])
}
// console.log(flat([[1,2], 5,6,[[7,8],9], 4]))

// 和最大的连续子序列
function getMax(list) {
  let ret = 0
  let tmp = 0
  for(let i = 0; i < list.length; i++) {
    const cur = list[i];
    if (tmp < 0) {
      tmp = cur
    } else {
      tmp +=cur
    }
    if (tmp > ret) {
      ret = tmp
    }
  }
  return ret
}
// console.log(getMax([1,-2,-1,3,-2,-2, 5, -1,-5]))
// console.log(getMax([6,-3,-2,7,-15,1,2,2]))

// 快排
function quickSort(list) {
  if (list.length < 2) {
    return list
  }
  const left = []
  const right = []
  const middleIndex = Math.floor(list.length / 2)
  const middle = list.splice(middleIndex, 1)
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item < middle) {
      left.push(item)
    } else {
      right.push(item)
    }
  }
  return quickSort(left).concat(middle, quickSort(right))
}

// console.log(quickSort([1,2,4,6,9,8,5,13,10,3,7]))

// 在arr中获取和为S的两个数字
function getTotal(arr, sum) {
  const ret = []
  // for (let i = 0; i < arr.length; i++) {
  //   for(let j = i + 1; j < arr.length; j++) {
  //     if (arr[i] + arr[j] === sum && arr[i] < arr[j]) {
  //       ret.push([arr[i], arr[j]])
  //     }
  //   }
  // }
  arr.reduce((pre, cur) => {
    const next = sum - cur
    if (!pre[next]) {
      pre[cur] = 1
    } else {
      ret.push([next, cur])
    }
    return pre
  }, {})
  return ret
}
// console.log(getTotal([2,3,5,1,4,8,7,9], 10))







// 2 二叉树（树）相关
// 反转二叉树
function reversal(tree) {
  if (!tree.left && !tree.right) {
    return tree
  }
  const right = tree.right
  const left = tree.left
  let hasChange = false
  if (left) {
    tree.right = reversal(left)
    hasChange = true
    delete tree.left
  }
  if (right) {
    tree.left = reversal(right)
    if (!hasChange) {
      delete tree.right
    }
  }
  return tree
}
// console.log(reversal({value: 1, left: {value:11, left: {value: 111}, right: {value: 2222}}}))

// 获取二叉树层级
function getLevels(tree) {
  if (!tree) {
    return 0
  }
  const leftLevels = getLevels(tree.left)
  const rightLevels = getLevels(tree.right)
  return Math.max(leftLevels, rightLevels) + 1
}
// console.log(getLevels({value:1, left: {value:1,left:{value: 2, right: {value:1}}}}))

// 是否是平衡二叉树
function isBalanceTree(tree) {
  if(!tree) {
    return true
  }
  if (!tree.left && !tree.right) {
    return true
  }
  return Math.abs(getLevels(tree.left) - getLevels(tree.right)) < 2
}
// console.log(isBalanceTree({value: 0, left: {value:1, left: {value:2, left: {value: 3}}}}))

// 对称二叉树判断
function isMirror(tree) {
  if (!tree) {
    return true
  }
  const check = (left, right) => {
    if (!left && !right) {
      return true
    }
    if (left && right) {
      return left.value === right.value && check(left.left, right.right) && check(left.right, right.left)
    }
    return false
  }
  return check(tree.left, tree.right)
}
console.log(isMirror({value:1, left: {value: 1}, right: {value:1}}))




// 3 字符串相关
// 最长不重复子串
function getMaxLenSub(str) {
  let ret = str[0]
  let tmp = ret;
  for (let i = 1; i< str.length; i++) {
    const char = str[i]
    const index = tmp.indexOf(char)
    if (index === -1) {
      tmp += char;
    } else {
      tmp = tmp.substring(index + 1) + char
    }
    if (tmp.length > ret.length) {
      ret = tmp
    }
  }
  return ret
}
// console.log(getMaxLenSub('abcadefab'))




// 4 其他
const matrix = [
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12],
  [13,14,15,16]
]
// 顺时针打印矩阵
function clockwisePrint(matrix) {
  const res = [];
  // 定义行、列
  // 可能是空数组，所以加一个'?'
  const [row, col] = [matrix.length, matrix[0]?.length];
  if (!row || !col) return res;
  // 初始化：左、右、上、下
  let [left, right, up, down] = [0, col - 1, 0, row - 1];

  while (true) {
    // 访问上边，从左到右，访问完毕后，up++
    for (let i = left; i <= right; i++) res.push(matrix[up][i]);
    up++;
    // 若up比down大，说明都访问完了，退出
    if (up > down) break;

    for (let i = up; i <= down; i++) res.push(matrix[i][right]);
    right--;
    if (right < left) break;

    for (let i = right; i >= left; i--) res.push(matrix[down][i]);
    down--;
    if (down < up) break;

    for (let i = down; i >= up; i--) res.push(matrix[i][left]);
    left++;
    if (left > right) break;
  }
  return res;
}
// console.log(clockwisePrint(matrix))


// 求和
function sum(n) {
  return n === 1 ? 1 : n + sum(n-1)
}
// console.log(sum(5))

// Promise.all
function promiseAll(promises){
  const ret = [];
  return new Promise((resolve, reject) => {
    promises.forEach((fn, index) => {
      fn().then(data => {
        ret[index] = data;
        if (ret.length === promises.length) {
          resolve(ret)
        }
      }, (err) => {
        reject(err);
      })
    })
  })
}

promiseAll([]).then(data => {
  console.log(data)
})


