# Promise 的 finally 怎么实现的？

## Promise.prototype.finally方法是ES2018引入的一个方法，用于在Promise执行结束后无论成功与否都会执行的操作。在实际应用上，finally方法通常用于释放资源、清理代码或更新UI界面等操作。

## 以下是一个简单的实现方式：

```javascript
Promise.prototype.finally = function(callback) {
  const P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
}
```

我们定义了一个名为finally的函数，它使用了Promise原型链的方式实现了finally方法。该函数接收一个回调函数作为参数，并返回一个新的Promise对象。如果原始Promise成功，则会先调用callback函数，然后将结果传递给下一个Promise;如果失败，则会先调用callback函数，然后将错误信息抛出。  
可以看到，在实现中，我们首先调用通过this.constructor获取当前Promise实例的构造函数，然后分别处理Promise的resolved和rejected状态的情况。在resolved状态时，我们先调用callback函数，然后将结果传递给新创建的Promise对象;在rejected状态时，我们也是先调用callback函数，然后将错误抛出。  
这样，我们就完成了Promise.prototype.finally()方法的实现。