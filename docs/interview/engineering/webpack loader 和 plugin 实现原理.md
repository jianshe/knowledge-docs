# webpack loader 和 plugin 实现原理

## 本文讨论的核心内容如下：

1. webpack 进行打包的基本原理
2. 如何自己实现一个 loader 和 plugin

注： 本文使用的 webpack 版本是 v4.43.0, webpack-cli 版本是 v3.3.11，node 版本是 v12.14.1，npm 版本 v6.13.4(如果你喜欢 yarn 也是可以的)，演示用的 chrome 浏览器版本 81.0.4044.129（正式版本） （64 位）

## 1. webpack 打包基本原理

webpack 的一个核心功能就是把我们写的模块化的代码，打包之后，生成可以在浏览器中运行的代码，我们这里也是从简单开始，一步步探索 webpack 的打包原理

### 1.1 一个简单的需求

我们首先建立一个空的项目，使用 npm init -y 快速初始化一个 package.json，然后安装 webpack webpack-cli 接下来，在根目录下创建 src 目录，src 目录下创建 index.js，add.js，minus.js，根目录下创建 index.html，其中 index.html 引入 index.js，在 index.js 引入 add.js，minus.js，  
目录结构如下：

<ViewerZoom src="../images/engineering/171d9fbcada8b2c8~tplv-t2oaga2asx-image.png" />

文件内容如下：

```javascript
// add.js
export default (a, b) => {
  return a + b;
};
// minus.js
export const minus = (a, b) => {
  return a - b;
};
// index.js
import add from "./add.js";
import { minus } from "./minus.js";

const sum = add(1, 2);
const division = minus(2, 1);
console.log("sum>>>>>", sum);
console.log("division>>>>>", division);
```

```javascript
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demo</title>
</head>
<body>
    <script src="./src/index.js"></script>
</body>
</html>

```

这样直接在 index.html 引入 index.js 的代码，在浏览器中显然是不能运行的，你会看到这样的错误

```javascript
Uncaught SyntaxError: Cannot use import statement outside a module
```

是的，我们不能在 script 引入的 js 文件里，使用 es6 模块化语法

### 1.2 实现 webpack 打包核心功能

我们首先在项目根目录下再建立一个 bundle.js，这个文件用来对我们刚刚写的模块化 js 代码文件进行打包

我们首先来看 webpack 官网对于其打包流程的描述：

> it internally builds a dependency graph which maps every module your project needs and generates one or more bundles（webpack 会在内部构建一个 依赖图(dependency graph)，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle）

在正式开始之前，结合上面 webpack 官网说明进行分析，明确我们进行打包工作的基本流程如下：

1. 首先，我们需要读到入口文件里的内容（也就是 index.js 的内容）
2. 其次，分析入口文件，递归的去读取模块所依赖的文件内容，生成依赖图
3. 最后，根据依赖图，生成浏览器能够运行的最终代码

## 1. 处理单个模块（以入口为例）

### 1.1 获取模块内容

既然要读取文件内容，我们需要用到 node.js 的核心模块 fs，我们首先来看读到的内容是什么：

```javascript
// bundle.js
const fs = require("fs");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  console.log(body);
};
getModuleInfo("./src/index.js");
```

我们定义了一个方法 getModuleInfo，这个方法里我们读出文件内容，打印出来，输出的结果如下图：

<ViewerZoom src="../images/engineering/171d98e51b90bdf8~tplv-t2oaga2asx-image.png" />

我们可以看到，入口文件 index.js 的所有内容都以字符串形式输出了，我们接下来可以用正则表达式或者其它一些方法，从中提取到 import 以及 export 的内容以及相应的路径文件名，来对入口文件内容进行分析，获取有用的信息。但是如果 import 和 export 的内容非常多，这会是一个很麻烦的过程，这里我们借助 babel 提供的功能，来完成入口文件的分析。

### 1.2 分析模块内容

我们安装@babel/parser，演示时安装的版本号为^7.9.6

这个 babel 模块的作用，就是把我们 js 文件的代码内容，转换成 js 对象的形式，这种形式的 js 对象，称做抽象语法树(Abstract Syntax Tree, 以下简称 AST)

```javascript
// bundle.js
const fs = require("fs");
const parser = require("@babel/parser");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    // 表示我们要解析的是es6模块
    sourceType: "module",
  });
  console.log(ast);
  console.log(ast.program.body);
};
getModuleInfo("./src/index.js");
```

使用@babel/parser 的 parse 方法把入口文件转化称为了 AST，我们打印出了 ast，注意文件内容是在 ast.program.body 中，如下图所示：

