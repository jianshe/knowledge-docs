# in 运算符和 Object.hasOwnProperty 方法有什么区别？

## hasOwnProperty方法
hasOwnProperty()方法返回值是一个布尔值，指示对象自身属性中是否具有指定的属性，因此这个方法会忽略掉那些从原型链上继承到的属性。

```
  Object.prototype.phone= '15345025546';
  let obj = {
    name: '前端小智',
    age: '28'
  }
  console.log(obj.hasOwnProperty('phone')) // false
  console.log(obj.hasOwnProperty('name')) // true
```

## in运算符
in运算符返回值也是一个布尔值，如果指定的属性在指定的对象或其原型链上，则in运算符返回true。

```
Object.prototype.phone= '15345025546';
  let obj = {
    name: '前端小智',
    age: '28'
  }
  console.log('phone' in obj) // true
  console.log('name' in obj) // true
```
