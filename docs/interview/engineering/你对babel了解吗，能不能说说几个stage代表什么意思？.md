# 你对 babel 了解吗，能不能说说几个 stage 代表什么意思？

## 参考答案

stage-x: 指处于某一阶段的js语法提。

stage-0、stage-1、stage-2、stage-3、stage-4分别对应的就是进入标准之前的5个阶段，不同stage-x之间存在依赖关系，数字越小，阶段越靠后，靠后阶段包含前面阶段所有的功能，简单理解就是stage-0包含stage-1/2/3的内容，所以如果你不知道需要哪个stage-x的话，直接引入stage-0就好了。  

+ Stage-0 - 设想（Strawman）: 只是一个想法，可能有Babel插件。
+ Stage-1 - 建议（Proposal）: 这是值得跟进的。
+ Stage-2 - 草案(Draft): 初始规范。
+ Stage-3- 候选 (Candidate): 完成规范并在浏览器上初步实现。
+ Stage-4 - 完成(Finished): 将添加到下一个年度版本发布中。

