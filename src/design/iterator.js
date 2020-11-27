let Iterator = function (obj) {
  let current = 0;
  // 将索引指向下一个
  let next = () => (next += 1);
  // 判断是否已经取道了最后一个
  let isDone = () => current >= obj.length;
  let getCurrentItem = function () {
    return obj[current];
  };
  return {
    next,
    isDone,
    getCurrentItem,
  };
};
// 判断两个对象所有位置上对应的元素是否都相等
let compare = function (iterator1, iterator2) {
  while (!iterator1.isDone && !iterator2.isDone) {
    if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
      throw new Error("不相等");
      break;
    }
    iterator1.next();
    iterator2.next();
  }
  console.log("相等");
};
let iterator1 = new Iterator([1, 2, 3]);
let iterator2 = new Iterator([1, 2, 3]);
compare(iterator1, iterator2);
