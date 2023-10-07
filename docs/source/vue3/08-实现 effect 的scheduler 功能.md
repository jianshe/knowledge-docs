# 08-实现 effect 的 scheduler 功能

## 功能描述

1. 通过 effect 的第二个参数给定一个 scheduler 的 fn。
2. 当 effect 第一次执行的时候，才会执行 fn。 
3. 当响应式对象，值发生改变时， update 不会执行 fn，而是执行 scheduler。
4. 当执行 runner 的时候，会再次执行 fn。

## 代码实现

单元测试

```javascript
it("scheduler", () => {
  let dummy;
  let run: any;
  const scheduler = jest.fn(() => {
    run = runner;
  });
  const obj = reactive({ foo: 1 });
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    { scheduler }
  );
  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);
  // should be called on first trigger
  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  // // should not run yet
  expect(dummy).toBe(1);
  // // manually run
  run();
  // // should have run
  expect(dummy).toBe(2);
});
```

修改effect函数，使其接收options参数，并且在trigger函数中，如果有scheduler，优先执行options.scheduler函数，如果没有scheduler，才执行run函数。

```javascript
class ReactiveEffect {
  private _fn: any;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  // fn
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();

  return _effect.run.bind(_effect);
}
```
