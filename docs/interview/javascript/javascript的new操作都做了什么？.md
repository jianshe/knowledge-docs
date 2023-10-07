# javascript的new操作都做了什么？ 

先看下面的伪代码：

```javascript
var a = new MyFunction("Mr", "Albert");
new MyFunction{
    var obj = {};
    obj.__proto__ = MyFunction.prototype;
    var result = MyFunction.call(obj, "Mr", "Albert");
    return typeof result === 'obj' ? result : obj;
}
```

- 创建一个空对象obj;
- 将新对象的空对象的隐式原型指向其构造函数的显式原型。
- 使用call改变this的指向
- 如果无返回值或者返回一个非对象值，则将obj返回作为新对象；如果返回值是一个新对象的话那么直接返回该对象。

所以我们可以看到，在new的过程中，我们是使用call改变了this的指向。