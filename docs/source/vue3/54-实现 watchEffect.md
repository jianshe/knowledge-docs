# 54-实现 watchEffect


## 核心功能
1. 默认情况下，观察器将在组件渲染之前运行。
2. 和vue的运行时强相关。
3. 通过flush可以在组件渲染之后运行。

1. 接收一个函数，当函数里面的影响式对象发生改变了，会在组件渲染之前来进行调用。
2. 使用StopHandle，会返回一个stopHandle，当调用stopHandle,会把之前收集到的所有依赖全部清除掉。
3. onCleanup，通过onCleanup，我们可以传递一个函数,在下一次执行watchEffect之前，来进行一个调用。

## 单元测试

```javascript

import { reactive } from "../../reactivity/src";
import { watchEffect } from "../src/apiWatch";
import { nextTick } from "../src/scheduler";

describe("api: watch", () => {
  it("effect", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(dummy).toBe(1);
  });

  it("stopping the watcher (effect)", async () => {
    const state = reactive({ count: 0 });
    let dummy;
    const stop: any = watchEffect(() => {
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    stop();
    state.count++;
    await nextTick();
    // should not update
    expect(dummy).toBe(0);
  });

  it("cleanup registration (effect)", async () => {
    const state = reactive({ count: 0 });
    const cleanup = vi.fn();
    let dummy;
    const stop: any = watchEffect((onCleanup) => {
      onCleanup(cleanup);
      dummy = state.count;
    });
    expect(dummy).toBe(0);

    state.count++;
    await nextTick();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    stop();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});


```

## 核心代码

```javascript

import { ReactiveEffect } from "@guide-mini-vue/reactivity";

import { queuePreFlushCb } from "./scheduler";

export function watchEffect(source) {
  function job() {
    effect.run();
  }

  let cleanup;

  const onCleanup = function (fn) {
    cleanup = effect.onStop = () => {
      fn();
    };
  };

  function getter() {
    if (cleanup) {
      cleanup();
    }
    source(onCleanup);
  }

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushCb(job);
  });

  effect.run();

  return () => {
    effect.stop();
  };
}


```