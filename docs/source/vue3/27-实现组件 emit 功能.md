# 27-实现组件 emit 功能

## 核心功能

1. setup 中传入对象 emit。、
2. 当调用 emit 时，可以传入事件名 emit("add")，会去找当前组件里面是否有事件函数。(on+Event)。

## 测试案例

```javascript
// App.js

import { h } from "../../lib/mini-vue.esm.js";

import { Foo } from "./Foo.js";

export default {
  name: "App",
  // render函数
  render() {
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        // on + Event
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        },
      }),
    ]);
  },
  setup() {},
};
// Foo.js

import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emitAdd");
      emit("add", 1, 2);
      emit("add-foo");
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );

    const foo = h("p", {}, "foo");
    return h("div", {}, [foo, btn]);
  },
};
```

## 代码实现

添加一个 componentEmit.ts 文件

```javascript
import { camelize, hyphenate, toHandlerKey } from "../shared";
export function emit(instance, event: string, ...rawArgs) {
  const { props } = instance;
  let handler = props[toHandlerKey(camelize(event))];

  if (!handler) {
    handler = props[toHandlerKey(hyphenate(event))];
  }

  if (handler) {
    handler(...rawArgs);
  }
}
```

创建组件实例时，添加一个属性 emit,并在 setupStatefulComponent 方法中传入 emit 参数

```javascript
  component.emit = emit.bind(null,component) as any;

 const setupResult = setup(shallowReadonly(instance.props),{
      emit: instance.emit
    });

```