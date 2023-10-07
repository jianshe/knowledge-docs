# 15-实现 isProxy 功能

## 功能描述

判断当前对象，是否是 isReactive 或者是 isReadonly

## 单元测试

```javascript
it("happy path", () => {
    const original = { foo: 1 };
    expect(isProxy(observed)).toBe(true)
  })
}
```

## 代码实现

```javascript
export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
```
