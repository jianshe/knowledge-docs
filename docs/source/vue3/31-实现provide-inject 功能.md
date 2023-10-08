# 31-实现provide-inject 功能

## 核心功能
1. 根组件提供对应的数据，子组件可以获取到provider提供的数据。
2. 可以跨层级使用。
3. 支持provide默认值功能。

## 测试案例
```javascript
// App.js
import { h, provide, inject } from "../../lib/mini-vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  setup() {
    provide("foo", "fooTwo");
    const foo = inject("foo");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", "bazDefault");

    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} ->${this.baz} `);
  },
};

export default {
  name: "App",
  // render函数
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
  setup() {},
};


```

## 核心代码

```javascript
// apiInject.ts
import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  // key value

  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;

    // 这里要解决一个问题
    // 当父级 key 和 爷爷级别的 key 重复的时候，对于子组件来讲，需要取最近的父级别组件的值
    // 那这里的解决方案就是利用原型链来解决
    // provides 初始化的时候是在 createComponent 时处理的，当时是直接把 parent.provides 赋值给组件的 provides 的
    // 所以，如果说这里发现 provides 和 parentProvides 相等的话，那么就说明是第一次做 provide(对于当前组件来讲)
    // 我们就可以把 parent.provides 作为 currentInstance.provides 的原型重新赋值
    // 至于为什么不在 createComponent 的时候做这个处理，可能的好处是在这里初始化的话，是有个懒执行的效果（优化点，只有需要的时候在初始化）
    // init 只执行一次
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
    const currentInstance:any = getCurrentInstance();
  
    if (currentInstance) {
      const parentProvides = currentInstance.parent?.provides;
  
      if (key in parentProvides) {
        return parentProvides[key];
      } else if (defaultValue) {
        if (typeof defaultValue === "function") {
          return defaultValue();
        }
        return defaultValue;
      }
    }
  }

```