# webpack treeShaking 机制的原理是什么？

## 参考答案

> Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫 Dead code elimination

## tree shaking 如何工作的呢?

虽然 tree shaking 的概念在 1990 就提出了，但直到 ES6 的 ES6-style 模块出现后才真正被利用起来。  
在 ES6 以前，我们可以使用 CommonJS 引入模块：require()，这种引入是动态的，也意味着我们可以基于条件来导入需要的代码：

```javascript
let dynamicModule;
// 动态导入
if (condition) {
  myDynamicModule = require("foo");
} else {
  myDynamicModule = require("bar");
}
```

但是 CommonJS 规范无法确定在实际运行前需要或者不需要某些模块，所以 CommonJS 不适合 tree-shaking 机制。在 ES6 中，引入了完全静态的导入语法：import。这也意味着下面的导入是不可行的：

```javascript
// 不可行，ES6 的import是完全静态的
if (condition) {
  myDynamicModule = require("foo");
} else {
  myDynamicModule = require("bar");
}
```

我们只能通过导入所有的包后再进行条件获取。如下：

```javascript
import foo from "foo";
import bar from "bar";

if (condition) {
  // foo.xxxx
} else {
  // bar.xxx
}
```

ES6 的 import 语法可以完美使用 tree shaking，因为可以在代码不运行的情况下就能分析出不需要的代码。

看完上面的分析，你可能还是有点懵，这里我简单做下总结：因为 tree shaking 只能在静态 modules 下工作。ECMAScript 6 模块加载是静态的,因此整个依赖树可以被静态地推导出解析语法树。所以在 ES6 中使用 tree shaking 是非常容易的。

## tree shaking 的原理是什么?

看完上面的分析，相信这里你可以很容易的得出题目的答案了：

- ES6 Module 引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
- 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

## common.js 和 es6 中模块引入的区别？

从这道题目我们可以很容易的引申出来另外一道“明星”面试题：common.js 和 es6 中模块引入的区别？

CommonJS 是一种模块规范，最初被应用于 Nodejs，成为 Nodejs 的模块规范。运行在浏览器端的 JavaScript 由于也缺少类似的规范，在 ES6 出来之前，前端也实现了一套相同的模块规范 (例如: AMD)，用来对前端模块进行管理。自 ES6 起，引入了一套新的 ES6 Module 规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案。但目前浏览器对 ES6 Module 兼容还不太好，我们平时在 Webpack 中使用的 export 和 import，会经过 Babel 转换为 CommonJS 规范。在使用上的差别主要有：

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJs 是单个值导出，ES6 Module 可以导出多个
- CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
- CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined
