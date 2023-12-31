# javascript设计模式之装饰者模式

**介绍**

装饰者提供比继承更有弹性的替代方案。 装饰者用于包装同接口的对象，不仅允许你向方法添加行为，而且还可以将方法设置成原始对象调用（例如装饰者的构造函数）。

装饰者用于通过重载方法的形式添加新功能，该模式可以在被装饰者前面或者后面加上自己的行为以达到特定的目的。

**特点**

装饰者模式的特点： 

1. 在不改变原对象的原本结构的情况下进行功能添加。

1. 装饰对象和原对象具有相同的接口，可以使客户以与原对象相同的方式使用装饰对象。
2. 装饰对象中包含原对象的引用，即装饰对象是真正的原对象经过包装后的对象。 

**正文**

装饰者模式中，可以在运行时动态添加附加功能到对象中。当处理静态类时，这可能是一个挑战。在Javascript中，由于对象是可变的，因此，添加功能到对象中的过程本身并不是问题。

装饰者模式的一个比较方便的特征在于其预期行为的可定制和可配置特性。可以从仅具有一些基本功能的普通对象开始，然后从可用装饰资源池中选择需要用于增强普通对象的哪些功能，并且按照顺序进行装饰，尤其是当装饰顺序很重要的时候。 

实现装饰者模式的其中一个方法是使得每个装饰者成为一个对象，并且该对象包含了应该被重载的方法。

每个装饰者实际上继承了目前已经被前一个装饰者进行增强后的对象。

每个装饰方法在“继承的对象”上调用了同样的方法并获取其值，此外它还继续执行了一些操作。 

```javascript
//需要装饰的类（函数）
function Macbook() {
    this.cost = function () {
        return 1000;
    };
}
//计算商品的包装费
function PackagingFee(macbook) {
    this.cost = function () {
        return macbook.cost() + 75;
    };
}
//计算商品的运费
function Freight(macbook) {
    this.cost = function () {
        return macbook.cost() + 300;
    };
}
//计算商品的保险费用
function Insurance(macbook) {
    this.cost = function () {
        return macbook.cost() + 250;
    };
}
// 用法
var myMacbook = new Insurance(new Freight(new PackagingFee(new Macbook())));
console.log(myMacbook.cost());//1625
```

我们简单的分析下上面的代码，上面的代码中，一共定义了四个函数（其中一个需要修饰的函数，三个用于修饰的函数）。

然后，声明一个变量myMacbook指向new出来的Insurance对象，Insurance对象的形参指向new出来的Freight对象，Freight对象的形参指向new出来的PackagingFee对象，PackagingFee对象的形参指向new出来的Macbook对象。 

接下来，调用myMacbook的cost方法。从上面的分析，我们可以得出 myMacbook.cost()的值等于（Freight对象的cost方法+250），Freight对象的cost方法等于（PackagingFee对象的cost方法+300），PackagingFee对象的cost方法等于（Macbook对象的cost方法+75）。 所以最终的结果是：myMacbook.cost()的值 = 250 + (300 + (75 + 1000)) = 1625。 

```javascript
// 用法
var myMacbook = new Insurance(new Freight(new PackagingFee(new Macbook())));
console.log(myMacbook.cost());//1625
//上面的代码等价于下面拆分后的代码，或许拆分后代码你更能看出前后的逻辑性
var macbook = new Macbook();
var package = new PackagingFee(macbook);
var freight = new Freight(package);
var myMacbook = new Insurance(freight);
 
//当然，如果你不想声明这么多变量（macbook、package、freight），只用一个变量也是可以的
var macbook = new Macbook();
macbook = new PackagingFee(macbook);
macbook = new Freight(macbook);
var myMacbook = new Insurance(macbook);
```

再来看看实例2

```javascript
function ConcreteClass() {
    this.performTask = function () {
        this.preTask();
        console.log('doing something');
        this.postTask();
    };
}
function AbstractDecorator(decorated) {
    this.performTask = function () {
        decorated.performTask();
    };
}
function ConcreteDecoratorClass(decorated) {
    this.base = AbstractDecorator;
    this.base(decorated);// add performTask method
    decorated.preTask = function () {
        console.log('pre-calling..');
    };
    decorated.postTask = function () {
        console.log('post-calling..');
    };
}
var concrete = new ConcreteClass();
var decorator1 = new ConcreteDecoratorClass(concrete);
decorator1.performTask();
//pre-calling..
//doing something
//post-calling..
```

实例2实际上和实例1是非常类似的，我们来简单分析下吧。首先，实例2中定义了三个函数，然后声明了两个变量concrete和decorator1，最后调用了decorator1的performTask方法。

粗看一眼，ConcreteDecoratorClass里面好像并没有performTask方法。我们先来分析下面的两行代码：

