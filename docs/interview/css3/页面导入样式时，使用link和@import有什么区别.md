# 页面导入样式时，使用 link 和@import 有什么区别？

## 区别

- link 属于 HTML 标签，而@import 是 css 提供的；
- 页面被加载时，link 会同时被加载，而@import 引用的 css 会等到页面被加载完再加载；
- @import 只在 IE5 以上才能识别，而 link 是 XHTML 标签，无兼容问题；
- link 方式的样式的权重高于@import 的权重。
