let obj = {
  name: "a",
  age: 12,
};
function change(obj, age) {
  age = 13;
  obj.age = age;
}
console.log(obj);
change(obj);
console.log(obj);