<ViewerZoom src="../images/engineering/171d98ade5426518~tplv-t2oaga2asx-image.png" />
入口文件内容被放到一个数组中，总共有六个Node节点，我们可以看到，每个节点有一个type属性，其中前两个的type属性是ImportDeclaration，这对应了我们入口文件的两条import语句，并且，每一个type属性是ImportDeclaration的节点，其source.value属性是引入这个模块的相对路径，这样我们就得到了入口文件中对打包有用的重要信息了。

接下来要对得到的 ast 做处理，返回一份结构化的数据，方便后续使用。

### 1.3 对模块内容做处理

对 ast.program.body 部分数据的获取和处理，本质上就是对这个数组的遍历，在循环中做数据处理，这里同样引入一个 babel 的模块@babel/traverse 来完成这项工作。

安装@babel/traverse，演示时安装的版本号为^7.9.6

```javascript
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module",
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const absPath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = absPath;
    },
  });
  console.log(deps);
};
getModuleInfo("./src/index.js");
```

创建一个对象 deps，用来收集模块自身引入的依赖，使用 traverse 遍历 ast，我们只需要对 ImportDeclaration 的节点做处理，注意我们做的处理实际上就是把相对路径转化为绝对路径，这里我使用的是 Mac 系统，如果是 windows 系统,注意斜杠的区别

获取依赖之后，我们需要对 ast 做语法转换，把 es6 的语法转化为 es5 的语法，使用 babel 核心模块@babel/core 以及@babel/preset-env 完成  
安装@babel/core @babel/preset-env，演示时安装的版本号均为^7.9.6

```javascript
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module",
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const absPath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = absPath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  const moduleInfo = { file, deps, code };
  console.log(moduleInfo);
  return moduleInfo;
};
getModuleInfo("./src/index.js");
```

如下图所示，我们最终把一个模块的代码，转化为一个对象形式的信息，这个对象包含文件的绝对路径，文件所依赖模块的信息，以及模块内部经过 babel 转化后的代码

<ViewerZoom src="../images/engineering/171d93fe0ee65d14~tplv-t2oaga2asx-image.png" />

## 2. 递归的获取所有模块的信息

这个过程，也就是获取依赖图(dependency graph)的过程，这个过程就是从入口模块开始，对每个模块以及模块的依赖模块都调用 getModuleInfo 方法就行分析，最终返回一个包含所有模块信息的对象

```javascript
const parseModules = (file) => {
  // 定义依赖图
  const depsGraph = {};
  // 首先获取入口的信息
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];
    const deps = item.deps;
    if (deps) {
      // 遍历模块的依赖，递归获取模块信息
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  console.log(depsGraph);
  return depsGraph;
};
parseModules("./src/index.js");
```

获得的 depsGraph 对象如下图：

<ViewerZoom src="../images/engineering/171d98ce6221d006~tplv-t2oaga2asx-image.png" />

我们最终得到的模块分析数据如上图所示，接下来，我们就要根据这里获得的模块分析数据，来生产最终浏览器运行的代码。

## 3. 生成最终代码

在我们实现之前，观察上一节最终得到的依赖图，可以看到，最终的 code 里包含 exports 以及 require 这样的语法，所以，我们在生成最终代码时，要对 exports 和 require 做一定的实现和处理

我们首先调用之前说的 parseModules 方法，获得整个应用的依赖图对象：

```javascript
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
};
```

接下来我们应该把依赖图对象中的内容，转换成能够执行的代码，以字符串形式输出。 我们把整个代码放在自执行函数中，参数是依赖图对象

```javascript
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function(graph){
        function require(file) {
            var exports = {};
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
};
```

接下来内容其实很简单，就是我们取得入口文件的 code 信息，去执行它就好了，使用 eval 函数执行，初步写出代码如下：

```javascript
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function(graph){
        function require(file) {
            var exports = {};
            (function(code){
                eval(code)
            })(graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
};
```

上面的写法是有问题的，我们需要对 file 做绝对路径转化，否则 graph[file].code 是获取不到的，定义 adsRequire 方法做相对路径转化为绝对路径

```javascript
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function(graph){
        function require(file) {
            var exports = {};
            function absRequire(relPath){
                return require(graph[file].deps[relPath])
            }
            (function(require, exports, code){
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
};
```

接下来，我们只需要执行 bundle 方法，然后把生成的内容写入一个 JavaScript 文件即可

```javascript
const content = bundle("./src/index.js");
// 写入到dist/bundle.js
fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);
```

最后，我们在 index.html 引入这个./dist/bundle.js 文件，我们可以看到控制台正确输出了我们想要的结果

