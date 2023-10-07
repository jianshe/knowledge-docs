# 深入理解javascript原型和闭包—一切都是对象

## javascript中的数据类型

- 值类型

  undefined、null、number、string、boolean

- 引用类型

  函数、数组、对象、new Number(10)

## 对象--若干属性的集合

​	java或者c#中的对象都是new一个class出来的，而且里面有字段、属性、方法，规定的非常严格。但是javascript就比较随意了--数组是对象，函数是对象，对象还是对象。对象里面的一切都是属性，没有方法，那么这样方法如何表示呢？**方法也是一种属性。因为它的属性表示为键值对的形式。**

## javascript中的对象可以任意的扩展属性

```javascript
var obj = {
    a: 10,
    b: function(x) {
        alert(this.a + x);
    },
    c: {
        name: 'albert',
        year: 1990
    }
};
```

以上代码中，obj是一个自定义的对象，其中a、b、c就是它的属性，而且在c的属性值还是一个对象，它又有name，year两个属性。

**函数和数组可以以另一种形式呈现，只要是对象，它就是属性的集合**

```javascript
var fn = function () {
    alert(100);
}
fn.a = 10;
fn.b = function () {
    alert(123);
}
fn.c = {
    name: 'albert',
    year: 1990
}
```

以上代码中，函数就作为对象被赋值了a、b、c三个属性--很明显，这就是属性的集合。

> 一切（引用类型）都是对象，对象是属性的集合，和java和c#完全不一样。

