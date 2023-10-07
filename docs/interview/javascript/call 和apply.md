# call 和 apply

> ECMAScript 给 Function 的原型定义了两个方法，它们是 Function.prototype.call 和 Function.prototype.apply。在实际开发中，特别是在一些函数式风格的代码编写中，call 和 apply 方法尤为有用。在 JavaScript 版本的设计模式中，这两个方法的应用也非常广泛，能熟练运用这两个方法，是我们真正成为一名 JavaScript 程序员的重要一步。

## call 和 apply 的区别

1. Function.prototype.call 和 Function.prototype.apply 都是非常常用的方法。它们的作用一模一样，区别仅在于传入参数形式的不同。
2. apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数。

```javascript
var func = function (a, b, c) {
  alert([a, b, c]); // 输出[1, 2, 3]
};
func.apply(null, [1, 2, 3]);
```

<p class="paragraph"> 在这段代码中，参数 1，2，3 被放在数组中一起传入 func 函数，它们分别对应 func 参数列表中的 a, b, c。call 传入的参数数量不固定，跟 apply 相同的是，每一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数；</p>

```javascript
var func = function (a, b, c) {
  alert([a, b, c]); // 输出[1,2,3]
};
func.call(null, 1, 2, 3);
```

1. 当调用一个函数时，JavaScript 的解释器并不会计较形参和实参在数量、类型以及顺序上的区别，JavaScript 的参数在内部就是用一个数组来表示的。从这个意义上说，apply 比 call 的使用率更高，我们不必关心具体有多少参数被传入函数，只要用 apply 一股脑地推过去就可以了。
2. call 是包装在 apply 上面的一颗语法糖，如果我们明确地知道函数接受多少个参数，而且想一目了然地表达形参和实参的对应关系，那么也可以用 call 来传递参数。
3. 当使用 call 或者 apply 的时候，如果我们传入的第一个参数为 null，函数体内的 this 会指向默认的宿主对象，在浏览器中则是 window;

```javascript
var func = function (a, b, c) {
  alert(this === window); // 输出true
};
func.apply(null, [1, 2, 3]);
```

<p class="paragraph"> 但如果在严格模式下，函数体内的 this 还是为 null</p>

```javascript
var func = function (a, b, c) {
  "use strict";
  alert(this === window); // 输出true
};
func.apply(null, [1, 2, 3]);
```

<p class="paragraph"> 有时候我们使用 call 或者 apply 的目的不在于指定 this 指向，而是另有用途，比如借用其他对象的方法。</p>

```javascript
Math.max.apply(null, [1, 2, 5, 3, 4]); // 输出: 5
```

## call 和 apply 的用途

<p class="paragraph">前面说过，能够熟练使用 call 和 apply，是我们真正成为一名 JavaScript 程序员的重要一步，下面来介绍 call 和 apply 在实际开发中的用途。</p><br/>

**1、改变 this 的指向**

<p class="paragraph">call 和 apply 最常见的用途是改变函数内部的 this 指向，我们来看个例子</p>

```javascript
var obj1 = {
  name: "sven",
};
var obj2 = {
  name: "anne",
};
window.name = "window";
var getName = function () {
  alert(this.name);
};
getName(); // 输出window
getName.call(obj1); // 输出sven
getName.call(obj2); // 输出anne
```

<p class="paragraph">当执行 getName.call(obj1)这句代码时，getName 函数体内的 this 就指向 obj1 对象，所以此处的</p>

```javascript
var getName = function () {
  alert(this.name);
};
// 实际上相当于:
var getName = function () {
  alert(obj1.name); // 输出: sven
};
```

在实际开发中，经常会遇到 this 指向被不经意改变的场景，比如有一个 div 节点，div 节点的 onclick 事件中的 this 本来是指向这个 div 的：

```javascript
document.getElementById("div1").onclick = function () {
  alert(this.id); // 输出: div1
};
```

假如该事件函数中有一个内部函数 func，在事件内部调用 func 函数时，func 函数体内的 this 就指向了 window，而不是我们预期的 div,见如下代码：

```javascript
document.getElementById("div1").onclick = function () {
  alert(this.id); // 输出: div1
  var func = function () {
    alert(this.id); // 输出: undefined
  };
  func();
};
```

这时候我们用 call 来修正 func 函数内的 this，使其依然指向 div:

```javascript
document.getElementById("div1").onclick = function () {
  alert(this.id); // 输出: div1
  var func = function () {
    alert(this.id); // 输出: div1
  };
  func.call(this);
};
```

使用 call 来修正 this 的场景，我们并非第一次遇到，代码如下：

```javascript
document.getElementById = (function (func) {
  return function () {
    return func.apply(document, arguments);
  };
})(document.getElementById);
var getId = document.getElementById;
var div = getId("div1");
alert(div.id); // 输出: div1
```

## call 和 apply 自己实现

**call 实现步骤**

