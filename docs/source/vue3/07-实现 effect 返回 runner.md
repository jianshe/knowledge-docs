# 07-实现 effect 返回 runner

## 功能描述

1. 期望effect(fn)首次会调用fn。
2. 调用fn，会拿到返回值。

```javascript
it("should return runner when call effect",() => {
  // 1. effect(fn) => function (funner) => fn => return
  let foo = 10;
  const runner = effect(()=>{
    foo++;
    return "foo";
  })

  expect(foo).toBe(11);
  const r = runner();
  expect(foo).toBe(12);
  expect(r).toBe("foo")
})
```
修改effect函数

```javascript

export function effect(fn) {
  // fn
  const _effect = new ReactiveEffect(fn);
  _effect.run();

  return _effect.run.bind(_effect);
}
```

修改ReactiveEffect ，使其能调用run时，返回this._fn();

```javascript

class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this
    return this._fn();
  }
}
```

