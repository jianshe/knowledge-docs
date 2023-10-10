# 49-实现代码生成 string 类型

## 核心功能

1. 通过generate生成render函数。
2. 快照测试。
3. 处理string，解释function 的name,params。
4. 对模块之间的执责做了划分。

## 单元测试
```javascript
import { generate } from "../codegen";
import { baseParse } from "../parse";
import { transform } from "../transform";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    // 快照测试 1. 抓bug 2. 有意（主动更新快照）。

    expect(code).toMatchSnapshot();
  });
});

```

## 核心代码

```javascript
export function generate(ast) {
  // 生成 context
  const context = createCodegenContext();
  const { push } = context;
  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");
  push(`function ${functionName}(${signature}) {`);
  push("return ");
  genNode(ast.codegenNode, context);

  push("}");

  return {
    code: context.code,
  };
}

function genNode(node: any, context: any) {
  const { push } = context;
  push(`'${node.content}'`);
}

function createCodegenContext(): any {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
  };

  return context;
}

```