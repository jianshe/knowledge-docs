import{_ as s,c as n,o as a,a as l}from"./app.16764a97.js";const F=JSON.parse('{"title":"如何实现一个元素的水平垂直居中","description":"","frontmatter":{},"headers":[{"level":2,"title":"主要有几下几种方案","slug":"主要有几下几种方案","link":"#主要有几下几种方案","children":[]}],"relativePath":"interview/css3/如何实现一个元素的水平垂直居中.md"}'),p={name:"interview/css3/如何实现一个元素的水平垂直居中.md"},e=l(`<h1 id="如何实现一个元素的水平垂直居中" tabindex="-1">如何实现一个元素的水平垂直居中 <a class="header-anchor" href="#如何实现一个元素的水平垂直居中" aria-hidden="true">#</a></h1><blockquote><p>回答者：<a href="https://github.com/jianshe" target="_blank" rel="noreferrer">jianshe</a></p></blockquote><h2 id="主要有几下几种方案" tabindex="-1">主要有几下几种方案 <a class="header-anchor" href="#主要有几下几种方案" aria-hidden="true">#</a></h2><p>1.使用flex布局</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">.container {</span></span>
<span class="line"><span style="color:#babed8;">  display:flex;</span></span>
<span class="line"><span style="color:#babed8;">  display:-webkit-flex;</span></span>
<span class="line"><span style="color:#babed8;">  justify-content: center;</span></span>
<span class="line"><span style="color:#babed8;">  -webkit-justify-content: center;</span></span>
<span class="line"><span style="color:#babed8;">  -webkit-align-items: center;</span></span>
<span class="line"><span style="color:#babed8;">  align-items: center;</span></span>
<span class="line"><span style="color:#babed8;">  width:300px;</span></span>
<span class="line"><span style="color:#babed8;">  height:200px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#eee;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">.item {</span></span>
<span class="line"><span style="color:#babed8;">  width:50px;</span></span>
<span class="line"><span style="color:#babed8;">  height:50px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#ff7400;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/dyMdzze" target="_blank" rel="noreferrer">codepen</a></p></blockquote><p>2.脱离文档流元素的居中</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">.container {</span></span>
<span class="line"><span style="color:#babed8;">  width:300px;</span></span>
<span class="line"><span style="color:#babed8;">  height:200px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#eee;</span></span>
<span class="line"><span style="color:#babed8;">  position:relative;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">.item {</span></span>
<span class="line"><span style="color:#babed8;">  width:50px;</span></span>
<span class="line"><span style="color:#babed8;">  height:50px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#ff7400;</span></span>
<span class="line"><span style="color:#babed8;">  position:absolute;</span></span>
<span class="line"><span style="color:#babed8;">  margin:auto;</span></span>
<span class="line"><span style="color:#babed8;">  top:0;</span></span>
<span class="line"><span style="color:#babed8;">  bottom:0;</span></span>
<span class="line"><span style="color:#babed8;">  left:0;</span></span>
<span class="line"><span style="color:#babed8;">  right:0;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/RwaQZEd" target="_blank" rel="noreferrer">codepen</a></p></blockquote><p>3.负margin法</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">  .container {</span></span>
<span class="line"><span style="color:#babed8;">    width:300px;</span></span>
<span class="line"><span style="color:#babed8;">    height:200px;</span></span>
<span class="line"><span style="color:#babed8;">    background-color:#eee;</span></span>
<span class="line"><span style="color:#babed8;">    position:relative;</span></span>
<span class="line"><span style="color:#babed8;">  }</span></span>
<span class="line"><span style="color:#babed8;">  .item {</span></span>
<span class="line"><span style="color:#babed8;">    width:50px;</span></span>
<span class="line"><span style="color:#babed8;">    height:50px;</span></span>
<span class="line"><span style="color:#babed8;">    background-color:#ff7400;</span></span>
<span class="line"><span style="color:#babed8;">    position:absolute;</span></span>
<span class="line"><span style="color:#babed8;">    top:50%;</span></span>
<span class="line"><span style="color:#babed8;">    left:50%;</span></span>
<span class="line"><span style="color:#babed8;">    margin-top:-25px; /*height的一半*/</span></span>
<span class="line"><span style="color:#babed8;">    margin-left:-25px; /*width的一半*/</span></span>
<span class="line"><span style="color:#babed8;">  }</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/RwaQLrX" target="_blank" rel="noreferrer">codepen</a></p></blockquote><p>4.利用textAlign:center实现行内元素的水平居中，再利用verticalAlign:middle实现行内元素的垂直居中，前提是要先加上伪元素并给设置高度为100%，用过elementUI的可以去看看其消息弹窗居中实现方式就是如此。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">.container {</span></span>
<span class="line"><span style="color:#babed8;">  width:300px;</span></span>
<span class="line"><span style="color:#babed8;">  height:200px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#eee;</span></span>
<span class="line"><span style="color:#babed8;">  text-align:center;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">.container:after{</span></span>
<span class="line"><span style="color:#babed8;">  content:&quot;&quot;;</span></span>
<span class="line"><span style="color:#babed8;">  display:inline-block;</span></span>
<span class="line"><span style="color:#babed8;">  height:100%;</span></span>
<span class="line"><span style="color:#babed8;">  width:0;</span></span>
<span class="line"><span style="color:#babed8;">  vertical-align:middle;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">.item {</span></span>
<span class="line"><span style="color:#babed8;">  width:50px;</span></span>
<span class="line"><span style="color:#babed8;">  height:50px;</span></span>
<span class="line"><span style="color:#babed8;">  background-color:#ff7400;</span></span>
<span class="line"><span style="color:#babed8;">  display:inline-block;</span></span>
<span class="line"><span style="color:#babed8;">  vertical-align:middle;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/bGpLoBw" target="_blank" rel="noreferrer">codepen</a></p></blockquote><p>5.相对定位下，使用绝对定位，利用margin偏移外容器的50%，再利用translate平移回补自身宽高的50%即可</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">  .container {</span></span>
<span class="line"><span style="color:#babed8;">    width:300px;</span></span>
<span class="line"><span style="color:#babed8;">    height:200px;</span></span>
<span class="line"><span style="color:#babed8;">    background-color:#eee;</span></span>
<span class="line"><span style="color:#babed8;">    position:relative;</span></span>
<span class="line"><span style="color:#babed8;">  }</span></span>
<span class="line"><span style="color:#babed8;">  .item {</span></span>
<span class="line"><span style="color:#babed8;">    width:50px;</span></span>
<span class="line"><span style="color:#babed8;">    height:50px;</span></span>
<span class="line"><span style="color:#babed8;">    background-color:#ff7400;</span></span>
<span class="line"><span style="color:#babed8;">    position:absolute;</span></span>
<span class="line"><span style="color:#babed8;">    top:50%;</span></span>
<span class="line"><span style="color:#babed8;">    left:50%;</span></span>
<span class="line"><span style="color:#babed8;">    transform:translate(-50%,-50%);</span></span>
<span class="line"><span style="color:#babed8;">  }</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/KKzQXmv" target="_blank" rel="noreferrer">codepen</a></p></blockquote><p>6.使用<code>grid</code>,它是做二维布局的，但是只有一个子元素时，一维布局与二维布局就一样了。结合<code>justify-content</code>/<code>justify-items</code>和 <code>align-content/align-items</code> 就有四种方案</p><div class="language-css"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">container</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">display</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">grid</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">justify-content</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">align-content</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">300px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">200px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">eee</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">item</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">ff7400</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><div class="language-css"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">container</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">display</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">grid</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">justify-content</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">align-items</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">300px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">200px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">eee</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">item</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">ff7400</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><div class="language-css"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">container</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">display</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">grid</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">justify-items</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">align-content</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">300px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">200px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">eee</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">item</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">ff7400</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><div class="language-css"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">container</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">display</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">grid</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">justify-items</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">align-items</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;">center</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">300px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">200px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">eee</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">item</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">width</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">height</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">50px</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#B2CCD6;">background-color</span><span style="color:#89DDFF;">:#</span><span style="color:#BABED8;">ff7400</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><blockquote><p>效果可以见<a href="https://codepen.io/jianshe/pen/BaKYwJL" target="_blank" rel="noreferrer">codepen</a></p></blockquote>`,24),o=[e];function c(t,r,i,y,D,b){return a(),n("div",null,o)}const B=s(p,[["render",c]]);export{F as __pageData,B as default};
