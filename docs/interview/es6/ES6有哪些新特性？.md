# ES6 有哪些新特性？

## 关于 ES6 和 JavaScript 的关系

1. ES6 是关于 ES2015+的俗称，也可以说是通常叫法，那么，ES6 是什么呢？
   ES 全称是 ECMAScript，它是 JavaScript 基础构建的一种语言，JavaScript 正是建立在 ECMAScript 语言的基础规范中建立使用的，那么，ECMAScript 的使用，对于 JavaScript 至关重要！  
   在我的理解中，ECMAScript 是一种语言层面的东西，它只是定义了 JavaScript 以及在它基础之上建立的其他语言的语法规范，而 JavaScript 的语言，更关于一种平台性质在其中。  
   JavaScript 包括 ECMAScript、DOM、BOM 三个组成部分，DOM 和 BOM 是 web API 提供的接口或者是 JavaScript 和浏览器之间进行交互的部分，实质就是操纵文档元素，进行展示布局，而 ECMAScript 在 JavaScript 中其中语法的作用，它不会去跟文档有直接的关系，但是他的数据处理完成后会通过 web API 展示在文档中

## ES6 新特性的分类

新特性主要归为四大类：

- 解决原有语法上的一些不足
  比如 let 和 const 的块级作用域

- 对原有语法进行增强
  比如解构、展开、参数默认值、模板字符串

- 全新的对象、全新的方法、全新的功能
  比如 promise、proxy、object 的 assign、is

- 全新的数据类型和数据结构
  比如 symbol、set、map

下面具体进行介绍

## 1. let、const 块级作用域以及和 var 的区别

- let、const 声明的变量，在 for，if 语句中，会形成块级作用域，块级作用域内的变量，不能被作用域外部使用
- let、const 声明变量不再会有声明提升，在变量声明之前使用运行时会报错

```javascript
//块级作用域一级块级作用域的使用
if (true) {
  const param = "param in if block";
  console.log(param); //param in if block
}
console.log(param); //块级作用域外访问内部定义的变量，ReferenceError: param is not defined
```

- 块级作用域声明变量，会出现“暂时性死区”，块级作用域声明变量前使用变量，将会报错

```javascript
// 暂时性死区
const i = 100;
if (i) {
  console.log(i); //ReferenceError: Cannot access 'i' before initialization
  const i = 1000;
}
```

- const 声明的是一个常量，声明必须初始化

```javascript

    // const常量声明必须初始化
    const i;
    i = 10;
    console.log(i) //SyntaxError: Missing initializer in const declaration

```

- 如果 const 声明的是基本类型常量，初始化之后不能修改；引用类型的常量，可以修改其成员变量；

```javascript
// 基本类型常量不能修改，引用类型常量能修改属性
const str = "str";
str = "str1"; //TypeError: Assignment to constant variable.

const arr = [1, 2, 3];
arr[0] = 100;
console.log(arr[0]); //100
```

- 和 var 的区别

| 声明方式 | 变量提升 | 作用域 | 初始值 | 重复定义 |
| :------- | :------- | :----- | ------ | -------- |
| var      | 是       | 函数级 | 不需要 | 允许     |
| let      | 否       | 块级   | 不需要 | 不允许   |
| const    | 否       | 块级   | 必需   | 不允许   |

## 2.解构-快速提取数组/对象中的元素

- 数组解构
- 单独解构-根据数组索引，将数组解构成单独的元素

```javascript
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c); //1,2,3
const [, , d] = arr;
console.log(d); //3
```

- 默认值，解构时可以给变量设置默认值，数组没有这个元素的话

```javascript
const arr = [1, 2, 3];

const [, , , defaultVal = "4"] = arr;
console.log("设置默认值", defaultVal);
```

- 剩余解构-用 "...+变量名" 解构剩余参数到新数组，只能用一次

```javascript
const arr = [1, 2, 3];

const [e, ...rest] = arr;
console.log(rest); //[2, 3]
```

- 实例应用

