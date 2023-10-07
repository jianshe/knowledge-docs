# javascript设计模式之--单例模式

>  单例设计模式：保证一个类仅有一个实例，并且提供一个访问它的全局访问点。有些对象只需要一个，这时可用单例模式。

**介绍**

在传统开发工程师眼里，单例就是保证一个类只有一个实例，实现的方法一般是先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。在JavaScript里，单例作为一个命名空间提供者，从全局命名空间里提供一个唯一的访问点来访问该对象。

**如何实现**

1.传统的单例模式。

- 和new创建对象的调用不一样
- 调用者要调用xxx.getInstance才能获取该单例

```javascript
var Singleton = function(name) {
    this.name = name;
    this.instance = null;
}
Singleton.prototype.getName = function() {
    alert(this.name)
}
Singleton.getInstance = function() {
    if (!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance;
};
var a = Singleton.getInstance('amy');
var b = Singleton.getInstance('ben');
alert(a === b);
```

2.使用闭包方式实现。

- 和new创建对象的调用不一样
- 调用者要调用xxx.getInstance才能获取该单例

```javascript
var Singleton = function(name){
 this.name = name;
}
Singleton.prototype.getName = function(){
 return this.name;
}
Singleton.getInstance = (function(){
 var instance;
 return function(name){
  if(!instance){
   instance = new Singleton(name);
  }
  return instance;
 }
})();
 
var a = Singleton.getInstance("amy");
var b = Singleton.getInstance("ben");
alert(a === b);

```

3.使用对象字面量的方法，其字面量里可以包含大量的属性和方法：  

```javascript
var mySingleton = {
    property1: "something",
    property2: "something else",
    method1: function () {
        console.log('hello world');
    }
};
```

如果以后要扩展该对象，你可以添加自己的私有成员和方法，然后使用闭包在其内部封装这些变量和函数声明。只暴露你想暴露的public成员和方法，样例代码如下：

```javascript
var mySingleton = function () {
    /* 这里声明私有变量和方法 */
    var privateVariable = 'something private';
    function showPrivate() {
        console.log(privateVariable);
    }
    /* 公有变量和方法（可以访问私有变量和方法） */
    return {
        publicMethod: function () {
            showPrivate();
        },
        publicVar: 'the public can see this!'
    };
};

var single = mySingleton();
single.publicMethod();  // 输出 'something private'
console.log(single.publicVar); // 输出 'the public can see this!'
```

4.**惰性单例**

- 惰性单例是指在需要的时候才创建
- 🌰：调用getInstance方法，创建Singleton对象，可以多次调用getInstance方法，Singleton对象是单例的

```javascript
var Singleton = (function () {
    var instantiated;
    function init() {
        /*这里定义单例代码*/
        return {
            publicMethod: function () {
                console.log('hello world');
            },
            publicProperty: 'test'
        };
    }
    return {
        getInstance: function () {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    };
})();
/*调用公有的方法来获取实例:*/
Singleton.getInstance().publicMethod();
```

**应用场景**

其实单例一般是用在系统间各种模式的通信协调上，下面的代码是一个单例的最佳实践： 

```javascript
var SingletonTester = (function () {
    //参数：传递给单例的一个参数集合
    function Singleton(args) {
        //设置args变量为接收的参数或者为空（如果没有提供的话）
        var args = args || {};
        //设置name参数
        this.name = 'SingletonTester';
        //设置pointX的值
        this.pointX = args.pointX || 6; //从接收的参数里获取，或者设置为默认值
        //设置pointY的值
        this.pointY = args.pointY || 10;
    }

    //实例容器
    var instance;
    var _static = {
        name: 'SingletonTester',
        //获取实例的方法
        //返回Singleton的实例
        getInstance: function (args) {
            if (instance === undefined) {
                instance = new Singleton(args);
            }
            return instance;
        }
    };
    return _static;
})();

var singletonTest = SingletonTester.getInstance({ pointX: 5 });
console.log(singletonTest.pointX); // 输出 5 
```

**小结**

单例模式用到了闭包和高阶函数的特性。单例模式是简单但常用到的模式，比如单页应用、websocket连接等等。特别是惰性单例模式，用到时才创建，再次用到是不需要再次创建。创建对象和管理单例的职责分布在不同的方法中，方便扩展和管理。 