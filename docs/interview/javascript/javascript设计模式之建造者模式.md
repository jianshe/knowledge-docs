# javascript设计模式之建造者模式 

**介绍**

在软件系统中，有时候面临着“一个复杂对象”的创建工作，其通常由各个部分的子对象用一定的算法构成；由于需求的变化，这个复杂对象的各个部分经常面临着剧烈的变化，但是将它们组合在一起的算法确相对稳定。如何应对这种变化？如何提供一种“封装机制”来隔离出“复杂对象的各个部分”的变化，从而保持系统中的“稳定构建算法”不随着需求改变而改变？这就是要说的建造者模式。

建造者模式可以将一个复杂对象的构建与其表示相分离，使得同样的构建过程可以创建不同的表示。也就是说如果我们用了建造者模式，那么用户就需要指定需要建造的类型就可以得到它们，而具体建造的过程和细节就不需要知道了。

**正文**

这个模式相对来说比较简单，先上代码，然后再解释

```javascript
function getBeerById(id, callback) {
    // 使用ID来请求数据，然后返回数据.
    asyncRequest('GET', 'beer.uri?id=' + id, function (resp) {
        // callback调用 response
        callback(resp.responseText);
    });
}

var el = document.querySelector('#test');
el.addEventListener('click', getBeerByIdBridge, false);

function getBeerByIdBridge(e) {
    getBeerById(this.id, function (beer) {
        console.log('Requested Beer: ' + beer);
    });
}
```

根据建造者的定义，表相即是回调，也就是说获取数据以后如何显示和处理取决于回调函数，相应地回调函数在处理数据的时候不需要关注是如何获取数据的，同样的例子也可以在jquery的ajax方法里看到，有很多回调函数（比如success, error回调等），主要目的就是职责分离。

建造者模式看名字我们首先想到的就是造房子.建造者模式就像是施工团队,包工头和客户沟通建房的具体建房需细节,然后在自己团队内部发布任务,将复杂的建房工程分成了若干小组,各小组分工合作最终得到需求的房子. 

假设我们需要建设一套6人住,150平方m²,中式风格的房子,此时我们使用建造者模式就非常合适

```javascript
 let Builder = (function () {
     // 决定房子入住人数
     function rooms(peopleCount) {
         if(peopleCount <= 0) throw new Error("入住人数异常");
         this.peopleCount = peopleCount < 3 ? 2 : peopleCount 
     }
     //决定房子面积
     function setArea(area){
         if(area <= 20) throw Error("房子面积过小")
         this.area = area
     }
     //决定房子风格
     function style(style){
         this.style = style
     }
     return class {
         constructor(PeopleCount,area,Style){
             // 住几人，预算多少(万)，风格
             rooms.call(this, PeopleCount)
             setArea.call(this, area);
             style.call(this, Style)
         }
     }
 })();
 let bighouse = new Builder(3,100,'中式'),
	smallHouse = new Builder(3,50,'欧式'); 

```

关键点:

```javascript
let Builder = (function () {
    //表示部分可以独立的进行维护和修改，而不受构建部分的约束
    function rooms(){}
    function setArea(){}
    function style(){}
    //构建部分
    return class {
    }
})();
```

通过上面的例子我们也对建造者模式的概念用来一定的了解。

建造者模式使得我们仅仅只通过定义对象的类型和内容,就可以构建复杂的对象,为我们屏蔽了明确创造或展现对象的过程. 

下面是一个简单的构建dom元素的demo

```javascript
 let BuilddEle = (function (params) {
     		// 构建dom元素
            function createEle(eleName) {
                this.ele = document.createElement(eleName);
            }
     		// 渲染dom元素的文本
            function setText(text) {
                this.ele.textContent = text;
            }
     		// 设置dom元素的样式
            function setStyle(style) {
                Object.entries(style).forEach(([key,val]) =>{
                    // 如果要设置的属性为数组中的某项,
                    if (["width", "height","margin","padding"].includes(key)) {
                        if(typeof val !== "string") throw new Error( key + '--prototype type Error');
                         if(!val.includes("px")){
                           console.warn(key + "应该添加px结尾");
                           this.ele.style[key] = val + "px";
                        }
                        this.ele.style[key] = val;
                    } else {
                        this.ele.style[key] = val
                    }
                })
            }
     		// 设置dom元素的属性
            function setAttr(attrS){
                // 将要设置的对象的键值对进行遍历,并解构
               Object.entries(attrS).forEach(([key,val]) =>{
                  this.ele.setAttribute(key,val)
               })
            }
            return class{
              constructor(eleName,text,styles,attrs){
                  // 构建dom元素的部分
                    createEle.call(this,eleName);
                    setText.call(this,text);
                    setStyle.call(this, styles);
                    setAttr.call(this,attrs)
              }
                // 将构建的dom元素渲染到指定的目标元素上
              render(target){
                  //如果传入的是一个dom元素
                    if(target instanceof Node){
                        target.appendChild(this.ele)
                        // 如果传入
                    }else if(typeof target === "string"){
                        let targelEle =  document.querySelector(target);
                        // 如果获取的dom元素为空则抛出错误
                        if(targelEle === null) throw new Error('the target element was not obtained');
                        targelEle && targelEle.appendChild(this.ele);
                    }else{
                         document.body.append(this.ele)
                    }
              }
          }
        })();
        let style = { width: 100, height: 100, color: "white", backgroundColor: "red" }
        let div = new BuilddEle('div',"ddd", style,{class:'age'});
        div.render()

```

**总结**

建造者模式主要用于“分步骤构建一个复杂的对象”，在这其中“分步骤”是一个稳定的算法，而复杂对象的各个部分则经常变化，其优点是：建造者模式的“加工工艺”是暴露的，这样使得建造者模式更加灵活，并且建造者模式解耦了组装过程和创建具体部件，使得我们不用去关心每个部件是如何组装的。

当我们构造的对象,内部结构非常复杂时,使用建造者模式将内部模块分开创建就非常合适. 