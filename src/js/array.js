// 数组的方法
// const value = [1, 2, 3];
// console.log(value.toString());
// console.log(value.toLocaleString());
// console.log(value.valueOf());

// const a = new Object([1, 2, 3]);
// console.log(a.toString());
// console.log(Array.prototype.toString.call(a));
// console.log(Object.prototype.toString.call(a));

// const person = {
//   0: "age",
//   1: "name",
//   length: 2,
// };
// console.log([].slice.call(person));
// console.log(Array.from(person));
// console.log(Array.from(person, (x) => "head-" + x));
// console.log(person);

// const color = ["red", "yellow", "blue", "green", "black"];
// console.log(color.splice(1, 2, "orange")); // [ 'yellow', 'blue' ]
// console.log(color); // [ 'red', 'orange', 'green', 'black' ]

// const color = ["red", "yellow", "blue", "green", "black"];
// console.log(color.slice(1, -1));
// console.log(color.slice(3, 4));
// console.log(color.slice(3, 1));
// console.log(color.slice(-2, -1));
// console.log(color);

// 模拟reduce的功能
const nums = [1, 3, 5, 7];
const res = nums.reduce((pre, current, index, arr) => {
  console.log(pre, current, index, arr);
  return pre + current;
}, 0);
console.log(res);
function reduceAction(arr, func, initValue) {
  let originArr = arr.slice();
  let newArr = (typeof initValue !== "undefined" ? [initValue] : []).concat(
    originArr
  );
  let index = 0;
  while (newArr.length > 1) {
    newArr.splice(0, 2, func(newArr[0], newArr[1], index++, originArr));
  }
  return newArr[0];
}
console.log(
  reduceAction(
    nums,
    (pre, current, index, arr) => {
      console.log(pre, current, index, arr);
      return pre + current;
    },
    0
  )
);
