# 24-实现 shapeFlags

## 核心功能

1. 描述当前虚拟节点的一些类型。
2. 可以标识当前节点类型。

## 实现方式

```javascript
// vnode->stateful_conponent->
// 1. 可以设置修改
// ShapeFlags.stateful_component = 1;
// ShapeFlags.array_children = 1;

// 2. 查找
// if (shapeFlags.element)
// if (shapeFlags.stateful_component)
```

##  不够高效 -> 使用位运算符的方式来
``` javascript
// 0000
// 0001 -> element
// 0010 -> stateful
// 0100 -> text_children
// 1000 -> array_children
// 1010
// | （两位都为 0： 才为 0）
// & (两位都为 1： 才为 1)
```

// 修改
``` javascript
0000
0001
————
0001
0100
————
0101
```
// 查找 &
``` javascript
0001
0001
&&&&
0001

0010
0001
&&&&
0000
```

## 代码实现

先创建一个 shapeFlags.ts 文件，然后再 vnode 里面添加 shapeFlag 类型标识。

```javascript
// shapeFlags.ts

// 组件的类型
export const enum ShapeFlags {
  // 最后要渲染的 element 类型
  //ELEMENT -> 0001;
  // STATEFUL_COMPONENT 0010
  // TEXT_CHILDREN 0100
  // ARRAY_CHILDREN 1000
  ELEMENT = 1,
  // 组件类型
  STATEFUL_COMPONENT = 1 << 1,
  // vnode 的 children 为 string 类型
  TEXT_CHILDREN = 1 << 2,
  // vnode 的 children 为数组类型
  ARRAY_CHILDREN = 1 << 3,
}

```

```javascript
// vnode.ts
import { ShapeFlags } from "../shared/shapeFlags";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };
  // children
  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}

function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
```

使用时，通过& 运算符来进行检测

```javascript
function patch(vnode, container) {
  // 判断Vnode是不是一个element
  // 是element 那么 就应该处理element
  // 如何判断是element类型还是component类型
  // 可以通过type的类型来判断
  const { shapeFlag } = vnode;

  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}
```
