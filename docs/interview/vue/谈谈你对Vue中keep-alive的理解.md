# 谈谈你对Vue中keep-alive的理解

## 什么是keep-alive

在平常开发中，有部分组件没有必要多次初始化，这时，我们需要将组件进行持久化，使组件的状态维持不变，在下一次展示时，也不会进行重新初始化组件。  
也就是说，keepalive是Vue内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染，也就是所谓的组件缓存。  
\<keep-alive\>是Vue的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

> \<keep-alive\>包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和\<transition\>相似，\<keep-alive\>是一个抽象组件：它自身不会渲染一个DOM元素，也不会出现在父组件链中。

##  include和exclude指定是否缓存某些组件
+ include属性
include包含的意思。值为字符串或正则表达式或数组。只有组件的名称与include的值相同的才会被缓存，即指定哪些被缓存，可以指定多个被缓存。这里以字符串为例，指定多个组件缓存，语法是用逗号隔开。如下：

```javascript
// 指定home组件和about组件被缓存
<keep-alive include="home,about" >
    <router-view></router-view>
</keep-alive>
```
+ exclude属性
exclude相当于include的反义词，就是除了的意思，指定哪些组件不被缓存，用法和include类似，如下：

```javascript
// 除了home组件和about组件别的都缓存，本例中就是只缓存detail组件
<keep-alive exclude="home,about" >
    <router-view></router-view>
</keep-alive>
```

## 使用keep-alive的钩子函数执行顺序问题
首先使用了keep-alive的组件以后，组件上就会自动加上了activated钩子和deactivated钩子。  
+ activated当组件被激活（使用）的时候触发，可以简单理解为进入这个页面的时候触发。
+ deactivated当组件不被使用（inactive状态）的时候触发，可以简单理解为离开这个页面的时候触发。

假设我们只缓存home组件，我们先看一下代码，再在钩子中打印出对应的顺序。就知道钩子执行的顺序了，自已动手印象深刻。

```javascript
<template>
<div>
  <el-checkbox v-model="checked">备选项</el-checkbox>
</div>
</template>
<script>
export default {
name: "home",
data() { return { checked: false } },
created() {
  console.log("我是created钩子");
},
mounted() {
  console.log("我是mounted钩子");
},
activated() {
  console.log("我是activated钩子");
},
deactivated() {
  console.log("我是deactivated钩子");
},
beforeDestroy() {
  console.log("我是beforeDestroy钩子");所以我们可以得出结论：
},
};
</script>
```
进入组件打印结果如下：

```javascript
我是created钩子
我是mounted钩子
我是activated钩子
```

离开组件打印结果如下：

```javascript
我是deactivated钩子
```

得出结论：

```javascript
初始进入和离开 created ---> mounted ---> activated --> deactivated
后续进入和离开 activated --> deactivated
```

## keep-alive的应用场景举例
+ 查看表格某条数据详情页，返回还是之前的状态，比如还是之前的筛选结果，还是之前的页数等。
+ 填写的表单的内容路由跳转返回还在，比如input框、下拉选择框、开关切换等用户输入了一大把东西，跳转再回来不能清空啊，不用让用户再写一遍。