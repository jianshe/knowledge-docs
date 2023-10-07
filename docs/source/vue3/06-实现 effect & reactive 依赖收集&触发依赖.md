# 06-实现 effect & reactive 依赖收集&触发依赖

## 实现effect

## 核心功能 
1. 依赖收集。
2. 触发依赖。

```javascript
class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this
    this._fn();
  }
}

const targetMap = new Map()

export function track (target,key) {
    // target -> key -> dep
    let depsMap = targetMap.get(target);

    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }

    let dep = depsMap.get(key)

    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    dep.add(activeEffect)

}

export function trigger(target,key) {
    
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    for(const effect of dep) {
        effect.run()
    }
}


let activeEffect;
export function effect(fn) {
  // fn
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}



```

## 实现reactive

## 核心功能 
1.通过proxy代理，添加set，get函数。
2.通过get函数收集依赖，通过set函数触发依赖。

```javascript
import { track,trigger } from "./effect"

export function reactive(raw) {

    return new Proxy(raw,{
        get(target,key) {
            // {foo:1}
            // foo

            const res = Reflect.get(target,key)

            track(target,key)

            return res
        },
        set(target,key,value) {
            const res = Reflect.set(target,key,value)
            // Todo 触发依赖

            trigger(target,key)
            return res;
        }
    })
}
```
