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

**定义：**定义一系列的算法，把它们一个个封装成策略类，并且使它们可以相互替换。

```
/**
 * 根据级别获取对应的奖励
 */
function getScoreBonus() {
  let strategies = {
    'A': function(base){
      return base * 3
    },
    'B': function(base){
      return base * 2
    },
    'C': function(base){
      return base * 1
    }
  }
  function calculateBonus(base, type) {
    return strategies[type](base);
  }
  console.log(calculateBonus(100, "A"));
  console.log(calculateBonus(100, "B"));
}
```

策略模式还可以用来实现动画效果，比如根据原始位置，目标位置，执行时间，方向等需要一系列参数计算出最后的结果；还可以用来做表单验证：

```
/**
 * 策略模式的表单验证
 */
function form() {
  // 校验规则
  let strategries = {
    checkEmpty: function(value, errMsg) { // 检查空值
      if(value === '') {
        return `${value}:${errMsg}`;
      }
    },
    checkLength: function(value, length, errMsg) { // 检验长度
      if(value.length < length) {
        return `${value}:${errMsg}`;
      }
    },
    isMobile: function(value, errMsg) {
      if(!/(^1[3|5|8][0-9]{9}$)/.test(value)) { // 检查手机号
        return `${value}:${errMsg}`;
      }
    }
  }
  var validator = function() { 
    this.cache = [];  // 存储检验方法
  }
  // 添加验证项
  validator.prototype.add = function(value, rules) {
    var self = this;             
    for ( var i = 0, rule; rule = rules[ i++ ]; ){ 
      (function(rule) {
        var arr = rule.strategy.split(":");
        self.cache.push(function() {
          let strategy = arr.shift();
          arr.unshift(value);
          arr.push(rule.errorMsg);
          return strategries[strategy].apply(value, arr)
        })
      })(rule);
    }
  }
  // 检验所有项
  validator.prototype.check = function() {
    let errorArr = [];
    for(let i = 0, func; func = this.cache[i++];) {
      let msg = func();
      if(msg) {
        errorArr.push(msg);
      }
    }
    return errorArr;
  }
  // 校验
  let validateObj = new validator();
  validateObj.add("12345", [{strategy: "isMobile", errorMsg: "手机格式错误"}]);
  validateObj.add("张翠山", [{strategy: "checkLength:2", errorMsg: "长度最少2位"}]);
  validateObj.add("", [{strategy: "checkEmpty", errorMsg: "不能为空"}]);
  var errorMsg = validateObj.check();    // 获得校验结果    
  console.log(...errorMsg);
}
```

做法解析：先制定校验的一些规则，即策略，添加自定义的校验项，当检验规则发生变化时，更改代码会更简洁

优点：

- 避免多重条件选择语句；
- 具体的算法封装到策略中，使得代码简洁易懂；
- 可复用性高

缺点：

- 在代码中增加了许多策略，必须要了解所有的策略；

#### 3.代理模式

定义：为一个对象提供一个代用品或占位符，以便控制对它的访问。

比如明星的经纪人就是一种代理，代理明星谈合同和安排商业活动。

代理模式又分为以下几种：

- **保护代理**

  用于控制不同权限的对象对目标对象的访问，帮助对象过滤一些条件和请求；

- **虚拟代理**

  把一些开销很大的对象，延迟到真正需要它的时候创建；

由于我们无法判断谁访问了某个对象，所以保护代理不容易实现，使用比较多的则是虚拟代理。

**使用虚拟代理可以实现图片预加载的功能：**

```
// 背景图片设置
    let img = (function () {
      let imgNode = document.createElement("img");
      document.body.appendChild(imgNode);
      return {
        setSrc: function (src) {
          imgNode.src = src;
        },
      };
    })();

    let proxyImg = (function () {
      let proxy_img = new Image();
      // 等待加载完成，获取资源后再渲染
      proxy_img.onload = function () {
        img.setSrc(this.src);
      };
      return {
        setSrc: function (src) {
          // 设置为本地加载图片
          img.setSrc("../pictures/animal.jpg");
          proxy_img.src = src;
        },
      };
    })();
    proxyImg.setSrc(
     "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=938935733,3477631526&fm=26&gp=0.jpg"
    );
```

**除了可以实现图片预加载的功能，还能合并http请求**

比如有多个选项，每点击一个选项则需要发起http请求，那么在短时间内，一直点击，则会对服务器造成一定的压力，那么此时就可以使用合并的方式，比如在每间隔3秒合并请求一次。

```
// 此处假装请求服务器
    let request = function (id) {
      console.log(`receive from ${id}`);
    };
    let checkAction = (function () {
      let idCache = [], // 此处产生了闭包
        timer;
      return function (id) {
        idCache.push(id);
        // 如果还在本次间隔期内的请求，则只添加到缓存数组
        if (timer) {
          return;
        }
        timer = setTimeout(() => {
          request(idCache.join()); // 请求数据
          clearTimeout(timer); // 清空计时器
          timer = null;
          caches.length = 0; // 清空缓存
        }, 3000);
      };
    })();
    let checkbox = document.getElementsByTagName("input");
    for (let item of checkbox) {
      item.onclick = function () {
        if (this.checked) {
          checkAction(this.id);
        }
      };
    }
```

- **缓存代理**

缓存代理，可以为一些复杂的计算缓存值，举个例子，假装累乘是个复杂的操作

```
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
```

运行结果：

```
我在计算！
6
6
```

可以发现同样的参数，实际上就只会被计算一次。同样的道理，同一个页面的数据，也可以通过缓存代理缓存起来，通过调用异步函数之后，在回调函数中缓存数据。

#### 4. 迭代器模式

**定义：**提供一种方法顺序访问一个聚合对象中的各个元素，而不需要暴露该对选哪个的内部表示。

迭代器可以分为两种：

- **内部迭代器**

比如像jquery中的each，js数组的forEach，外界不需要关心迭代器内部的实现，调用就完事了，但是局限是，这个迭代方式被约定好了，跟迭代器的交互也仅仅是一次初始的调用，比如foEach就只能迭代一个数组。

- **外部迭代器**

外部迭代器必须显示地请求迭代下一个元素，就是可以手动请求下一个元素

使用js实现一个迭代器：

```
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
```

除此之外，迭代器还可以迭代类数组对象，比如arguments, {"0":'a', "1": 'b'}，无论是内部迭代器还是外部迭代器，只要被迭代的聚合对象有length属性且可下标访问，就可以被迭代。

#### 5. 发布-订阅模式(观察者模式)

**定义：**定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知。

在js中一般有事件模型来替代订阅模式。

作用：

（1）广泛应用于异步编程中，一种替代传递回调函数的方案，比如订阅ajax请求的error，success等时间，无须关注对象在异步运行期间的内部状态，只关心想要接收的事件的发生点。

（2）可以取代对象之间编码的通知机制，一个对象不用显示地调用另一个对象的接口，降低耦合度。

DOM事件也是使用发布-订阅模式，比如用户点击了某个按钮，我们只需要注册点击事件，等待用户点击了再触发事件。使用`addEventListener`还能随意增加或者删除订阅者。

自定义发布订阅模式

```

```



















