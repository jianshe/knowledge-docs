# Function.prototype.bind

> 大部分高级浏览器都实现了内置的Function.prototype.bind，用来指定函数内部的this指向，即使没有原生的Function.prototype.bind实现，我们来模拟一个也不是难事 ，代码如下：

```javascript
Function.prototype.bind = function(context) {
    var self = this; // 保存原函数
    return function() {
        return self.apply(context,arguments); // 执行新的函数的时候，会反之前传入的context当作新函数体内的this
    }
};

var obj = {
    name: 'sven'
}
var func = function() {
    alert(this.name); // 输出: sven
}.bind(obj)

func();
```

​    我们通过Function.prototype.bind来"包装"func函数，并且传入一个对象context当作参数，这个context对象就是我们想修正的this对象。

​    在Function.prototype.bind的内部实现中，我们先把func函数的引用保存起来，然后返回一个新的函数。当我们在将来执行func函数时，实际上先执行的是这个刚刚返回的新函数。在新函数内部self.apply(context,arguments)这句代码才是执行原来的func函数，并且指定context对象为func函数体内的this。

​	这是一个简化版的Function.prototype.bind实现，通常我们还会把它实现得稍微复杂一点，使得可以往函数中预先填入一些参数：

```javascript
Function.prototype.bind = function() {
    var self = this, //保存原函数
        context = [].shift.call(arguments), //需要绑定的this上下文
        args = [].slice.call(arguments); // 剩余的参数转成数组
        return function() { // 返回一个新的函数
             return self.apply(context, [].concat.call(args,[].slice.call(arguments)));
             // 执行新的函数的时候，会把之前传入的context当作新函数体内的this
             // 并且组合两次分别传入的参数，作为新函数的参数
        }
};

var obj = {
    name: 'sven'
}
var func = function(a,b,c,d) {
    alert(this.name); // 输出: sven
    alert([a,b,c,d]); // 输出:[1,2,3,4]
}.bind(obj,1,2);

func(3,4);
```

