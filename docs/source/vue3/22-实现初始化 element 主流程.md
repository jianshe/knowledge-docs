# 22-实现初始化 element 主流程

## 核心功能 
通过vnode.type判断是否是组件还是element类型

## 测试demo
``` javascript
import { h } from "../../lib/mini-vue.esm.js";
export default {
  name: "App",
  // render函数
  render() {
    // ui
    // return h("div", "hi, " + this.msg);

    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      // string
      // "hi mini-vue"
      // array
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    // composition api
    return {
      msg: "mini-vue",
    };
  },
};

```

## 代码实现
```javascript
function patch(vnode, container) {
  // 判断Vnode是不是一个element
  // 是element 那么 就应该处理element
  // 如何判断是element类型还是component类型
  // 可以通过type的类型来判断
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  // 先初始化
  mountElement(vnode, container);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);
  // string array
  const { children } = vnode;

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    // vnode
    mountChildren(vnode, el);
  }
  // props
  const { props } = vnode;

  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}

```
