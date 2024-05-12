# 说说你对 ToPrimitive 的理解

## 参考答案：

ToPrimitive 是一个抽象操作，用于将一个值转换为原始值（primitive value），即字符串、数字或布尔值。

在 JavaScript 中，当需要将一个非原始值用作原始值时，会自动调用 ToPrimitive 操作。例如，在使用加法运算符时，如果其中一个操作数不是原始值，则会将其转换为原始值，这就是通过调用 ToPrimitive 来实现的。

ToPrimitive 操作的实现方式如下：

- 如果该值已经是原始类型，则直接返回该值。
- 如果该值是对象，则按照以下步骤进行转换：
  - 调用 valueOf() 方法并返回结果，如果结果是原始类型则直接返回该结果。
  - 调用 toString() 方法并返回结果，如果结果是原始类型则直接返回该结果。
- 如果都不是原始类型，则抛出 TypeError 异常。

## 示例

```javascript
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return 123;
      case "string":
        return "str";
      case "default":
        return "default";
      default:
        throw new Error();
    }
  },
};

2 * obj; // 246
3 + obj; // '3default'
obj == "default"; // true
String(obj); // 'str'
```
