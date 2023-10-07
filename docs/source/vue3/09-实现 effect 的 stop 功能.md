# 09-实现 effect 的 stop 功能


## 功能描述
1. stop方法，会删除当前相关依赖，调用stop方法，会让当前对象失去响应化。
2. 通过 effect 的第二个参数给定一个 onStop函数。
3. 当stop(effect)被调用时，会执行一次onStop函数。


## 代码实现

单元测试


```javascript
it("stop", () => {
  let dummy;
  const obj = reactive({ prop: 1 });
  const runner = effect(() => {
    dummy = obj.prop;
  });
  obj.prop = 2;
  expect(dummy).toBe(2);
  stop(runner);
  obj.prop = 3;
  expect(dummy).toBe(2);

  // stopped effect should still be manually callable
  runner();
  expect(dummy).toBe(3);
});

it("onStop", () => {
  const obj = reactive({
    foo: 1,
  });
  const onStop = jest.fn();
  let dummy;
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    {
      onStop,
    }
  );
  stop(runner);
  expect(onStop).toBeCalledTimes(1);
});

```

effect.ts中添加stop函数，并在调用之前在track方法中将所有deps保存起来,调用stop函数时，删除effect相关联的所有deps

```javascript
export const extend = Object.assign;

class ReactiveEffect {
  active = true;
  deps = [];
  onStop?: () => void;
  constructor(public fn, public scheduler?) {
    console.log("创建 ReactiveEffect 对象");
  }
  run() {
    activeEffect = this;
    return this.fn();
  }
  stop() {
    if (this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop()
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  // 找到所有依赖这个 effect 的响应式对象
  // 从这些响应式对象里面把 effect 给删除掉
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetMap = new Map();

export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (!activeEffect) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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

let activeEffect;

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);

  // 把用户传过来的值合并到 _effect 对象上去
  // 缺点就是不是显式的，看代码的时候并不知道有什么值
  extend(_effect, options);
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
```

