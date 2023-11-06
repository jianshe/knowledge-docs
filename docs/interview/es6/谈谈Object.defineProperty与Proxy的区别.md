# 谈谈 Object.defineProperty 与 Proxy 的区别

## 参考答案：

在 Vue2.x 的版本中，双向绑定是基于 Object.defineProperty 方式实现的。而 Vue3.x 版本中，使用了 ES6 中的 Proxy 代理的方式实现。

## Object.defineProperty(obj, prop, descriptor)

使用 Object.defineProperty 会产生三个主要的问题：

- 不能监听数组的变化
  在 Vue2.x 中解决数组监听的方法是将能够改变原数组的方法进行重写实现（比如：push、 pop、shift、unshift、splice、sort、reverse），举例：

```javascript
// 我们重写 push 方法
const originalPush = Array.prototype.push;

Array.prototype.push = function () {
  // 我们在这个位置就可以进行 数据劫持 了
  console.log("数组被改变了");

  originalPush.apply(this, arguments);
};
```

- 必须遍历对象的每个属性
  可以通过 Object.keys() 来实现

- 必须深层遍历嵌套的对象
  通过递归深层遍历嵌套对象，然后通过 Object.keys() 来实现对每个属性的劫持

## Proxy

- Proxy 针对的整个对象，Object.defineProperty 针对单个属性，这就解决了 需要对对象进行深度递归（支持嵌套的复杂对象劫持）实现对每个属性劫持的问题

```javascript
// 定义一个复杂对象
const obj = {
  obj: {
    children: {
      a: 1,
    },
  },
};

const objProxy = new Proxy(obj, {
  get(target, property, receiver) {
    console.log("-- target --");
    return Reflect.get(target, property, receiver);
  },

  set(target, property, value, receiver) {
    console.log("-- set --");
    return Reflect.set(target, property, value, receiver);
  },
});

console.log(objProxy.obj); // 输出 '-- target --'
console.log((objProxy.a = 2)); // 输出 '-- set --'
```

- Proxy 解决了 Object.defineProperty 无法劫持数组的问题

```javascript
const ary = [1, 2, 3];

const aryProxy = new Proxy(ary, {
  get(target, property, receiver) {
    console.log("-- target --");
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log("-- set --");
    return Reflect.set(target, property, value, receiver);
  },
});

console.log(aryProxy[0]); // 输出 '-- target --'
console.log(aryProxy.push(1)); // 输出 '-- set --'
```

- 比 Object.defineProperty 有更多的拦截方法，对比一些新的浏览器，可能会对 Proxy 针正对性的优化，有助于性能提升
