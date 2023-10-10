# 48-实现 transform 功能

## 核心功能
1. 树的遍历，深度优先搜索，递归的实现原理。
2. 实现了插件体现，将程序的变动点和稳定点分离开，保证程序的可测试性。

## 单元测试

```javascript
import { NodeTypes } from "../ast";
import { baseParse } from "../parse";
import { transform } from "../transform";

describe("transform", () => {
  it("happy path", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + " mini-vue";
      }
    };

    transform(ast, {
      nodeTransforms: [plugin],
    });

    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe("hi, mini-vue")
  });
});


```

## 核心代码

```javascript
import { NodeTypes } from "./ast";

export function transform(root, options = {}) {
  // 通过创建一个上下文对象，来存储我们的options
  const context = createTransformContext(root, options);

  // 1. 遍历 - 深度优先搜索
  traverseNode(root, context);
  // 2. 修改 text - content
}

function createTransformContext(root: any, options: any): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
  return context;
}

function traverseNode(node: any, context: any) {
  if (node.type === NodeTypes.TEXT) {
    node.content = node.content + " mini-vue";
  }

  // 取出我们的nodeTransforms

  const nodeTransforms = context.nodeTransforms;

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform[node];
  }
  traverseChildren(node, context);
}

function traverseChildren(node: any, context: any) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}


```

