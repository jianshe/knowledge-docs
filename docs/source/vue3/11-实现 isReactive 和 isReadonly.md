# 11-实现 isReactive 和 isReadonly

## 功能描述
1. isReactive 判断一个对象是否是reactive类型。
2. isReadonly 判断一个对象是否是readonly类型。

## 单元测试
```javascript
import { isReactive, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReactive(wrapped)).toBe(false);
    expect(isReadonly(wrapped)).toBe(true);
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
## 代码实现
```javascript
// reactive.ts
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
  // 如果 value 是 proxy 的话
  // 会触发 get 操作，而在 createGetter 里面会判断
  // 如果 value 是普通对象的话
  // 那么会返回 undefined ，那么就需要转换成布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}
// baseHandlers.ts中通过key来判断是否是reactive还是readonly
function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (!isReadonly) {
      // 在触发 get 的时候进行依赖收集
      track(target, key);
    }
    return res;
  };
}
```