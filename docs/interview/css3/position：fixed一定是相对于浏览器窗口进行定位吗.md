# position: fixed 一定是相对于浏览器窗口进行定位吗？

## 分析

不一定。  
position: fixed;的元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置，元素的位置在屏幕滚动时不会改变。fixed 属性会创建新的层叠上下文。

当元素祖先的 transform，perspective 或 filter 属性非 none 时，容器由视口改为该祖先。
