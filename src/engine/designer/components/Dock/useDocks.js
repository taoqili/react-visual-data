export default (docks = [], horizontal) => {
  const ret = {
    leftDocks: [],
    centerDocks: [],
    rightDocks: []
  }
  if (!horizontal) {
    ret.leftDocks = docks;
    return ret
  }
  docks.forEach(item => {
    if (item.place === 'center') {
      ret.centerDocks.push(item)
    } else if (item.place === 'right') {
      ret.rightDocks.push(item)
    } else {
      ret.leftDocks.push(item)
    }
  })
  return ret
}
