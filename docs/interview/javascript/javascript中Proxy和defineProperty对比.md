# javascript中Proxy和defineProperty对比

> 在2020年来看Proxy早已经不是一个陌生的词了，他能做的是有很多，尤其在vue3.0通过proxy来重构之后。

下面我们着重讲解一下Proxy和Object.defineProperty的对比。

Proxy是专门为对象设置访问代理器的，通过Proxy可以轻松监视到对象的读写过程，相比于defineProperty，Proxy他的功能要更为强大甚至使用起来也更为方便。

这里我们定义一个person对象，我们通过new Proxy的方式来去为我们的person来创建一个代理对象。

Proxy构造函数的第一个参数就是我们需要代理的对象，这里是person，第二个参数也是一个对象，我们可以把这个对象称之为代理的处理对象，这个对象中可以通过get方法来去监视属性的访问，通过set方法来去介绍对象当中设置属性这样的一个过程。

```javascript
const person = {
    name: 'albert',
    age: 18
}
const personProxy = new Proxy(person, {
    get() {},
    set() {}
})
```

再来看下set方法，这个方法默认接收三个参数，分别是代理目标对象，以及我们要写入的属性名称还有最后我们要写入的属性值。我们可以做一些校验，比如说如果设置的是age,它的值就必须是整数，否则就抛错。

```javascript
{
    set(targe,property,value) {
        console.log(target,property,value);
        if (property === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError(`${value} must be a integer`);
            }
        }
        target[property] = value;
    }
}
```

相比于Object.defineProperty,Proxy到底有哪些优势。

首先最明显的优势就是在于Proxy要更为强大一些，那这个强大具体体现在Object.defineProperty只能监听到对象属性的读取或者写入，而Proxy除读写外还可以监听对象中属性的删除，对象当中方法的调用等等。

第二个优势就是对于数组对象进行监视，通过我们想要监视数组的变化，基本要依靠重写数组方法，这也是vue的实现方式，proxy可以直接监视数组的变化。以往我们想要通过Object.defineProperty去监视数组的操作最常见的方式是重写数组的操作方法，这也是vue.js中所使用的方式，大体的方式就是通过自定义的方法去覆盖掉数组原型对象上的push，shift之类的方法，以此来劫持对应的方法调用的过程。