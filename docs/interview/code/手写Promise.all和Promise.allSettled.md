# 手写 Promise.all

```javascript
function customPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);

    let completedCount = 0;

    promises
      .forEach((promise, index) => {
        Promise.resolve(promise).then((value) => {
          results[index] = value;
          completedCount++;

          if (completedCount === promises.length) {
            resolve(results);
          }
        });
      })
      .catch(reject);
  });
}

// 示例用法：
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

customPromiseAll([promise1, promise2, promise3])
  .then((values) => {
    console.log(values); // [1, 2, 3]
  })
  .catch((error) => {
    console.error(error);
  });
```

## 手写 Promise.allSettled 方法

```javascript
function customPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let completedCount = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          completedCount++;

          if (completedCount === promises.length) {
            resolve(results);
          }
        });
    });
  });
}

// 示例用法：
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject("Error occurred");
const promise3 = Promise.resolve(3);

customPromiseAllSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  /*
    [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: "Error occurred" },
      { status: "fulfilled", value: 3 }
    ]
    */
});
```