```javascript
// 拆分字符串
const str = "xiaobai/18/200";
const strArr = str.split("/");
const [, age] = strArr;
console.log(age); //18
```

- 对象解构
- 单个/多个解构-跟数组解构差不多

```javascript
const obj = { name: "xiaohui", age: 18, height: undefined };
const { name, age } = obj;
console.log(name, age); // 'xiaohui', 18
```

- 解构+重命名-给解构出来的变量重命名

```javascript
const obj = { name: "xiaohui", age: 18, height: undefined };
const { name: objName } = obj;
console.log(objName);
```

- 默认值-给解构变量设置默认值

```javascript
const obj = { name: "xiaohui", age: 18, height: undefined };
const { next = "default" } = obj;
console.log(next);
```

## 3.模板字符串

用法：使用``将字符串包裹起来

功能：可以换行、插值、使用标签函数进行字符串操作

示例：

- 换行/插值

```javascript
//换行
const str = `fdsjak
    fdsa`;
console.log(str);

// 插值
const strs = `random: ${Math.random()}`;
console.log(strs);
```

- 标签函数-可以对模板字符串的字符串和插值进行处理和过滤等操作

```javascript
/**
 * 字符串模板函数
 * @param {array} strs 以插值为分隔符组成的字符串数组
 * @param {string} name 插值的value，有多少个就会传入多少个
 */
const tagFunc = (strs, name, gender) => {
  const [str1, str2, str3] = strs;
  const genderParsed = gender == "1" ? "男" : "女";
  // 可以在此做过滤，字符串处理，多语言等操作
  return str1 + name + str2 + str3 + genderParsed;
};

// 带标签的模板字符串,
const person = {
  name: "xiaohui",
  gender: 1,
};
// 返回值为标签函数的返回值
const result = tagFunc`my name is ${person.name}.gender is ${person.gender}`;
console.log(result); //my name is xiaohui.gender is 男
```

## 字符串扩展方法

- includes-是否包含
- startsWith-是否以什么开始
- endsWith-是否以什么结束

```javascript
const str = "abcd";

console.log(str.includes("e")); //false
console.log(str.startsWith("a")); //true
console.log(str.endsWith("a")); //false
```

## 5.参数默认值&剩余参数

- 给函数形参设置默认值

```javascript
// 带默认参数的形参一般放在后面，减少传参导致的错误几率
const defaultParams = function (name, age = 0) {
  return [age, name];
};
console.log(defaultParams(1));
```

- 使用...rest 形式设置剩余形参，支持无限参数

```javascript
// 剩余参数，转化成数组
const restParams = function (...args) {
  console.log(args.toString()); //1, 2, 3, 4, 5
};

restParams(1, 2, 3, 4, 5);
```

## 6. 展开数组

使用...将数组展开

```javascript
const arr = [1, 2, 3];

console.log(...arr);
// 等价于es5中以下写法
console.log.apply(console, arr);
```

## 7.箭头函数

特性&优势：

- 简化了函数的写法
- 没有 this 机制，this 继承自上一个函数的上下文，如果上一层没有函数，则指向 window
- 作为异步回调函数时，可解决 this 指向问题

```javascript
const inc = (n) => n + 1;
console.log(inc(100));

const obj = {
  name: "aa",
  func() {
    setTimeout(() => {
      console.log(this.name); //aa
    }, 0);
    setTimeout(function () {
      console.log(this.name); //undefined
    }, 0);
  },
};
obj.func();
```

## 8.对象字面量增强

- 同名属性可以省略 key:value 形式，直接 key，
- 函数可以省略 key：value 形式
- 可以直接 func(),
- 可以使用计算属性，比如：\{\[Math.random()]: value\}

```javascript
/**
 * 1、增强了对象字面量：
 * 1，同名属性可以省略key:value形式，直接key，
 * 2，函数可以省略key：value形式
 * 3，可以直接func(),
 * 4，可以使用计算属性，比如：{[Math.random()]: value}
 */
const arr = [1, 2, 3];
const obj = {
  arr,
  func() {
    console.log(this.arr);
  },
  [Math.random()]: arr,
};

console.log(obj);
```