<ViewerZoom src="../images/engineering/171d98729f5a309a~tplv-t2oaga2asx-image.png" />

## 4. bundle.js 的完整代码

```javascript
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  console.log(body);
  const ast = parser.parse(body, {
    sourceType: "module",
  });
  // console.log(ast.program.body)
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const absPath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = absPath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};

const parseModules = (file) => {
  // 定义依赖图
  const depsGraph = {};
  // 首先获取入口的信息
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];
    const deps = item.deps;
    if (deps) {
      // 遍历模块的依赖，递归获取模块信息
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  // console.log(depsGraph)
  return depsGraph;
};

// 生成最终可以在浏览器运行的代码
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function(graph){
        function require(file) {
            var exports = {};
            function absRequire(relPath){
                return require(graph[file].deps[relPath])
            }
            (function(require, exports, code){
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
};

const build = (file) => {
  const content = bundle(file);
  // 写入到dist/bundle.js
  fs.mkdirSync("./dist");
  fs.writeFileSync("./dist/bundle.js", content);
};

build("./src/index.js");
```

## 2. 手写 loader 和 plugin

### 2.1 如何自己实现一个 loader

loader 本质上就是一个函数，这个函数会在我们在我们加载一些文件时执行

#### 2.1.1 如何实现一个同步 loader

首先我们初始化一个项目，项目结构如图所示：

<ViewerZoom src="../images/engineering/171d9a1c5aa08dcc~tplv-t2oaga2asx-image.png" />
其中index.js和webpack.config.js的文件内容如下：

```javascript
// index.js
console.log("我要学好前端，因为学好前端可以： ");

// webpack.config.js
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
```

我们在根目录下创建 syncLoader.js，用来实现一个同步的 loader，注意这个函数必须返回一个 buffer 或者 string

```javascript
// syncloader.js
module.exports = function (source) {
  console.log("source>>>>", source);
  return source;
};
```

同时，我们在 webpack.config.js 中使用这个 loader，我们这里使用 resolveLoader 配置项，指定 loader 查找文件路径，这样我们使用 loader 时候可以直接指定 loader 的名字

```javascript
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    // loader路径查找顺序从左往右
    modules: ["node_modules", "./"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "syncLoader",
      },
    ],
  },
};
```

接下来我们运行打包命令，可以看到命令行输出了 source 内容，也就是 loader 作用文件的内容。

<ViewerZoom src="../images/engineering/171d9af78146f8a0~tplv-t2oaga2asx-image.png" />

接着我们改造我们的 loader:

```javascript
module.exports = function (source) {
  source += "升值加薪";
  return source;
};
```

我们再次运行打包命令，去观察打包后的代码：
<ViewerZoom src="../images/engineering/171d9b2306cb5278~tplv-t2oaga2asx-image.png" />

这样，我们就实现了一个简单的 loader，为我们的文件增加一条信息。 我们可以尝试在 loader 的函数里打印 this，发现输出结果是非常长的一串内容，this 上有很多我们可以在 loader 中使用的有用信息，所以，对于 loader 的编写，一定不要使用箭头函数，那样会改变 this 的指向。  
一般来说，我们会去使用官方推荐的 loader-utils 包去完成更加复杂的 loader 的编写  
我们继续安装 loader-utils，版本是^2.0.0

