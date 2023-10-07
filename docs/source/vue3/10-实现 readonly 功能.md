# 10-实现 readonly 功能

## 功能描述

1. 它和 reactive 没有什么区别。
2. 它不可以被改写。
3. 当调用 set 函数时，触发警告。

## 代码实现

单元测试

```javascript
describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    // get
    expect(wrapped.foo).toBe(1);
  });

  it("warn then call set", () => {
    // console.warn()
    // mock

    console.warn = jest.fn();
    const user = readonly({
      age: 10,
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
```

功能实现

其实它和 reactive 方法一样，只不过不需要收集和触发依赖，当用户强行调用 set 函数时，会触发警告。

```javascript
export function readonly(raw) {

    return new Proxy(raw,{
        get(target,key) {
            // {foo:1}
            // foo

            const res = Reflect.get(target,key)

            return res
        },
        set(target,key,value) {
            // readonly 的响应式对象不可以修改值
            console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
            );
            return true;
        }
    })
}
```

## 代码重购

添加baseHandler.ts文件，并简化reactive.ts文件

```javascript

// baseHandler.ts

import { track, trigger } from "./effect";
const get = createGetter();
const set = createSetter();

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    if (!isReadonly) {
      // 在触发 get 的时候进行依赖收集
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const result = Reflect.set(target, key, value);

    trigger(target, key);

    return result;
  };
}

export const readonlyHandlers = {
  get: createGetter(true),
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};

export const mutableHandlers = {
  get,
  set,
};

export const shallowReadonlyHandlers = {
  get: createGetter(true),
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};


```

简化 reactive.ts

```javascript

import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers);
}

```