## 9.Object.assign(target1, target2, targetN)-复制/合并对象

```javascript
/**
 * Object.assign(target1, target2, ...targetn)
 * 后面的属性向前面的属性合并
 * 如果target1是空对象，可以创建一个全新对象，而不是对象引用
 */
const obj1 = {
  a: 1,
  b: 2,
};
const obj2 = {
  a: 1,
  b: 2,
};

const obj3 = Object.assign({}, obj1);
obj3.a = 5;
console.log(obj3, obj2, obj1);
```

## 10.Object.is(value1, value2)

作用：比较两个值是否相等

特性：

- 没有隐式转换
- 可以比较+0,-0、NaN

```javascript
console.log(NaN === NaN); //false
console.log(Object.is(NaN, NaN)); //true
console.log(0 === -0); // true
console.log(Object.is(0, -0)); //false
console.log(Object.is(1, 1)); //true
```

## 11.Proxy(object, handler)

作用：

代理一个对象的所有，包括读写操作和各种操作的监听  
用法：

```javascript
const P = {
  n: "p",
  a: 19,
};

const proxy = new Proxy(P, {
  get(target, property) {
    console.log(target, property);
    return property in target ? target[property] : null;
  },
  defineProperty(target, property, attrs) {
    console.log(target, property, attrs);
    //   throw new Error('不允许修改')
  },
  deleteProperty(target, property) {
    console.log(target, property);
    delete target[property];
  },
  set(target, property, value) {
    target[property] = value;
  },
});

proxy.c = 100;
console.log("pp", P);
```

与 Object.definePropert 对比

优势：

- 拥有很多 defineProperty 没有的属性方法，比如：
  - handler.getPrototypeOf() ---Object.getPrototypeOf 方法的监听器
  - handler.setPrototypeOf() ---Object.setPrototypeOf 方法的监听器。
  - handler.isExtensible() ---Object.isExtensible 方法的监听器。
  - handler.preventExtensions() ---Object.preventExtensions 方法的监听器。
  - handler.getOwnPropertyDescriptor() ---Object.getOwnPropertyDescriptor 方法的监听器。
  - handler.defineProperty() ---Object.defineProperty 方法的监听器。
  - handler.has() ---in 操作符的监听器。
  - handler.get() ---属性读取操作的监听器。
  - handler.set() ---属性设置操作的监听器。
  - handler.deleteProperty() ---delete 操作符的监听器
  - handler.ownKeys() ---Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols 方法的监听器。
  - handler.apply() ---函数调用操作的监听器。
  - handler.construct() ---new 操作符的监听器。
- 对数组的监视更方便
- 以非侵入的访视监管对象的读写

## 12.Reflect

作用：

集成 Object 操作的所有方法，统一、方便，具体方法如下：

用于对对象的统一操作，集成 Object 相关的所有方法

1. apply：类似 Function.prototype.appl1.
2. Reflect.construct()

对构造函数进行 new 操作，相当于执行 new target(...args)。

3. Reflect.defineProperty()

和 Object.defineProperty() 类似。

4. Reflect.deleteProperty()

作为函数的 delete 操作符，相当于执行 delete target[name]。

5. Reflect.get()

获取对象身上某个属性的值，类似于 target[name]。

6. Reflect.getOwnPropertyDescriptor()

类似于 Object.getOwnPropertyDescriptor()。 7. Reflect.getPrototypeOf()

类似于 Object.getPrototypeOf(), 获取目标对象的原型。

8. Reflect.has()

判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。

9. Reflect.isExtensible()

类似于 Object.isExtensible().判断对象是否可扩展，可以添加额外属性

Object.seal(封闭对象)， Object.freeze（冻结对象）是不可扩展的

10. Reflect.ownKeys()

返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受 enumerable 影响).

11. Reflect.preventExtensions()

类似于 Object.preventExtensions()。返回一个 Boolean。

12. Reflect.set()

将值分配给属性的函数。返回一个 Boolean，如果更新成功，则返回 true, 反之返回 false。

