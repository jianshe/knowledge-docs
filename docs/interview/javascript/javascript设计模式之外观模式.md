# javascript设计模式之外观模式

  也可译为门面模式。它为子系统中的一组接口提供一个一致的界面， Facade模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。引入外观角色之后，使用者只需要直接与外观角色交互，使用者与子系统之间的复杂关系由外观角色来实现，从而降低了系统的耦合度。

​    比如在家要看电影，需要打开音响，再打开投影仪，再打开播放器等等，引入外观角色之后，只需要调用“打开电影设备”方法就可以。外观角色封装了打开投影仪等操作，给使用者提供更容易使用的方法。

作用：

1. 简化复杂接口
2. 解耦和，屏蔽使用者对子系统的直接访问

UML图：

![img](../images/javascript/201826186728078.png)


在形式上，外观模式在javascript中就像这样：

```javascript
function a(x){
   // do something
}
function b(y){
   // do something
}
function ab( x, y ){
    a(x);
    b(y);
} 
```

下面的一个例子，把阻止冒泡和阻止默认事件放到了外观角色中：

```javascript
var N = window.N || {};

N.tools = {
    stopPropagation : function( e ){
        if( e.stopPropagation ){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    },
    preventDefault : function( e ){
        if( e.preventDefault ){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    },
    stopEvent : function( e ){
        N.tools.stopPropagation( e );
        N.tools.preventDefault( e );
    }
} 
```

其中的stopEvent就是提供给使用者的阻止冒泡，阻止默认事件的一个方法。
另外一个例子，比如经常会用js设置元素的颜色、尺寸：

```
var element = document.getElementById('content');
content.style.color = 'red';
content.style.height= '200px'; 
```

可以对这个操作进行包装：

```javascript
function setStyles( id, styles ){
    var element = document.getElementById( id );
    for( var key in styles ){
        if( styles.hasOwnProperty( key ) ){
            element.style[ key ] = styles[ key ];
        }
    }
}

setStyles( 'content', {
    color : 'red'，
    height : '200px'
} ); 
```
如果有一批元素，需要设置同样的属性，可以进行再次包装：

```javascript
function setCSS( ids, styles ){
    for( var i = 0,len = ids.length; i<len; i++ ){
         setStyles( ids[i], styles );
    }
} 
```

​    外观模式在javascript的应用主要可以分为两类，某块代码反复出现，比如函数a的调用基本都出现在函数b的调用之前，那么可以考虑考虑将这块代码使用外观角色包装一下来优化结构。还有一种就是对于一些浏览器不兼容的API，放置在外观内部进行判断，处理这些问题最好的方式便是将跨浏览器差异全部集中放置到一个外观模式实例中来提供一个对外接口。