1. 首先明确`call`函数是定义在`Function.prototype`上的，为所有`Function`类型的对象所共享。现自定义`Function.prototype.myCall`。

   **传入的参数：**

   (1) `context`表示谁来调用这个函数。

   (2) `...args`用三点运算符直接将后面传入的参数解析成数组；

2. 值为原始值（数字、字符串、布尔值）的 this 会指向原始值的实例对象。

3. 为了避免冲突，这里用了`symbol`；

4. 通过隐式绑定执行函数并传递参数；

5. 删除上下文对象的属性；

6. 返回函数执行结果；

**代码实现如下：**

```javascript
Function.prototype.myCall = function (context, ...args) {
  if (context === null || context === undefined) {
    // 指定为null和undefined的this值会自动指向全局对象(浏览器中为window)
    context = window;
  } else {
    context = Object(context); // 值为原始值（数字，字符串，布尔值）的this会指向该原始值的实例对象
  }
  const specialPrototype = Symbol("特殊属性Symbol"); //用于临时储存函数
  context[specialPrototype] = this; // 函数的this指向隐式绑定到context上
  let result = context[specialPrototype](...args); // 通过隐式绑定执行函数并传递函数
  delete context[specialPrototype]; // 删除上下文对象的属性
  return result; // 返回函数执行结果
};
```

**判断函数的上下文对象**：

很多人判断上下文对象，只是简单的以 context 是否为 false 来判断，比如：

```javascript
// 判断函数上下文绑定到`window`不够严谨
context = context ? Object(context) : window;
context = context || window;
```

经过测试，以下三种为 false 的情况，函数的上下文对象都会绑定到 window 上：

```javascript
// 网上的其他绑定函数上下文对象的方案：context = context || window;
function handle(...params) {
  this.test = "handle";
  console.log("params", this, ...params); // do some thing
}
handle.call(""); // window
handle.call(0); // window
handle.call(false); // window
```

而 call 则将函数的上下文对象会绑定到这些原始值的实例对象上:

```javascript
params String {"", test: "handle"}
params Number {0, test: "handle"}
params Boolean {false, test: "handle"}
```

所以正确的解决方案，应该像上面那么做：

```javascript
// 正确判断函数上下文对象
if (context === null || context === undefined) {
  // 指定为null和undefined的this值会自动指向全局对象(浏览器中为window)
  context = window;
} else {
  context = Object(context); // 值为原始值(数字，字符串、布尔值)的this会指向该原始值的实例对象
}
```

**使用 Symbol 临时储存函数**

尽管之前的属性是 testFn，但不得不承认，还是有限上下文对象的原属性冲突的风险，经网友提醒使用 Symbol 就不会出现冲突了。

**测试代码如下：**

```javascript
let Person = {
  name: "Tom",
  say(age) {
    console.log(this);
    console.log(`我叫${this.name}我今年${age}`);
  },
};

Person1 = {
  name: "Tom1",
};

Person.say.myCall(Person1, 18); // 我叫Tom1我今年18
```

**apply 的实现步骤**

1. 传递给函数的参数处理，不太一样，其他部分跟 call 一样。
2. apply 接收第二个参数为类数组对象，这里用了 JavaScript 权威指南中判断是否为类数组对象的方法。

```javascript
Function.prototype.myApply = function (context,args) {
if (context === null || context === undefined) {
    context = window; //指定为null和undefined时this值会自动指向全局对象(浏览器中为window)
  } else {
    context = Object(context); // 值为原始值（数字、字符串、布尔值）的this会指向原始值的实例对象
  }
  // JavaScript权威指南判断是否为类数组对象
function isArrayLike(o) {
    if (
          o && // o不是null、undefined等
          typeof o === "object" && // o是对象
          isFinite(o.length) && // o.length是有限值
          o.length >= 0 && // o.length为非负值
          o.length === Math.floor(o.length) && // o.length是整数
          o.length < 4294967296
    ) { 
    // o.length < 2 ^32
        return true;
    } else {  return false };
  }
  const specialPrototype = Symbol("特殊属性Symbol"); // 用于临时储存函数
  context[specialPrototype] = this; //隐式绑定this指向到context上
  let args = arguments[1]; // 获取参数数组
  let result;
  // 处理传进来的第二个参数
  if (args) {
    // 是否传递第二个参数
    if (!Array.isArray(args) && !isArrayLike(args)) {
      throw new TypeError(
        "myApply第二个参数不为数组并且不为类数组对象抛出错误"
      );
    } else {
      args = Array.from(args); // 转为数组
      result = context[specialPrototype](...args); // 执行函数并展开数组，传递函数参数
    }
  } else {
    result = context[specialPrototype](); // 执行函数
  }
  delete context[specialPrototype]; // 删除上下文对象的属性
  return result; //返回函数执行结果
};
```

**测试代码如下：**

```javascript
var func = function (a, b, c) {
  console.log(a + b + c); // 输出6
};
func.myApply(null, [1, 2, 3]);
```

简版的 call 和 apply 的实现就算完成了 。
