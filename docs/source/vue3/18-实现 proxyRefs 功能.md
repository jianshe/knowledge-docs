# 18-实现 proxyRefs 功能

## 功能描述

假设：对象为

```javascript
const user = {
    age: ref(10),
    name: "xiaohong"
};  
const proxyUser = proxyRefs(user);
```

1. 通过 proxyRefs 包裹的对象，如果值为 ref 的，可以通过 proxyUser.age 直接拿到 10。
2. 当修改 proxyUser.age 值为 20 时，proxyUser.age 和 user.age.value 都为 20。
3. 当修改 proxyUser.age = ref(10)时，期望 proxyUser.age 和 user.age.value 的值都为 10。

## 单元测试

```javascript
it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");

    (proxyUser as any).age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
```

## 代码实现

```javascript
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

const shallowUnwrapHandlers = {
  get(target, key) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回value 就可以了
    return unRef(Reflect.get(target, key));
  },
  set(target, key, value) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value);
    }
  },
};
```
