#### JavaScript设计模式

#### 1. 单例模型

**定义：**保证一个类仅有一个实例，并提供一个访问它的全局访问点

**应用场景：**当有些对象只需要一个的时候，不想被多次重复创建，比如线程池、全局缓存、浏览器中的window对象等。
单例模型根据具体的实现方式不同，又有以下几种划分：

##### （1）标准单例模型

```
/**
 * @description 标准单例模型
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
```
这种就是简单判断是否已经有了实例，有则返回，没有则创建。
**缺点：**使用single.getInstance创建实例，相比于new的方式还不够直白，不够透明化。

##### (2) 透明的单例模式
```
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
```

**缺点：**这种写法会产生闭包和匿名函数，增加了复杂度。可以发现，和标准单例模式不同的是：在getInstance中多做了其他操作:设置`name`且执行`getName`方法，但是我们写的函数最好要保证职责要单一。

##### (3) 代理实现单例模式

```
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
```

我们可以采用引入代理，拆分出`普通的类`和获取实例的`代理函数`，将职能拆分出去，便于代码的维护。

##### (4)JS中的单例模型

**需要注意的是：**

> 全局变量不是单例模式

我们要尽量少的使用全局变量，减少全局命名空间污染，有两种方式可以减少全局变量污染：

**① 使用命名空间**

```
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
  console.log(App) // { dom: { style: {} } }
}
```

**② 使用闭包**

```
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
```

通过暴露方法，来暴露变量，外部也无法访问内部的name


#### 2. 策略模式

定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

