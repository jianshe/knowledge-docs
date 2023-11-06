# ES6中数组新增了哪些扩展?

## 以下是一些ES6中数组新增的扩展：
+ 扩展运算符（Spread operator）: 使用... 语法可以将一个数组展开成多个独立的元素，或者将多个元素合并为一个数组。
+ Array.from(); 通过类似数组的对象或可迭代对象创建一个新的数组。
+ Array.of(): 创建一个由传入参数组成的新数组。
+ find()和findIndex():用于在数组中查找满足指定条件的每一个元素及其索引。
+ includes(): 检查数组是否包含指定的元素，并返回布尔值。
+ fill(): 使用指定的值填充数组的所有元素。
+ flat()和flatMap():用于将嵌套的数组展平;减少维度。
+ map()、filter()、reduce()、forEach()等方法的回调函数支持箭头函数语法。
+ entries()、keys()和values():用于遍历数组的键值对、键和值。
+ 数组解构赋值：可以通过解构赋值从数组中提取值并赋给变量。
+ 数组的扩展属性：Array.prototype.length 可以被修改，Array.prototype[@@toStringTag] 返回 "Array"。