14. Reflect.setPrototypeOf()

类似于 Object.setPrototypeOf()。

示例：

```javascript
const obj = {
  name: "reflect",
};
Reflect.preventExtensions(obj); //禁止扩展
console.log(Reflect.set(obj, "age", "xiaobai")); //false
console.log(obj); //{ name: 'reflect' }
console.log(Reflect.isExtensible(obj, "name")); //false
console.log(Reflect.ownKeys(obj)); //[ 'name' ]
```

## 13.Promise

作用：解决异步编程中回调嵌套过深问题

## 14.class&静态方法&继承

定义

- 使用 class 关键字定义类

```javascript
class Person {
  constructor(props) {
    this.props = props;
  }
}
```

方法

- 实例方法，需要实例化之后才能调用，this 指向实例
- 静态方法，用 static 修饰符修饰，可以直接通过类名调用，不需要实例化，this 不指向实例，而是指向当前类

```javascript
class Person {
  constructor(props) {
    this.props = props;
  }
  // 实例方法
  eat() {}
  // 静态方法
  static run() {}
}
// 调用静态方法
Person.run();
const person = new Person("props");
// 调用实例方法
person.eat();
```

继承：子类使用 extends 关键字实现继承，可以继承父类所有属性

```javascript
class Student extends Person {
  constructor(props) {
    super(props);
  }
  printProps() {
    console.log(this.props);
  }
}

const student = new Student("student");
student.printProps();
```

## 15.Set

说明：

Set 是一种类似于数组的数据结构

特性：

- 元素唯一性，不允许重复元素
- 使用 add 增加重复元素，将会被忽略

用途：

- 数组去重
- 数据存储

```javascript
const arr = [1, 3, 1, 1, 1];
const set = new Set(arr);
set.add(1).add(1);
console.log(set.size); //2
const newArr = Array.from(set);
console.log(newArr); //[ 1, 3 ]
```

## 16.Map

说明：

类似 Object，以 key、value 形式存储数据

区别：

Map 键不会隐式转换成字符串，而是保持原有类型

实例：

```javascript
const map = new Map();
map.set(1, 1);
map.set("name", "map");
map.set(obj, obj);
console.log(map.get(1)); //1
/**
        1 1
        name map
        { '1': 1, true: true, a: 'a' } { '1': 1, true: true, a: 'a' }
     */
map.forEach((val, key) => {
  console.log(key, val);
});
```

## 17.Symbol

说明：

JavaScript 第六种原始数据类型，用来定义一个唯一的变量

作用：

- 创建唯一的变量，解决对象键名重复问题
- 为对象、类、函数等创建私有属性
- 修改对象的 toString 标签
- 为对象添加迭代器属性

如何获取对象的 symbol 属性？

- Object.getOwnPropertySymbols(object)
  实例

```javascript
// 对象属性重名问题；
const objSymbol = {
  [Symbol()]: 1,
  [Symbol()]: 2,
};
console.log(objSymbol);

// 2、为对象、类、函数等创建私有属性
const name = Symbol();
const obj2 = {
  [name]: "symbol",
  testPrivate() {
    console.log(this[name]);
  },
};

obj2.testPrivate();
// 定义toString标签；
console.log(obj2.toString());
obj2[Symbol.toStringTag] = "xx";
console.log(obj2.toString()); //[object xx]
```

## 18.for...of...

用途：

已统一的方式，遍历所有引用数据类型

特性：

可以随时使用 break 终止遍历，而 forEach 不行

实例：

```javascript
// 基本用法
// 遍历数组
const arr = [1, 2, 3, 4];
for (const item of arr) {
  if (item > 3) {
    break;
  }
  if (item > 2) {
    console.log(item);
  }
}

// 遍历set
const set = new Set();
set.add("foo").add("bar");
for (const item of set) {
  console.log("set for of", item);
}
// 遍历map
const map = new Map();
map.set("foo", "one").set("bar", "two");
for (const [key, val] of map) {
  console.log("for of map", key, val);
}
//迭代对象
const obj = {
  name: "xiaohui",
  age: "10",
  store: [1, 2, 3],
  // 实现可迭代的接口
  [Symbol.iterator]: function () {
    const params = [this.name, this.age, this.store];
    let index = 0;
    return {
      next() {
        const ret = {
          value: params[index],
          done: index >= params.length,
        };
        index++;
        return ret;
      },
    };
  },
};

for (const item of obj) {
  console.log("obj for of", item);
}
```

