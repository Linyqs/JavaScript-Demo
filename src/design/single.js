/**
 * @description 1. 标准单例模型
 */
function singleModel() {
  let single = function singleObj(name) {
    this.name = name; 
    this.instance = null; // 初始实例为空null
  }
  single.prototype.getName = function() {
    console.log(this.name); // 打印name属性
  };
  single.getInstance = function(name) {
    if(!this.instance) {
      this.instance == new single(name);
    }
    return this.instance;
  };
  let cat = single.getInstance("cat");
  let dog = single.getInstance("dog");
  console.log(cat === dog);
}
// singleModel();

/**
 * @description 2. 透明单例模型
 */
function transparentSingleModel() {
  // 获取实例
  let Animal = (function() {
    let instance = null;  // 产生闭包
    let getInstance = function(name) {
      if(!instance) {
        this.name = name;
        this.getName(); // 可以是做其他的事
        return instance = this;
      }
      return instance;
    }
    Animal.prototype.getName = function() {
      console.log(this.name); 
    };
    return getInstance;
  })() // 匿名函数
  let cat = new Animal("cat");
  let dog = new Animal("dog");
  console.log(cat === dog)
}
// transparentSingleModel();

/**
 * @description 3. 代理单例模式
 */
function proxySingleModal() {
  let Animal = function(name) { // 全部归到Animal类中处理
    this.name = name;
    this.getName();
  }
  Animal.prototype.getName = function() {
    console.log(this.name);
  }
  let proxyAnimal = (function(name) { // 仅负责获取实例
    let instance = null;
    return function(name) {
      if(!instance) {
        instance = new Animal(name);
      }
      return instance;
    }
  })();
  let cat = new proxyAnimal("cat");
  let dog = new proxyAnimal("dog");
  console.log(cat === dog)
}
// proxySingleModal();

/**
 * @description 命名空间使用
 */
function useNamespace() {
  let App = {};
  App.namespace = function(name) {
    let parts = name.split('.'); 
    let current = App;
    for(let i in parts) {
      if(!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
  }
  App.namespace("dom.style");
  console.log(App)
}
// useNamespace();

/**
 * @description 闭包
 */
function closure() {
  let animal = (function(){
    let name = "cat";
    return { getAnimal : function() {
      return name;
    }}
  })()
  console.log(animal.getAnimal(), animal.name)
}
closure()