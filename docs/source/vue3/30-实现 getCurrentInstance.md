# 30-实现 getCurrentInstance


## 核心功能
1. 会返回当前组件的实例对象。
2. 这个方法必须在setup方法中来使用。

## 测试案例

```javascript
// App.js

import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export default {
  name: "App",
  // render函数
  render() {
    return h("div", {}, [h("p"), {}, "currentInstance demo", h(Foo)]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("App: ", instance);
  },
};

//Foo.js

import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo: ", instance);
    return {};
  },
  render() {
    return h("div", {}, "foo");
  },
};


```

## 代码实现
```javascript
function setupStatefulComponent(instance: any) {
  // 获取到用户给到的配置
  const Component = instance.type;
  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    // function Object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

```
