# 13-实现 reactive 和 readonly 嵌套对象转换功能


## 功能描述
1. reactive对象嵌套对象时是否是reactive类型。
2. readonly对象嵌套对象时是否是readonly类型。

## 单元测试
```javascript
import { isReactive, reactive } from "../reactive";

describe("reactive", () => {
    test("nested reactives", () => {
      const original = {
        nested: {
          foo: 1,
        },
        array: [{ bar: 2 }],
      };
      const observed = reactive(original);
      expect(isReactive(observed.nested)).toBe(true);
      expect(isReactive(observed.array)).toBe(true);
      expect(isReactive(observed.array[0])).toBe(true);
    });
});


import { isReactive, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReactive(wrapped)).toBe(false);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isReadonly(original)).toBe(false);
    expect(isReactive(wrapped.bar)).toBe(false);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReactive(original.bar)).toBe(false);
    expect(isReadonly(original.bar)).toBe(false);
    // get
    expect(wrapped.foo).toBe(1);
  });
});

```
createGetter 针对返回的res 添加如下判断。

```javascript
export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

if (isObject(res)) {
    // 把内部所有的是 object 的值都用 reactive 包裹，变成响应式对象
    // 如果说这个 res 值是一个对象的话，那么我们需要把获取到的 res 也转换成 reactive
    // res 等于 target[key]
    return isReadonly ? readonly(res) : reactive(res);
}
```

