# typescript 中的is关键字有什么用？

## 参考答案
TypeScript中的is 关键字用于类型保护，可以在运行时判断一个对象是否属于某个类型，并根据不同的类型执行不同的逻辑。  
具体来说，is关键字通常和instanceof 运算符一起使用，用于判断一个对象是否是某个类的实例。例如：

```javascript
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Dog extends Animal {
    breed: string;
    constructor(name: string, breed: string) {
        super(name);
        this.breed = breed;
    }
}

function isDog(animal: Animal): animal is Dog {
    return (animal as Dog).breed !== undefined;
}

let a1 = new Animal("Tom");
let d1 = new Dog("Tony", "Poodle");

console.log(isDog(a1));  // false
console.log(isDog(d1));  // true
```
在上面的代码中，我们定义了一个isDog函数，它接受一个Animal类型的参数，返回值是一个布尔值。如果这个参数是Dog类型的实例，则返回true;返回false。注意，这里我们使用animal is Dog 语法来显式地指定返回值类型为布尔值，表示这个函数就是一个类型谓词函数。  
在isDog函数中，我们通过判断传入的animal参数是否含有breed属性，来判断它是否是Dog类型的实例。如果是，则返回true;否则返回false。  
最后，我们可以通过调用isDog函数来判断一个对象是否是Dog类型的实例，并根据不同的类型执行相应的逻辑。