## 20.Generator 生成器

- Generator
- 函数前添加 \*，生成一个生成器
- 一般配合 yield 关键字使用
- 最大特点，惰性执行，调 next 才会往下执行
- 主要用来解决异步回调过深的问题

```javascript
// 生成迭代器方法
//  生成器Generator的应用

function* createIdGenerator() {
  let id = 1;
  while (id < 3) yield id++;
}
const createId = createIdGenerator();
console.log(createId.next()); //{ value: 1, done: false }
console.log(createId.next()); //{ value: 2, done: false }
console.log(createId.next()); //{ value: undefined, done: true }

const todos = {
  life: ["eat", "sleep", "baba"],
  learn: ["es5", "es6", "design pattern"],
  work: ["b", "c", "framework"],
  [Symbol.iterator]: function* () {
    const all = [...this.life, ...this.learn, ...this.work];
    for (const i of all) {
      yield i;
    }
  },
};
for (const item of todos) {
  console.log(item);
}
```

## 21.includes 函数-es2016

判断数组是否包含某个元素，包含 NaN，解决 indexOf 无法查找 NaN 问题

```javascript
//  includes函数
const arr = ["foo", "bar", "baz", NaN];
console.log(arr.includes(NaN)); //true
console.log(arr.indexOf(NaN)); //-1
```

## 22. 运算符-es2016

指数运算

```javascript
// 指数运算符 **
// es5中2十次方
console.log(Math.pow(2, 10));
// es6中2十次方
console.log(2 ** 10);
```

## 23.values 函数-es2017

将对象的值以数组的形式返回

```javascript
const obj = {
  foo: 1,
  bar: 2,
  baz: 3,
};

console.log(Object.values(obj)); //[ 1, 2, 3 ]
```

## 24.entries 函数-es2017

将对象以键值对二维数组返回，使之可以使用 for...of...遍历

```javascript
const obj = {
  foo: 1,
  bar: 2,
  baz: 3,
};
console.log(Object.entries(obj));
const entry = Object.entries(obj);
for (const [key, value] of entry) {
  console.log(key, value);
}
```

## 25.Object.getOwnPropertyDescriptors(obj)-es2017

获取对象的描述信息

可以通过获得的描述信息，配合 Object.defineProperties 来完整复制对象，包含 get，set 方法

```javascript
// getOwnPropertyDescriptors
// 普通get方法
const objGet = {
  foo: 1,
  bar: 2,
  get getCount() {
    return this.foo + this.bar;
  },
};
// assign方法会把getCount当做普通属性复制，从而getCount为3，修改bar不管用
const objGet1 = Object.assign({}, objGet);
objGet1.bar = 3;
console.log(objGet1.getCount); //3
// descriptors
const descriptors = Object.getOwnPropertyDescriptors(objGet);
console.log("des", descriptors);
// 通过descriptors来复制对象，可以完整复制对象，包含get，set
const objGet2 = Object.defineProperties({}, descriptors);
objGet2.bar = 3;
console.log(objGet2.getCount); //4
```

## 26.padStart, padEnd 函数-es2017

在字符串前，或者后面追加指定字符串

参数：

targetLenght: 填充后的目标长度

padString:填充的字符串

规则：

- 填充的字符串超过目标长度，会在规定长度时被截+
- 填充字符串太短会以空格填+
- padString 未传值，以空格填充

作用：  

一般用来对齐字符串输出  

```javascript
/**
     *  foo.................|1
        barbar..............|2
        bazbazbaz...........|3
     */
console.log(`${key.padEnd(20, ".")}${value.toString().padStart(2, "|")}`);
```
