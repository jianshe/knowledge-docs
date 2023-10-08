# 28-实现组件 slots 功能

## 核心功能
1. 支持传入P标签。
2. 支持传入数组。
3. 支持值的传入。

## 测试案例

```javascript
// Foo.js

import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export default {
  name: "Foo",
  setup(props, context) {},
  render() {
    return h("div", { "data-test": "foo" }, [
      h("div", {}, "foo"),
      // renderSlots 会返回一个 vnode
      // 其本质和 h 是一样的
      // 第三个参数给出数据
      renderSlots(this.$slots, "default", {
        age: 16,
      }),
    ]);
  },
};



// App.js
import { h, createTextVNode } from "../../lib/mini-vue.esm.js";

import Foo from "./Foo.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      h(
        Foo,
        {
          msg: "your name is Foo",
        },
        {
          default: ({ age }) => [
            h("p", {}, "我是通过 slot 渲染出来的第一个元素 "),
            h("p", {}, "我是通过 slot 渲染出来的第二个元素"),
            h("p", {}, `我可以接收到 age: ${age}`),
            createTextVNode("你好呀"),
          ],
        }
      ),
    ]);
  },
};
```

## 核心代码

```javascript
import { ShapeFlags } from "../shared/shapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;

  console.log("初始化 slots");

  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, (instance.slots = {}));
  }
}

const normalizeSlotValue = (value) => {
  // 把 function 返回的值转换成 array ，这样 slot 就可以支持多个元素了
  return Array.isArray(value) ? value : [value];
};

const normalizeObjectSlots = (rawSlots, slots) => {
  for (const key in rawSlots) {
    const value = rawSlots[key];
    if (typeof value === "function") {
      // 把这个函数给到slots 对象上存起来
      // 后续在 renderSlots 中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
};
```
