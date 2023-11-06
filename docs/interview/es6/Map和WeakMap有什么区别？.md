# Map 和 WeakMap 有什么区别？

## 参考答案：

## Map

### 1.传统对象结构

Map 本质上是一个键值对的集合。和传统对象结构相比，传统对象只能用字符串作为键名，这在使用上造成了很大的限制。

```javascript
const data = {};
//element为节点对象
const element = document.querySelector(".node");
console.log(element); //输出div.node对象
console.log(element.toString());
//用点操作符不能有空格，所以采用中括号的形式给对象赋值
data[element] = "objectData";
//输出objectData，说明在对象中存在[object HTMLDivElement]键名
console.log(data["[object HTMLDivElement]"]);
```

上面带代码中，我们创建了一个对象并将一个节点对象作为它的键名，并进行了代码测试，首先验证了获取到的 element 节点为一个对象，再确定了经过 toString 方法转化后的结果，以这个值为键名成功的输出了 value 值 objectData。

上面的代码证明了传统对象的键名会通过 toString 方法转化为字符串类型

注意：在我们访问对象成员的时，键名有空格时不能采用点访问，例如 data.ab c 这是错误的。我们可以用 data['ab c']的形式访问

### 2.Map 结构

Map 类似于对象，但是键名不限于字符串，可以说 Object 结构提供键值对应，Map 提供值值对应，因此采用 Map 结构会优于传统对象。

```javascript
const dataMap = new Map();
const element = document.querySelector(".node");
dataMap.set(element, "objectData");
console.log(dataMap.get(element));
console.log(dataMap);
```

上面的代码中我们获取值时直接传入了 element 对象，成功将对象作为键名，弥补了传统对象的不足。

### 3.Map 的特点

- Map 默认情况下不包含任何键，所有键都是自己添加进去的。不同于 Object 原型链上有一写默认的键。
- Map 的键可以时任何类型数据，就连函数都可以。
- Map 的键值对个数可以轻易通过 size 属性获取，Object 需要手动计算。
- Map 在频繁增删键值对的场景下性能比 Object 更好。

## 4.什么时候用 Map

- 想要添加的键值名和 Object 上的默认键值名冲突，又不想改名，用 Map。
- 需要 String 和 Symbol 以外的数据类型做键值时，用 Map。
- 键值对很多，有时需要计算数量，用 Map。
- 需要频繁地增删键值对时，用 Map。

## WeakMap

### 什么是 WeakMap

WeakMap 是 ES6 中新增的一种集合类型，叫做'弱映射'。它和 Map 是兄弟关系，与 Map 的区别在于这个弱字，API 还是 Map 那套 API

### WeakMap 的特性

### 1. WeakMap 只能将对象作为键名

只接受对象作为键名(null 除外)，不接受其它类型的值作为键名。

### 2.WeakMap 的键名引用的对象是弱引用

首先我们需要知道什么是强引用什么是弱引用

### 强引用

```javascript
const e1 = document.getElementById("foo");
const e2 = document.getElementById("bar");
const arr = [
  [e1, "foo"],
  [e2, "bar"],
];
```

上面的代码中 e1 和 e2 是两个对象，通过 arr 数组对这两个对象添加一些文字说明。但是这样就形成了 arr 对 e1 和 e2 的引用，而这种引用又是强引用。它的区别就体现在这。当我们不再需要这两个对象时，我们必须手动删除这个引用，接触 arr 对两个对象的引用关系，否则垃圾回收机制不会释放 e1 和 e2 占用的内存。因为 arr 仍然存在着对对象的引用。

```javascript
arr[0] = null;
arr[1] = null;
```

### 弱引用

是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象若只被弱引用所引用，则被认为是不可访问的，并因此可能在任何时刻被回收。

也就是说当我们创建一个弱引用的对象时，我们就可以静静地等待其被垃圾回收器回收。

总的来说，局势 WeakMap 保持了对键名所引用对象的弱引用，即垃圾回收机制不将该引用考虑在内。只要所引用的对象的其它引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不需要手动删除引用。

### 3.不可遍历

正因为 WeakMap 对键名引用的对象是弱引用关系 ，因此 WeakMap 内部成员是会取决于垃圾回收机制有没有执行，运行前后成员个数很可能是不一样的，而垃圾回收机制的执行又是不可预测的，因此不可遍历。

## Map 和 WeakMap 区别

- Map 的键可以是任意类型，WeakMap 只接受对象作为键，不接受其它类型的值作为键
- Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键；WeakMap 的键是弱引用，键所指向的对象是可以被垃圾回收，此时键是无效的。
- Map 可以被遍历，WeakMap 不能被遍历
