let mult = function () {
  console.log("我在计算！");
  let a = 1;
  for (let i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};

let proxyMult = (function () {
  let cache = {};
  return function () {
    let args = Array.prototype.join.call(arguments, ",");
    // 根据参数的拼接方式决定属性名称，1,2,3
    // 使用 in 会从对象或者原型中查找
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = mult.apply(this, arguments));
  };
})();
console.log(proxyMult(1, 2, 3));
console.log(proxyMult(1, 2, 3));
// function getName () {
//     console.log(name)
// }
// getName();
// var name;
showName()
var showName = function() {
    console.log(2)
}
function showName() {
    console.log(1)
}

// function showName() {
//     console.log(1)
// }
// var showName;
// showName()
