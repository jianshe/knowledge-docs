# 12-优化 stop 功能

## 存在的问题
当调用stop(runner)后，使用obj.prop = 3;这种方式时，会停止响应化，但是当使用obj.prop++这种方式时，仍会进行响应化。
## 出现的原因
obj.prop++,等价于obj.prop = obj.prop + 1,这时候其实会主动执行一次get方法的，执行get方法，就会触发依赖收集，这样的话，调用stop方法就无效了。

 ## 解决方案
 使用一个全局的变量shouldTrack来全局判断是否需要依赖收集。

 ## 代码实现

 ```javascript
 // effect.ts
let activeEffect;
let shouldTrack = false;

class ReactiveEffect {
  active = true;
  deps = [];
  onStop?: () => void;
  constructor(public fn, public scheduler?) {
    console.log("创建 ReactiveEffect 对象");
  }
  run() {
    console.log("run");
    // 运行 run 的时候，可以控制 要不要执行后续收集依赖的一步
    // 目前来看的话，只要执行了 fn 那么就默认执行了收集依赖
    // 这里就需要控制了

    // 是不是收集依赖的变量

    // 执行 fn  但是不收集依赖
    if (!this.active) {
      return this.fn();
    }

    // 执行 fn  收集依赖
    // 可以开始收集依赖了
    shouldTrack = true;

    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this as any;
    // 执行用户传入的 fn
    console.log("执行用户传入的 fn");
    const result = this.fn();
    // 重置
    shouldTrack = false;
    activeEffect = undefined;

    return result;
  }
  stop() {
    if (this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

const targetMap = new Map();

export function track(target, key) {
  if (!isTracking()) {
    return;
  }
  console.log(`触发 track -> target: ${target} key:${key}`);
  // 1. 先基于 target 找到对应的 dep
  // 如果是第一次的话，那么就需要初始化
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

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    (activeEffect as any).deps.push(dep);
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

 ```