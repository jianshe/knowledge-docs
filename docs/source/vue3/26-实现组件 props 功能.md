# 26-实现组件 props 功能

## 核心功能

1. setup 中接收 props。
2. render 里面通过 this 可以防问某一个 key 的值。
3. props 必须是一个 shallowReadonly。

## 测试案例

```javascript

// Foo.js
import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props) {
    // props.count
    console.log(props);
    props.count++;
    // props传递过来的值是不允许修改的
  },
  render() {
    return h("div", {}, "foo: " + this.count);
  },
};

// App.js
import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export default {
  name: "App",
  // render函数
  render() {
    window.self = this;
    // ui
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mousedown");
        },
      },
      [
        h("div", {}, "hi, " + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
      // this.$el
      // "hi, " + this.msg
      // string
      // "hi mini-vue"
      // array
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    // composition api
    return {
      msg: "mini-vue-haha",
    };
  },
};


```

## 代码实现

setup时初始化props

```javascript
export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  // initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 获取到用户给到的配置
  const Component = instance.type;
  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;
  if (setup) {
    // function Object

    const setupResult = setup(shallowReadonly(instance.props));
    handleSetupResult(instance, setupResult);
  }
}

```
检测props里面是否有key对应的值，如果有，取出里面的值

```javascript

import { hasOwn } from "../shared";

const publicPropertiesMap = {
  // 当用户调用 instance.proxy.$emit 时就会触发这个函数
  // i 就是 instance 的缩写 也就是组件实例对象
  $el: (i) => i.vnode.el,
};

// todo 需要让用户可以直接在 render 函数内直接使用 this 来触发 proxy
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // setupState
    const { setupState, props } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    const publicGetter = publicPropertiesMap[key];

    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};


```