然后，我们再来逐行分析下ConcreteDecoratorClass函数里面的代码：

说到这里，好像还是没有分析出ConcreteDecoratorClass函数里面有performTask方法，重点是看 **this**！

ConcreteDecoratorClass函数中的this指向new出来的ConcreteDecoratorClass对象（也就是和decorator1指向同一个对象）；
AbstractDecorator函数里面的this关键是看哪个对象来调用这个函数，this就指向哪个对象

**this.base = AbstractDecorator; this.base(decorated)**中我们可以看出是**new出来的ConcreteDecoratorClass对象**在调用AbstractDecorator函数）。

所以AbstractDecorator函数里面的this指向new出来的ConcreteDecoratorClass对象（也和decorator1指向同一个对象）。
总结下来，我们会发现，在上面的代码中，**不管是ConcreteDecoratorClass函数里面的this，还是AbstractDecorator函数里面的this，都指向new出来的ConcreteDecoratorClass对象**。

所以，当我们执行decorator1.performTask()时，它会继续执行匿名函数中的代码（decorated.performTask();），匿名函数中的decorated形参指向new出来的ConcreteClass对象，并执行该对象的performTask方法。

再来看看实例3

```javascript
var tree = {};
tree.decorate = function () {
    console.log('Make sure the tree won't fall');
};
tree.getDecorator = function (deco) {
    tree[deco].prototype = this;
    return new tree[deco];
};
tree.RedApples = function () {
    this.decorate = function () {
        this.RedApples.prototype.decorate(); // 第7步：先执行原型（这时候是Angel了）的decorate方法
        console.log('Add some red apples'); // 第8步 再输出 red
        // 将这2步作为RedApples的decorate方法
    }
};
 
tree.BlueApples = function () {
    this.decorate = function () {
        this.BlueApples.prototype.decorate(); // 第1步：先执行原型的decorate方法，也就是tree.decorate()
        console.log('Put on some blue apples'); // 第2步 再输出blue
        // 将这2步作为BlueApples的decorate方法
    }
};
 
tree.Angel = function () {
    this.decorate = function () {
        this.Angel.prototype.decorate(); // 第4步：先执行原型（这时候是BlueApples了）的decorate方法
        console.log('An angel on the top'); // 第5步 再输出angel
        // 将这2步作为Angel的decorate方法
    }
};
 
tree = tree.getDecorator('BlueApples'); // 第3步：将BlueApples对象赋给tree，这时候父原型里的getDecorator依然可用
tree = tree.getDecorator('Angel'); // 第6步：将Angel对象赋给tree，这时候父原型的父原型里的getDecorator依然可用
tree = tree.getDecorator('RedApples'); // 第9步：将RedApples对象赋给tree
 
tree.decorate(); // 第10步：执行RedApples对象的decorate方法
//Make sure the tree won't fall
//Add blue apples
//An angel on the top
//Put on some red apples
```

实例3看起来很复杂，实际上分析逻辑还是和前面两个实例一样，我们可以看出实例3中一共声明了5个函数表达式。我们重点分析下下面的代码：

```javascript
//tree.getDecorator('BlueApples')返回new出来的tree.BlueApples的实例对象，并将该对象赋值给空的tree对象
tree = tree.getDecorator('BlueApples'); //new出来的tree.BlueApples的实例对象的原型指向 --> 空对象tree
 
//tree.getDecorator('Angel')返回new出来的tree.Angel的实例对象（这行代码中的第二个tree已经是上面一行代码运行结果后的tree.BlueApples的实例对象）
tree = tree.getDecorator('Angel'); //new出来的tree.Angel的实例对象的原型指向 --> tree.BlueApples的实例对象
 
//tree.getDecorator('RedApples')返回new出来的tree.RedApples的实例对象（这行代码中的第二个tree已经是上面一行代码运行结果后的tree.Angel的实例对象）
tree = tree.getDecorator('RedApples'); //new出来的tree.RedApples的实例对象的原型指向 --> tree.Angel的实例对象
 
//调用tree.decorate()，这里的tree已经是new出来的tree.RedApples的实例对象了。
//tree.RedApples的实例对象的decorate属性方法里面的第一行代码是 “this.RedApples.prototype.decorate()”
//结合上面的分析可以得出以下的原型链结构：
//this.RedApples.prototype --> tree.Angel;
//tree.Angel.prototype --> tree.BlueApples;
//tree.BlueApples.prototype --> 空对象tree
tree.decorate();
```

**总结**

装饰者模式是为已有功能动态地添加更多功能的一种方式，把每个要装饰的功能放在单独的函数里，然后用该函数包装所要装饰的已有函数对象，因此，当需要执行特殊行为的时候，调用代码就可以根据需要有选择地、按顺序地使用装饰功能来包装对象。优点是把类（函数）的核心职责和装饰功能区分开了。