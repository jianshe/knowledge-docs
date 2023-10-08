# 29-实现 Fragment 和 Text 类型节点

## 功能描述

1. 解决children里面包含多个div的问题。
2. 只需要把children里面所有的节点给渲染出来。
3. 实现createTextVNode功能。

## 核心代码

```javascript
function patch(vnode, container) {
  // 判断Vnode是不是一个element
  // 是element 那么 就应该处理element
  // 如何判断是element类型还是component类型
  // 可以通过type的类型来判断
  // Fragment -> 只渲染children
  const { type, shapeFlag } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;

    case Text:
      processText(vnode, container);
      break;

    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
  }
}
function processElement(vnode: any, container: any) {
  // 先初始化
  mountElement(vnode, container);
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode: any, container: any) {
  // Implement
  mountChildren(vnode, container);
}


```