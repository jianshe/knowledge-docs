# Typescript中 interface 和 type 的差别是什么？

## 相同点
都可以描述一个对象或者函数

+ interface

```javascript
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}
```
+ type

```javascript
type User = {
  name: string
  age: number
};

type SetUser = (name: string, age: number)=> void;
```

+ 都允许拓展(extends)
interface和type都可以拓展，并且两者并不是相互独立的，也就是说interface可以extends type,type也可以extends interface。虽然效果差不多，但是两者语法不同。

+ interface extends interface 

```javascript
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```

+ type extends type
```javascript
type Name = { 
  name: string; 
}
type User = Name & { age: number  };
```

+ interface extends type 
```javascript
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```
+ type extends interface
```javascript
interface Name { 
  name: string; 
}
type User = Name & { 
  age: number; 
}
```

## 不同点
+ type 可以而interface 不行

type可以声明基本类型别名，联合类型，元组等类型

```javascript
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```

type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```javascript
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```
其它騒操作

```javascript
type StringOrNumber = string | number;  
type Text = string | { text: string };  
type NameLookup = Dictionary<string, Person>;  
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinates = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
```

+ interface可以而type不行

interface 能够声明合并

```javascript
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

/*
User 接口为 {
  name: string
  age: number
  sex: string 
}
*/
```
一般来说，如果不清楚什么时候用interface/type，能用 interface 实现，就用 interface , 如果不能就用 type 。

