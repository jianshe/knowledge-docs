# Webpack 中 loader 的作用是什么，以及常用 loader 有哪些

## loader 作用：

1. 实现对不同格式文件的处理，比如将 Scss 转换为 CSS，或将 TypeScript 转化为 Javascript。

2. 可以编译文件，从而使其能够添加到依赖关系中。loader 是 Webpack 最重要的部分之一。通过使用不同的 loader，我们能够调用外部的脚本或者工具，实现对不同格式文件的处理。loader 需要在 webpack.config.js 里单独用 module 进行配置。

## 常用的 loader 如下：

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- image-loader：加载并且压缩图片文件
- babel-loader：把 ES6 转换成 ES5
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
- eslint-loader：通过 ESLint 检查 JavaScript 代码
