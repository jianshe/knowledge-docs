# 41-实现 nextTick 功能

## 核心功能

1. 同步任务和微任务。
2. 同步任务收集job，微任务取出来。
3. 把更新的逻辑添加到队列里面。

## 测试案例
```javascript

import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/mini-vue.esm.js";
export default {
  name: "App",
  setup() {
    const count = ref(1);
    const instance = getCurrentInstance();
    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log("update");
        count.value = i;
      }

      console.log("prev instance", instance);

      nextTick(() => {
        console.log("update instance", instance);
      });

      // await nextTick();
      // console.log(instance)
    }

    return {
      onClick,
      count,
    };
  },

  render() {
    const button = h("button", { onClick: this.onClick }, "update");
    const p = h("p", {}, "count: " + this.count);
    return h("div", {}, [button, p]);
  },
};

```

## 核心代码

```javascript

const queque: any[] = [];

let isFlushPending = false;
const p = Promise.resolve();
export function queueJobs(job) {
  if (!queque.includes(job)) {
    queque.push(job);
  }
  queueFlush();
}

export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;

  while ((job = queque.shift())) {
    job && job();
  }
}

```
