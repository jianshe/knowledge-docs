# 深入理解 javascript 原型和闭包—函数和对象的关系

> 函数是一种对象，但是函数却不像数组一样--你可以说数组是对象的一种，因为数组就像是对象的一个子集一样。但是函数与对象之间，却不仅仅是一种包含和被包含的关系，函数和对象之间的关系比较复杂，甚至有一点鸡生蛋蛋生鸡的逻辑

## 对象都是通过函数来创建的

有些人可能反驳：不对！因为：

```javascript
var obj = { a: 10, b: 20 };
var arr = [5, "x", true];
```

但是这只是一种“快捷方式“，在编程语言中，一般叫做”语法糖“。

其实以上代码的本质是：

```javascript
var obj = new Object();
obj.a = 10;
obj.b = 20;

var arr = new Array();
arr[0] = 5;
arr[1] = "x";
arr[2] = true;
```

其中的 Object 和 Array 都是函数：

```javascript
console.log(typeof Object); // function
console.log(typeof Array); // function
```

所以，可以这样说--**对象都是通过函数来创建的**

> 对象是函数创建的，而函数却又是一种对象，那函数和对象到底是什么关系呢？下节会重点讲述 prototype 原型
