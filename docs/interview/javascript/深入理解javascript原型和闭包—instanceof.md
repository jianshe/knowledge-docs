# 深入理解javascript原型和闭包—instanceof

> 对于值类型，你可以通过typeof判断，string/number/boolean都很清楚，但是typeof在判断引用类型的时候，返回值只有object/function，你不知道它到底是一个object对象，还是数组，还是new Number等等。

## instanceof 可以清楚判断出引用类型的类型

```javascript
function Foo() {}
var f1 = new Foo();
console.log(f1 instanceof Foo); // true
console.log(f1 instanceof Object); // true
```
![16f879b5b51541a1](../images/javascript/181635468939277.png)

上图中，f1这个对象是被Foo创建的，但是"f1 instanceof Object"为什么是true呢？

## instanceof 判断规则

​	Instanceof 运算符的第一个变量是一个对象，暂时称为A；第二个变量一般是一个函数，暂时称为B。

​	Instanceof 的判断规则是：**沿着A的proto这条线来找，同时沿着B的prototype这条线来找，如果两条线能找到同一个引用，即同一个对象，那么就返回true。如果找到终点还未重合，则返回false。**

按照以上规则，很容易看出来，就是true。

通过以上规则，你可以理解很多比较怪异的现象，例如：

```javascript
console.log(Object instanceof Function); // true
console.log(Function instanceof Object); //true
console.log(Function instanceof Function); // true
```

这些看似很混乱的东西，答案却都是true，这是为何？见下图：

![16f879b5b51541a1](../images/javascript/181637013624694.png)

看这个图片，千万不要嫌烦，必须一条线一条线挨着分析。

问题来了，Instanceof这样设计，到底有什么用？到底Instanceof想表达什么呢？

重点就这样被这位老朋友给引出来了--继承--原型链。

即，instanceof表示的就是一种继承关系，或者原型链的结构。
> 下节重点讲述继承和原型链