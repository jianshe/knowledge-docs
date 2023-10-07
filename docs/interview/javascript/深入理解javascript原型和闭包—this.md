# 深入理解javascript原型和闭包—this

> 在函数中this到底取何值，是在函数真正被调用执行的时候确定的，函数定义的时候确定不了。因为this的取值是执行上下文环境的一部分，每次调用函数，都会产生一个新的执行上下文环境。

## 情况1：构造函数

所谓构造函数就是用来new对象的函数，其实严格来说，所有的函数都可以new一个对象，但是有些函数的定义是为了new一个对象，而有些函数则不是。另外注意，构造函数的函数名第一个字母大写（规则约定）。例如：Object、Array、Function等。

```javascript
function Foo() {
    this.name = 'albet';
    this.year = 1990;
    console.log(this); // Foo {name: 'albert', year: 1990}
}
var f1 = new Foo();
console.log(f1.name); // albert
console.log(f1.year); .. 1990
```

以上代码中，如果函数作为构造函数用，那么其中的this就代表它即将new出来的对象。

**注意，以上仅限new Foo()的情况，即Foo函数作为构造函数的情况。如果直接调用Foo函数，而不是new Foo()，情况就大不一样了。**

```javascript
function Foo() {
    this.name = 'albet';
    this.year = 1990;
    console.log(this); // Window {parent: Window, opener: null, top: Window, length: 3, frames: Window, …}
}
Foo();
```

这种情况下this是window，我们后文中会说到。

## 情况2：函数作为对象的一个属性

如果函数作为对象的一个属性时，**并且作为对象的一个属性被调用时**，函数中的this指向该对象。

```javascript
var obj =  {
    x: 10,
    fn: function() {
        console.log(this); // Object {x: 10, fn: function}
        console.log(this.x); // 10
    }
};
obj.fn();
```

以上代码中，fn不仅作为一个对象的一个属性，而且的确是作为对象的一个属性被调用。结果this就是obj对象。

**注意，如果fn函数不作为obj的一个属性被调用，会是什么结果呢？**

```javascript
var obj =  {
    x: 10,
    fn: function() {
        console.log(this); // Window {parent: Window, opener: null, top: Window, length: 3, frames: Window, …}
        console.log(this.x); // undefined
    }
};
var fn1 = obj.fn;
fn1();
```

如下代码，如果fn函数被赋值到了另一个变量中，并没有作为obj的一个属性被调用，那么this的值就是window，this.x为undefined。

## 情况3：函数用call或者apply调用

当一个函数被call和apply调用时，this的值就取传入的对象的值。

```javascript
var obj = {
    x: 10
};
var fn = function () {
    console.log(this); // Object {x: 10}
    console.log(this.x); // 10
}
fn.call(obj);
```

## 情况4：全局 & 调用普通函数

在全局环境下，this永远是window，这个应该没有非议。

```javascript
console.log(this === window); // true
```

普通函数在调用时，其中的this也都是window。

```javascript
var x = 10;
var fn = function() {
    console.log(this); // Window {parent: Window, opener: null, top: Window, length: 3, frames: Window, …}
    console.log(this.x); // 10
}
fn();
```

以上代码很好理解。

不过下面的情况你需要注意一下：

```javascript
var obj = {
    x: 10,
    fn: function() {
        function f() {
            console.log(this); // Window {parent: Window, opener: null, top: Window, length: 3, frames: Window, …}
        }
        f();
    }
};
obj.fn();
```

函数f虽然是在obj.fn内部定义的，但是它仍然是一个普通的函数，this仍然指向window。

**在es5中，this永远指向最后调用它的那个对象。**

## **怎么改变this的指向**

## 方法1：使用ES6中的箭头函数

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        setTimeout(function () {
            this.func1()
        },100);
    }
};
a.func2()// this.func1 is not a function
```

在不使用箭头函数的情况下，是会报错的，因为最后调用setTimeout的对象是window，但是在window中并没有func1函数。切记：**匿名函数的this永远指向window**

众所周知，ES6的箭头函数是可以避免ES5中使用this的坑的。**箭头函数的this始终指向函数定义时的this，而非执行时。**箭头函数需要记着这句话:**"箭头函数中没有this绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则this绑定的是最近一层非箭头函数的this，否则，this为undefined"。**

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        setTimeout(() => 
          this.func1()
     	},100);
    }
};
a.func2()// albert
```

## 方法2：在函数内部使用_this = this

如果不使用ES6，那么这种方式应该是最简单的不会出错的方式了，我们是先将调用这个函数的对象保存在变量_this中，然后在函数中都使用这个_this，这样_this就不会改变了。

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        var _this = this;
        setTimeout(function() {
            _this.func1()
        },100);
    }
}
a.func2() // albert
```

## 方法3：使用apply、call、bind

使用apply、call、bind函数也是可以改变this的指向的。

**使用apply**

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
        console.log(this.name)     
    },
    func2: function () {
        setTimeout(function() {
            _this.func1()
        }.appply(a),100);
    }
}
a.func2() // albert
```

**使用call**

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
       console.log(this.name)     
    },
    func2: function () {
        setTimeout(function() {
            _this.func1()
        }.call(a),100);
    }
}
a.func2() // albert
```

**使用bind**

```javascript
var name = "windowsName";
var a = {
    name : "albert",
    func1: function () {
       console.log(this.name)     
    },
    func2: function () {
        setTimeout(function() {
            _this.func1()
        }.bind(a),100);
    }
}
a.func2() // albert
```

**bind和apply、call区别**

```javascript
   var a ={
      name : "albert",
       fn : function (a,b) {
            console.log( a + b)
        }
    }
    var b = a.fn;
    b.bind(a,1,2)
```

我们会发现并没有输出，这是为什么呢？我们来看一下 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)  上的文档说明：

> bind()方法创建一个新的函数，当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

所以我们可以看出，bind是创建一个新的函数，我们必须要手动去调用：

```javascript
 var a ={
     name : "albert",
     fn : function (a,b) {
         console.log( a + b)
     }
 }
 var b = a.fn;
 b.bind(a,1,2)() // 3
```