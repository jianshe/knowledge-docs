# 如何中断 Promise？

## 参考答案：

Promise 有个缺点就是一旦创建就无法取消，所以本质上 Promise 是无法被终止的，但我们在开发过程中可能会遇到下面两个需求：

- 中断调用链
  就是在某个 then/catch 执行之后，不想让后续的链式调用继续执行了。

```javascript
somePromise
  .then(() => {})
  .then(() => {
    // 终止 Promise 链，让下面的 then、catch 和 finally 都不执行
  })
  .then(() => console.log("then"))
  .catch(() => console.log("catch"))
  .finally(() => console.log("finally"));
```

一种方法是在 then 中直接抛错, 这样就不会执行后面的 then, 直接跳到 catch 方法打印 err(但此方法并没有实际中断)。但如果链路中对错误进行了捕获，后面的 then 函数还是会继续执行。

Promise 的 then 方法接收两个参数：

```javascript
Promise.prototype.then(onFulfilled, onRejected);
```

若 onFulfilled 或 onRejected 是一个函数，当函数返回一个新 Promise 对象时，原 Promise 对象的状态将跟新对象保持一致，详见 Promises/A+标准。

因此，当新对象保持“pending”状态时，原 Promise 链将会中止执行。

```javascript
Promise.resolve()
  .then(() => {
    console.log("then 1");
    return new Promise(() => {});
  })
  .then(() => {
    console.log("then 2");
  })
  .then(() => {
    console.log("then 3");
  })
  .catch((err) => {
    console.log(err);
  });
```

- 中断 Promise
  注意这里是中断而不是终止，因为 Promise 无法终止，这个中断的意思是：在合适的时候，把 pending 状态的 promise 给 reject 掉。例如一个常见的应用场景就是希望给网络请求设置超时时间，一旦超时就就中断，我们这里用定时器模拟一个网络请求，随机 3 秒之内返回。

```javascript
function timeoutWrapper(p, timeout = 2000) {
  const wait = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("请求超时");
    }, timeout);
  });
  return Promise.race([p, wait]);
}
```
