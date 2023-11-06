# vue中$route和$router有什么区别？ 

## 参考答案
在Vue.js中，$route和$router都是与路由相关的对象，但它们之间有如下区别
1. $route: $route是一个当前路由信息的对象，包括当前URL路径、查询参数、路径参数等信息。$route对象是只读的，不可以直接修改其属性值，而需要通过路由跳转来更新。
2. $router：$router是Vue Router的实例对象，包括了许多用于民航控制和路由操作的API，例如push、replace、go、forward等方法。$router可以用来动态地改变URL，从而实现页面间的无刷新跳转。

因此，$route和$router在功能上有所不同，$route主要用于获取当前路由信息，$router则是用于进行路由操作，例如跳转到指定的路由、前进、后退等。通常来说，$route和$router是紧密关联的，并且常常一起使用。

