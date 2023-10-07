# 17-实现 isRef 和 unRef 功能

## 功能描述

1. isRef 判断一个响应式对象是否是 ref 类型。
2. unRef 用于返回 ref.value 的值。

## 单元测试

```javascript
it("isRef", () => {
  const a = ref(1);
  const user = reactive({
    age: 1,
  });
  expect(isRef(a)).toBe(true);
  expect(isRef(1)).toBe(false);
  expect(isRef(user)).toBe(false);
});

it("unRef", () => {
  const a = ref(1);
  expect(unRef(a)).toBe(1);
  expect(unRef(1)).toBe(1);
});
```

## 代码实现

```javascript
// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function isRef(value) {
  return !!value.__v_isRef;
}
```
