# 52-实现编译 template 成 render 函数

## 核心功能 
1. 通过registerRuntimeCompiler模式把我们的runtime-dom和compiler进行了解籍。
2. 通过compilerToFunction把我们编辑好的render函数给到它，把我们运行时的runtimeDom给到它。
3. 在运行时利用了闭包的特性，可以访问到我们上面的方法。

## 测试案例

```javascript
import { ref } from "../../lib/mini-vue.esm.js";

export default {
  name: "App",
  template: `<div>hi,{{message}} {{count}}</div>`,

  setup() {
    const count = (window.count = ref(1));
    return { message: "mini-vue", count };
  },
};
```

## 核心代码

```javascript
// mini-vue 出口
export * from "./runtime-dom";

import { baseCompile } from "./compiler-core";
import * as runtimeDom from "./runtime-dom";

import { registerRuntimeCompiler } from "./runtime-dom";
function compileToFunction(template) {
  const { code } = baseCompile(template);
  const render = new Function("Vue", code)(runtimeDom);

  return  render;
}

registerRuntimeCompiler(compileToFunction)

// compile.ts
import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformExpression } from "./transforms/transformExpression";
import { transformElement } from "./transforms/transformElement";
import { transformText } from "./transforms/transformText";

export function baseCompile(template, options = {}) {
  // 1. 先把 template 也就是字符串 parse 成 ast
  const ast = baseParse(template);
  transform(
    ast,
    Object.assign(options, {
      nodeTransforms: [transformElement, transformText, transformExpression],
    })
  );

  // 3. 生成 render 函数代码
  return generate(ast);
}

```