我们首先改造 webpack.config.js：

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    // loader路径查找顺序从左往右
    modules: ["node_modules", "./"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "syncLoader",
          options: {
            message: "升值加薪",
          },
        },
      },
    ],
  },
};
```

注意到，我们为我们的 loader 增加了 options 配置项，接下来在 loader 函数里使用 loader-utils 获取配置项内容，拼接内容，我们依然可以得到与之前一样的打包结果

```javascript
// syncLoader.js
const loaderUtils = require("loader-utils");
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  console.log(options);
  source += options.message;
  // 可以传递更详细的信息
  this.callback(null, source);
};
```

<ViewerZoom src="../images/engineering/171d9c109f578ef6~tplv-t2oaga2asx-image.png" />
<ViewerZoom src="../images/engineering/171d9c1afaa94890~tplv-t2oaga2asx-image.png" />

这样，我们就完成了一个简单的同步 loader 的编写

#### 2.1.2 如何实现一个异步 loader

和同步 loader 的编写方式非常相似，我们在根目录下建立一个 asyncLoader.js 的文件，内容如下：

```javascript
const loaderUtils = require("loader-utils");
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  const asyncfunc = this.async();
  setTimeout(() => {
    source += "走上人生颠覆";
    asyncfunc(null, res);
  }, 200);
};
```

注意这里的 this.async()，用官方的话来说就是 Tells the loader-runner that the loader intends to call back asynchronously. Returns this.callback.也就是让 webpack 知道这个 loader 是异步运行，返回的是和同步使用时一致的 this.callback

接下来我们修改 webpack.config.js

```javascript
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    // loader路径查找顺序从左往右
    modules: ["node_modules", "./"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "syncLoader",
            options: {
              message: "走上人生巅峰",
            },
          },
          {
            loader: "asyncLoader",
          },
        ],
      },
    ],
  },
};
```

注意 loader 执行顺序是从下往上的，所以首先为文本写入‘升值加薪’，然后写入‘走上人生巅峰’

<ViewerZoom src="../images/engineering/171d9cc0c3a652c9~tplv-t2oaga2asx-image.png" />

到此，我们简单介绍了如何手写一个 loader，在实际项目中，可以考虑一部分公共的简单逻辑，可以通过编写一个 loader 来完成(比如国际化文本替换)

### 2.2 如何自己实现一个 plugin

plugin 通常是在 webpack 在打包的某个时间节点做一些操作，我们使用 plugin 的时候，一般都是 new Plugin()这种形式使用，所以，首先应该明确的是，plugin 应该是一个类。

我们初始化一个与上一接实现 loader 时候一样的项目，根目录下创建一个 demo-webpack-plugin.js 的文件，我们首先在 webpack.config.js 中使用它

```javascript
const path = require("path");
const DemoWebpackPlugin = require("./demo-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [new DemoWebpackPlugin()],
};
```

再来看 demo-webpack-plugin.js 的实现

```javascript
class DemoWebpackPlugin {
  constructor() {
    console.log("plugin init");
  }
  apply(compiler) {}
}

module.exports = DemoWebpackPlugin;
```

我们在 DemoWebpackPlugin 的构造函数打印一条信息，当我们执行打包命令时，这条信息就会输出，plugin 类里面需要实现一个 apply 方法，webpack 打包时候，会调用 plugin 的 apply 方法来执行 plugin 的逻辑，这个方法接受一个 compiler 作为参数，这个 compiler 是 webpack 实例

plugin 的核心在于，apply 方法执行时，可以操作 webpack 本次打包的各个时间节点（hooks，也就是生命周期勾子），在不同的时间节点做一些操作

关于 webpack 编译过程的各个生命周期勾子，可以参考[Compiler Hooks](https://v4.webpack.js.org/api/compiler-hooks/)

同样，这些 hooks 也有同步和异步之分，下面演示 compiler hooks 的写法，一些重点内容可以参考注释：

```javascript
class DemoWebpackPlugin {
  constructor() {
    console.log("plugin init");
  }
  // compiler是webpack实例
  apply(compiler) {
    // 一个新的编译(compilation)创建之后（同步）
    // compilation代表每一次执行打包，独立的编译
    compiler.hooks.compile.tap("DemoWebpackPlugin", (compilation) => {
      console.log(compilation);
    });
    // 生成资源到 output 目录之前（异步）
    compiler.hooks.emit.tapAsync("DemoWebpackPlugin", (compilation, fn) => {
      console.log(compilation);
      compilation.assets["index.md"] = {
        // 文件内容
        source: function () {
          return "this is a demo for plugin";
        },
        // 文件尺寸
        size: function () {
          return 25;
        },
      };
      fn();
    });
  }
}

module.exports = DemoWebpackPlugin;
```

我们的这个 plugin 的作用就是，打包时候自动生成一个 md 文档，文档内容是很简单的一句话

上述异步 hooks 的写法也可以是以下两种：

```javascript
// 第二种写法(promise)
compiler.hooks.emit.tapPromise("DemoWebpackPlugin", (compilation) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    console.log(compilation.assets);
    compilation.assets["index.md"] = {
      // 文件内容
      source: function () {
        return "this is a demo for plugin";
      },
      // 文件尺寸
      size: function () {
        return 25;
      },
    };
  });
});
// 第三种写法(async await)
compiler.hooks.emit.tapPromise("DemoWebpackPlugin", async (compilation) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  console.log(compilation.assets);
  compilation.assets["index.md"] = {
    // 文件内容
    source: function () {
      return "this is a demo for plugin";
    },
    // 文件尺寸
    size: function () {
      return 25;
    },
  };
});
```

最终的输出结果都是一样的，在每次打包时候生成一个 md 文档
<ViewerZoom src="../images/engineering/171d9f20d45da9c4~tplv-t2oaga2asx-image.png" />
