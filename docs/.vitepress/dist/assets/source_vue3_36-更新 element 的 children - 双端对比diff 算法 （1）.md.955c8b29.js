import{_ as s,c as n,o as a,a as l}from"./app.16764a97.js";const q=JSON.parse('{"title":"36-更新 element 的 children - 双端对比diff 算法 （1）","description":"","frontmatter":{},"headers":[{"level":2,"title":"核心功能","slug":"核心功能","link":"#核心功能","children":[]},{"level":2,"title":"处理的场景","slug":"处理的场景","link":"#处理的场景","children":[]},{"level":2,"title":"中间对比","slug":"中间对比","link":"#中间对比","children":[]},{"level":2,"title":"测试案例","slug":"测试案例","link":"#测试案例","children":[]},{"level":2,"title":"核心代码","slug":"核心代码","link":"#核心代码","children":[]}],"relativePath":"source/vue3/36-更新 element 的 children - 双端对比diff 算法 （1）.md"}'),o={name:"source/vue3/36-更新 element 的 children - 双端对比diff 算法 （1）.md"},p=l(`<h1 id="_36-更新-element-的-children-双端对比diff-算法-1" tabindex="-1">36-更新 element 的 children - 双端对比diff 算法 （1） <a class="header-anchor" href="#_36-更新-element-的-children-双端对比diff-算法-1" aria-hidden="true">#</a></h1><h2 id="核心功能" tabindex="-1">核心功能 <a class="header-anchor" href="#核心功能" aria-hidden="true">#</a></h2><ol><li>看完左侧看右侧，来锁定中间乱序的部分。</li><li>双端对比算法。</li><li>核心是筛选出来中间乱序的部分。</li></ol><h2 id="处理的场景" tabindex="-1">处理的场景 <a class="header-anchor" href="#处理的场景" aria-hidden="true">#</a></h2><ol><li>先处理左侧。</li><li>再处理右侧。</li><li>新的比老的长，需要创建。（左侧对比）</li><li>新的比老的长，需要创建。（右侧对比）</li><li>老的比新的长，需要删除。（左侧对比）</li><li>老的比新的长，需要删除。（右侧对比）</li><li>中间对比</li></ol><h2 id="中间对比" tabindex="-1">中间对比 <a class="header-anchor" href="#中间对比" aria-hidden="true">#</a></h2><ol><li>创建新的（d）(在老的里面不存在，新的里面存在)。</li><li>删除老的 (y) (在老的里面存在，新的里面不存在)。</li><li>移动（c,e） (节点存在于新的和老的里面，但是位置变了)。</li></ol><h2 id="测试案例" tabindex="-1">测试案例 <a class="header-anchor" href="#测试案例" aria-hidden="true">#</a></h2><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// ArrayToArray.js</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 老的是 array</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 新的是 array</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">ref</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">h</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">../../lib/mini-vue.esm.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 1. 左侧的对比</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b) c</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b) d e</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 2. 右侧的对比</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a (b c)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// d e (b c)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 3. 新的比老的长</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     创建新的</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 左侧</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b) c</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// i = 2, e1 = 1, e2 = 2</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;), h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;)];</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 右侧</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// c (a b)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// i = 0, e1 = -1, e2 = 0</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;), h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;)];</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 4. 老的比新的长</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     删除老的</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 左侧</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b) c</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (a b)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// i = 2, e1 = 2, e2 = 1</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> prevChildren </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> [</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#82AAFF;">h</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">p</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">A</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">A</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#82AAFF;">h</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">p</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">B</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">B</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#82AAFF;">h</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">p</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">C</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">C</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> nextChildren </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> [</span><span style="color:#82AAFF;">h</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">p</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">A</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">A</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">h</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">p</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">B</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">B</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 右侧</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a (b c)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// (b c)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// i = 0, e1 = 0, e2 = -1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;), h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;)];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 5. 对比中间的部分</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 删除老的  (在老的里面存在，新的里面不存在)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 5.1</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(c,d),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(e,c),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// D 节点在新的里面是没有的 - 需要删除掉</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// C 节点 props 也发生了变化</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot;, id: &quot;c-prev&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot;, id:&quot;c-next&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 5.1.1</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(c,e,d),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(e,c),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 中间部分，老的比新的多， 那么多出来的直接就可以被干掉(优化删除逻辑)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot;, id: &quot;c-prev&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot;, id:&quot;c-next&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 2 移动 (节点存在于新的和老的里面，但是位置变了)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 2.1</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(c,d,e),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(e,c,d),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 最长子序列： [1,2]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 3. 创建新的节点</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(c,e),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(e,c,d),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// d 节点在老的节点中不存在，新的里面存在，所以需要创建</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 综合例子</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(c,d,e,z),f,g</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// a,b,(d,c,y,e),f,g</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;Z&quot; }, &quot;Z&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;C&quot; }, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;Y&quot; }, &quot;Y&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;E&quot; }, &quot;E&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;F&quot; }, &quot;F&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;G&quot; }, &quot;G&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// fix c 节点应该是 move 而不是删除之后重新创建的</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const prevChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, {}, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// const nextChildren = [</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;A&quot; }, &quot;A&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;B&quot; }, &quot;B&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, {}, &quot;C&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   h(&quot;p&quot;, { key: &quot;D&quot; }, &quot;D&quot;),</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// ];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ArrayToArray</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">setup</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">isChange</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#F07178;">(</span><span style="color:#FF9CAC;">false</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">window</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">isChange</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">isChange</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#BABED8;">isChange</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">render</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">self</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">self</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">isChange</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">h</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">div</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{},</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">nextChildren</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">h</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">div</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{},</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">prevChildren</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><h2 id="核心代码" tabindex="-1">核心代码 <a class="header-anchor" href="#核心代码" aria-hidden="true">#</a></h2><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">  </span><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">patchKeyedChildren</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#BABED8;font-style:italic;">c1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#BABED8;font-style:italic;">c2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#BABED8;font-style:italic;">container</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#BABED8;font-style:italic;">parentComponent</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#BABED8;font-style:italic;">parentAnchor</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">l2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c2</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">length</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c1</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">length</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">l2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">isSomeVNodeType</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">n1</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;font-style:italic;">n2</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// type</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">//key</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n1</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">type</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">type</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n1</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">key</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">key</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 左侧对比</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c1</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">i</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c2</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">i</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#82AAFF;">isSomeVNodeType</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">n1</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#F07178;">)) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">patch</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">n1</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">container</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">parentComponent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">parentAnchor</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">break</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#BABED8;">i</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 右侧对比</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c1</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">e1</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c2</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#82AAFF;">isSomeVNodeType</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">n2</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#F07178;">)) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">patch</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">n1</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">n2</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">container</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">parentComponent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">parentAnchor</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">break</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#BABED8;">e1</span><span style="color:#89DDFF;">--;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#BABED8;">e2</span><span style="color:#89DDFF;">--;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 3. 新的比老的多，需要创建。</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e1</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">nextPos</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">anchor</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">nextPos</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">l2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">?</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c2</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">nextPos</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">el</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null;</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 如果不止多一个，需要依次patch</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#82AAFF;">patch</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">null,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">c2</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">i</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">container</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">parentComponent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">anchor</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#BABED8;">i</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 老的比新的多，需要删除。</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">while</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">e1</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">hostRemove</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">c1</span><span style="color:#F07178;">[</span><span style="color:#BABED8;">i</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">el</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">i</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#BABED8;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">i</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">i</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,11),t=[p];function e(c,y,r,i,F,u){return a(),n("div",null,t)}const E=s(o,[["render",e]]);export{q as __pageData,E as default};
