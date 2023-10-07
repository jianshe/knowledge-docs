# 14-实现 shallowReadonly 功能

## 功能描述

1. shallowReadonly 嵌套对象时，只有第一层是 readonly 或者 reactive 的，深层对象不是 readonly 或者 reactive 的。

## 单元测试

```javascript
describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReactive(props.n)).toBe(false);
  });
});
```

## 代码实现

```javascript
// 添加shallowReadonlyHandlers函数
export const shallowReadonlyHandlers = extend(
  {},
  readonlyHandlers,
  shallowReadonlyGet
);
```
