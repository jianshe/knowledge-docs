import{_ as s,c as n,o as a,a as l}from"./app.16764a97.js";const p="/assets/6e67451df51a4b0992d438db2c90f0a4_tplv-k3u1fbpfcp-zoom-1.ee4e0c98.gif",o="/assets/2a30788372ae4e419f49c4cee50abd10_tplv-k3u1fbpfcp-zoom-1.1851b44a.gif",e="/assets/1620f5a335c48db6.285e3915.png",f=JSON.parse('{"title":"防抖和节流原理分析—节流","description":"","frontmatter":{},"headers":[{"level":2,"title":"第四版—优化","slug":"第四版—优化","link":"#第四版—优化","children":[]},{"level":2,"title":"终版——取消","slug":"终版——取消","link":"#终版——取消","children":[]},{"level":2,"title":"注意","slug":"注意","link":"#注意","children":[]},{"level":2,"title":"Underscore的实现","slug":"underscore的实现","link":"#underscore的实现","children":[]},{"level":2,"title":"默认情况（options === undefined）","slug":"默认情况-options-undefined","link":"#默认情况-options-undefined","children":[]},{"level":2,"title":"options.leading === false","slug":"options-leading-false","link":"#options-leading-false","children":[]},{"level":2,"title":"options.trailing === false","slug":"options-trailing-false","link":"#options-trailing-false","children":[]}],"relativePath":"interview/javascript/防抖和节流原理分析—节流.md"}'),t={name:"interview/javascript/防抖和节流原理分析—节流.md"},c=l(`<h1 id="防抖和节流原理分析—节流" tabindex="-1">防抖和节流原理分析—节流 <a class="header-anchor" href="#防抖和节流原理分析—节流" aria-hidden="true">#</a></h1><blockquote><p>如果你持续触发事件，每隔一段时间，只执行一次事件。</p></blockquote><p>根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。我们用leading代表首次是否执行，trailing代表结束后是否再执行一次。</p><p>关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。</p><p><strong>实现</strong></p><p><strong>第一版—使用时间戳</strong></p><p>让我们来看第一种方法：使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳（最一开始值设为0），如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。</p><p>看了这个表述，是不是感觉已经可以写出代码了。。。让我们来写第一版的代码：</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 第一版</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">throttle</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">func</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">wait</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;">args</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">now</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Date</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">context</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">args</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">arguments</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">now</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">wait</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#BABED8;">func</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;">args</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">now</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>例子依然是用讲debounce中的例子，如果你要使用：</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#BABED8;">container</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">onmousemove </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">throttle</span><span style="color:#BABED8;">(getUserAction</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">1000</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>效果演示如下：</p><p><img src="`+p+`" alt="6e67451df51a4b0992d438db2c90f0a4_tplv-k3u1fbpfcp-zoom-1"></p><p>我们可以看到：当鼠标移入的时候，事件立刻执行，每过1s会执行一次，如果在4.2s停止触发，以后不会再执行事件。</p><p>第二版—使用定时器</p><p>接下来，我们讲讲第二种实现方式，使用定时器。</p><p>当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 第二版 </span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">throttle</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">func</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">wait</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">timeout</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">context</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">args</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">arguments</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">!</span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">setTimeout</span><span style="color:#F07178;">(</span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null;</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#BABED8;">func</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">args</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">},</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">wait</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>为了让效果更加明显，我们设置wait的时间为3s，效果演示如下：</p><p>我们可以看到：当鼠标移入的时候，事件不会立刻执行，晃了3s后终于执行了一次，此后每3s执行一次，当数字显示为3的时候，立刻移出鼠标，相当于大约9.2秒的时候停止触发，但是依然会在第12s的时候执行一次事件。</p><p>所以比较两个方法：</p><ul><li>第一种事件会立刻执行，第二种事件会在n秒后第一次执行</li><li>第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件</li></ul><p><strong>第三版—双剑合璧</strong></p><p>那我们想要一个什么样的呢？</p><p>有人就说了：我想要一个有头有尾的！就是鼠标移入能立刻执行，停止触发的时候还能再执行一次！</p><p>所以我们综合两者的优势，然后双剑合璧，写一版代码：</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 第三版</span></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">throttle</span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">func</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">wait</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">timeout</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;">args</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">result</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">later</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Date</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#BABED8;">func</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">args</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#F07178;">   </span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">throttled</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">now</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Date</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">       </span><span style="color:#676E95;font-style:italic;">// 下次触发func剩余的时间</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">remaining</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">wait</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">now</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#BABED8;">context</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">this;</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#BABED8;">args</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">arguments</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">       </span><span style="color:#676E95;font-style:italic;">// 如果剩余的时间了或者你改了系统时间</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">remaining</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">||</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">remaining</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">wait</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">               </span><span style="color:#82AAFF;">clearTimeout</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">               </span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null;</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#BABED8;">previous</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">now</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#BABED8;">func</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">context</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;">args</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">!</span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#BABED8;">timeout</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">setTimeout</span><span style="color:#F07178;">(</span><span style="color:#BABED8;">later</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">remaining</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">throttled</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>效果演示如下：</p><p><img src="`+o+`" alt="2a30788372ae4e419f49c4cee50abd10_tplv-k3u1fbpfcp-zoom-1"></p><p>我们可以看到：鼠标移入，事件立刻执行，晃了3s，事件再一次执行，当数字变成3的时候，也就是6s后，我们立刻移出鼠标，停止触发事件，9s的时候，依然会再执行一次事件。</p><h2 id="第四版—优化" tabindex="-1">第四版—优化 <a class="header-anchor" href="#第四版—优化" aria-hidden="true">#</a></h2><p>但是我有时也希望无头有尾，或者有头无尾，这个咋办？</p><p>那我们设置个 <code>options</code> 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:</p><p><code>leading：false </code>表示禁用第一次执行 <code>trailing: false</code> 表示禁用停止触发的回调</p><p>我们来改一下代码：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">// 第四版</span></span>
<span class="line"><span style="color:#babed8;">function throttle(func, wait, options) {</span></span>
<span class="line"><span style="color:#babed8;">    var timeout, context, args, result;</span></span>
<span class="line"><span style="color:#babed8;">    var previous = 0;</span></span>
<span class="line"><span style="color:#babed8;">    // 此处大佬的意思应该是给options一个默认值，我们可以用ES6语法写在函数声明上。</span></span>
<span class="line"><span style="color:#babed8;">    if (!options) options = {};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    var later = function() {</span></span>
<span class="line"><span style="color:#babed8;">        previous = options.leading === false ? 0 : new Date().getTime();</span></span>
<span class="line"><span style="color:#babed8;">        timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">        func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">        if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    var throttled = function() {</span></span>
<span class="line"><span style="color:#babed8;">        var now = new Date().getTime();</span></span>
<span class="line"><span style="color:#babed8;">        if (!previous &amp;&amp; options.leading === false) previous = now;</span></span>
<span class="line"><span style="color:#babed8;">        var remaining = wait - (now - previous);</span></span>
<span class="line"><span style="color:#babed8;">        context = this;</span></span>
<span class="line"><span style="color:#babed8;">        args = arguments;</span></span>
<span class="line"><span style="color:#babed8;">        if (remaining &lt;= 0 || remaining &gt; wait) {</span></span>
<span class="line"><span style="color:#babed8;">            if (timeout) {</span></span>
<span class="line"><span style="color:#babed8;">                clearTimeout(timeout);</span></span>
<span class="line"><span style="color:#babed8;">                timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">            }</span></span>
<span class="line"><span style="color:#babed8;">            previous = now;</span></span>
<span class="line"><span style="color:#babed8;">            func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">            // 不知为何此处要加 if (!timeout) context = args = null;希望看到此处的大佬指教一下。</span></span>
<span class="line"><span style="color:#babed8;">            if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">        } else if (!timeout &amp;&amp; options.trailing !== false) {</span></span>
<span class="line"><span style="color:#babed8;">            timeout = setTimeout(later, remaining);</span></span>
<span class="line"><span style="color:#babed8;">        }</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;">    return throttled;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">复制代码</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><h2 id="终版——取消" tabindex="-1">终版——取消 <a class="header-anchor" href="#终版——取消" aria-hidden="true">#</a></h2><p>在 <code>debounce</code> 的实现中，我们加了一个 <code>cancel</code> 方法，<code>throttle</code> 我们也加个 <code>cancel</code> 方法：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">function throttle(func, wait, options) {</span></span>
<span class="line"><span style="color:#babed8;">    var timeout, context, args, result;</span></span>
<span class="line"><span style="color:#babed8;">    var previous = 0;</span></span>
<span class="line"><span style="color:#babed8;">    if (!options) options = {};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    var later = function() {</span></span>
<span class="line"><span style="color:#babed8;">        previous = options.leading === false ? 0 : new Date().getTime();</span></span>
<span class="line"><span style="color:#babed8;">        timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">        func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">        if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    var throttled = function() {</span></span>
<span class="line"><span style="color:#babed8;">        var now = new Date().getTime();</span></span>
<span class="line"><span style="color:#babed8;">        if (!previous &amp;&amp; options.leading === false) previous = now;</span></span>
<span class="line"><span style="color:#babed8;">        var remaining = wait - (now - previous);</span></span>
<span class="line"><span style="color:#babed8;">        context = this;</span></span>
<span class="line"><span style="color:#babed8;">        args = arguments;</span></span>
<span class="line"><span style="color:#babed8;">        if (remaining &lt;= 0 || remaining &gt; wait) {</span></span>
<span class="line"><span style="color:#babed8;">            if (timeout) {</span></span>
<span class="line"><span style="color:#babed8;">                clearTimeout(timeout);</span></span>
<span class="line"><span style="color:#babed8;">                timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">            }</span></span>
<span class="line"><span style="color:#babed8;">            previous = now;</span></span>
<span class="line"><span style="color:#babed8;">            func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">            if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">        } else if (!timeout &amp;&amp; options.trailing !== false) {</span></span>
<span class="line"><span style="color:#babed8;">            timeout = setTimeout(later, remaining);</span></span>
<span class="line"><span style="color:#babed8;">        }</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    throttled.cancel = function() {</span></span>
<span class="line"><span style="color:#babed8;">        clearTimeout(timeout);</span></span>
<span class="line"><span style="color:#babed8;">        previous = 0;</span></span>
<span class="line"><span style="color:#babed8;">        timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">    return throttled;</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">复制代码</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><h2 id="注意" tabindex="-1">注意 <a class="header-anchor" href="#注意" aria-hidden="true">#</a></h2><p>我们要注意 <code>underscore</code> 的实现中有这样一个问题：</p><p>那就是<code> leading：false</code> 和 <code>trailing: false</code> 不能同时设置。</p><p>如果同时设置的话，比如当你将鼠标移出的时候，因为 <code>trailing</code> 设置为 <code>false</code>，停止触发的时候不会设置定时器，所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 <code>leading: false</code>，<code>bug</code> 就出来了，所以，这个 <code>throttle</code> 只有三种用法：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">container.onmousemove = throttle(getUserAction, 1000);</span></span>
<span class="line"><span style="color:#babed8;">container.onmousemove = throttle(getUserAction, 1000, {</span></span>
<span class="line"><span style="color:#babed8;">    leading: false</span></span>
<span class="line"><span style="color:#babed8;">});</span></span>
<span class="line"><span style="color:#babed8;">container.onmousemove = throttle(getUserAction, 1000, {</span></span>
<span class="line"><span style="color:#babed8;">    trailing: false</span></span>
<span class="line"><span style="color:#babed8;">});</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><p>理解函数节流</p><p>通过这张我手画的图，我相信可以更容易理解函数节流这个概念。</p><p><img src="`+e+`" alt="img"></p><p>在这张粗制滥造的手绘图中，从左往右的轴线表示时间轴，下方的粗蓝色线条表示不断的调用throttled函数（看做连续发生的），而上方的一个一个节点表示我们得到的执行func函数的结果。</p><p>从图上可以看出来，我们通过函数节流，成功的限制了func函数在一段时间内的调用频率，在实际中能够提高我们应用的性能表现。</p><p>接下来我们探究一下Underscore中_.throttle函数的实现。</p><h2 id="underscore的实现" tabindex="-1">Underscore的实现 <a class="header-anchor" href="#underscore的实现" aria-hidden="true">#</a></h2><p>我们在探究源码之前，先了解一下Underscore API手册中关于_.throttle函数的使用说明：</p><p>throttle_.throttle(function, wait, [options])</p><p>创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助。（注：详见：javascript函数的throttle和debounce）</p><p>默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。如果你想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#C792EA;">var</span><span style="color:#BABED8;"> throttled </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> _</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">throttle</span><span style="color:#BABED8;">(updatePosition</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">100</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">$</span><span style="color:#BABED8;">(window)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">scroll</span><span style="color:#BABED8;">(throttled)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>结合我画的那张示意图，应该比较好理解了。</p><p>如果传递的options参数中，leading为false，那么不会在throttled函数被执行时立即执行func函数；trailing为false，则不会在结束时调用最后一次func。</p><p><strong>Underscore源码（附注释）</strong>：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#babed8;">// Returns a function, that, when invoked, will only be triggered at most once</span></span>
<span class="line"><span style="color:#babed8;">// during a given window of time. Normally, the throttled function will run</span></span>
<span class="line"><span style="color:#babed8;">// as much as it can, without ever going more than once per \`wait\` duration;</span></span>
<span class="line"><span style="color:#babed8;">// but if you&#39;d like to disable the execution on the leading edge, pass</span></span>
<span class="line"><span style="color:#babed8;">// \`{leading: false}\`. To disable execution on the trailing edge, ditto.</span></span>
<span class="line"><span style="color:#babed8;">_.throttle = function (func, wait, options) {</span></span>
<span class="line"><span style="color:#babed8;">	var timeout, context, args, result;</span></span>
<span class="line"><span style="color:#babed8;">	var previous = 0;</span></span>
<span class="line"><span style="color:#babed8;">	if (!options) options = {};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">	var later = function () {</span></span>
<span class="line"><span style="color:#babed8;">		//previous===0时，下一次会立即触发。</span></span>
<span class="line"><span style="color:#babed8;">		//previous===_.now()时，下一次不会立即触发。</span></span>
<span class="line"><span style="color:#babed8;">		previous = options.leading === false ? 0 : _.now();</span></span>
<span class="line"><span style="color:#babed8;">		timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">		result = func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">		if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">	};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">	var throttled = function () {</span></span>
<span class="line"><span style="color:#babed8;">		//获取当前时间戳（13位milliseconds表示）。</span></span>
<span class="line"><span style="color:#babed8;">		//每一次调用throttled函数，都会重新获取now，计算时间差。</span></span>
<span class="line"><span style="color:#babed8;">		//而previous只有在func函数被执行过后才回重新赋值。</span></span>
<span class="line"><span style="color:#babed8;">		//也就是说，每次计算的remaining时间间隔都是每次调用throttled函数与上一次执行func之间的时间差。</span></span>
<span class="line"><span style="color:#babed8;">		var now = _.now();</span></span>
<span class="line"><span style="color:#babed8;">		//!previous确保了在第一次调用时才会满足条件。</span></span>
<span class="line"><span style="color:#babed8;">		//leading为false表示不立即执行。</span></span>
<span class="line"><span style="color:#babed8;">		//注意是全等号，只有在传递了options参数时，比较才有意义。</span></span>
<span class="line"><span style="color:#babed8;">		if (!previous &amp;&amp; options.leading === false) previous = now;</span></span>
<span class="line"><span style="color:#babed8;">		//计算剩余时间，now-previous为已消耗时间。</span></span>
<span class="line"><span style="color:#babed8;">		var remaining = wait - (now - previous);</span></span>
<span class="line"><span style="color:#babed8;">		context = this;</span></span>
<span class="line"><span style="color:#babed8;">		args = arguments;</span></span>
<span class="line"><span style="color:#babed8;">		//remaining &lt;= 0代表当前时间超过了wait时长。</span></span>
<span class="line"><span style="color:#babed8;">		//remaining &gt; wait代表now &lt; previous，这种情况是不存在的，因为now &gt;= previous是永远成立的(除非主机时间已经被修改过)。</span></span>
<span class="line"><span style="color:#babed8;">		//此处就相当于只判断了remaining &lt;= 0是否成立。</span></span>
<span class="line"><span style="color:#babed8;">		if (remaining &lt;= 0 || remaining &gt; wait) {</span></span>
<span class="line"><span style="color:#babed8;">			//防止出现remaining &lt;= 0但是设置的timeout仍然未触发的情况。</span></span>
<span class="line"><span style="color:#babed8;">			if (timeout) {</span></span>
<span class="line"><span style="color:#babed8;">				clearTimeout(timeout);</span></span>
<span class="line"><span style="color:#babed8;">				timeout = null;</span></span>
<span class="line"><span style="color:#babed8;">			}</span></span>
<span class="line"><span style="color:#babed8;">			//将要执行func函数，重新设置previous的值，开始下一轮计时。</span></span>
<span class="line"><span style="color:#babed8;">			previous = now;</span></span>
<span class="line"><span style="color:#babed8;">			//时间达到间隔为wait的要求，立即传入参数执行func函数。</span></span>
<span class="line"><span style="color:#babed8;">			result = func.apply(context, args);</span></span>
<span class="line"><span style="color:#babed8;">			if (!timeout) context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">			//remaining&gt;0&amp;&amp;remaining&lt;=wait、不忽略最后一个输出、</span></span>
<span class="line"><span style="color:#babed8;">			//timeout未被设置时，延时调用later并设置timeout。</span></span>
<span class="line"><span style="color:#babed8;">			//如果设置trailing===false，那么直接跳过延时调用later的部分。</span></span>
<span class="line"><span style="color:#babed8;">		} else if (!timeout &amp;&amp; options.trailing !== false) {</span></span>
<span class="line"><span style="color:#babed8;">			timeout = setTimeout(later, remaining);</span></span>
<span class="line"><span style="color:#babed8;">		}</span></span>
<span class="line"><span style="color:#babed8;">		return result;</span></span>
<span class="line"><span style="color:#babed8;">	};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">	throttled.cancel = function () {</span></span>
<span class="line"><span style="color:#babed8;">		clearTimeout(timeout);</span></span>
<span class="line"><span style="color:#babed8;">		previous = 0;</span></span>
<span class="line"><span style="color:#babed8;">		timeout = context = args = null;</span></span>
<span class="line"><span style="color:#babed8;">	};</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">	return throttled;</span></span>
<span class="line"><span style="color:#babed8;">};</span></span>
<span class="line"><span style="color:#babed8;">复制代码</span></span>
<span class="line"><span style="color:#babed8;"></span></span></code></pre></div><p>接下来，我们分三种情况分析Underscore源码：</p><ul><li>没有配置options选项时</li><li>options.leading === false时</li><li>options.trailing === false时</li></ul><h2 id="默认情况-options-undefined" tabindex="-1">默认情况（options === undefined） <a class="header-anchor" href="#默认情况-options-undefined" aria-hidden="true">#</a></h2><p>在默认情况下调用throttled函数时，options是一个空的对象<code>{}</code>，此时<code>options.leading!==false</code>并且<code>options.trailing!==false</code>，那么throttled函数中的第一个if会被忽略掉，因为options.leading === false永远不会满足。</p><p>此时，不断地调用throttled函数，会按照以下方式执行：</p><ul><li>用now变量保存当前调用时的时间戳，previous默认为0，计算remaining剩余时间，此时应该会小于0，满足了<code>if (remaining &lt;= 0 || remaining &gt; wait)</code>。</li><li>清空timeout并清除其事件，为previous重新赋值以记录当前调用throttled函数的值。</li><li>能够进入当前的if语句表示剩余时间不足或者是第一次调用throttled函数（且options.leading !== false），那么将会立即执行func函数，使用result记录执行后的返回值。</li><li>下一次调用throttled函数时，重新计算当前时间和剩余时间，如果剩余时间不足那么仍然立即执行func，如此不断地循环。如果remaining时间足够（大于0），那么会进入else if语句，设置一个timeout异步事件，此时注意到timeout会被赋值，直到later被调用才回被赋值为null。这样做的目的就是为了防止不断进入else if条件语句重复设置timeout异步事件，影响性能，消耗资源。</li><li>之后调用throttled函数，都会按照这样的方式执行。</li></ul><p>通过上面的分析，我们可以发现，除非设置options.leading===false，否则第一次执行throttled函数时，条件语句<code>if (!previous &amp;&amp; options.leading === false) previous = now;</code>不会被执行。间接导致remaining&lt;0，然后进入if语句立即执行func函数。</p><p>接下来我们看看设置options.leading === false时的情况。</p><h2 id="options-leading-false" tabindex="-1">options.leading === false <a class="header-anchor" href="#options-leading-false" aria-hidden="true">#</a></h2><p>设置options.leading为false时，执行情况与之前并没有太大差异，仅在于<code>if(!previous &amp;&amp; options.leading === false)</code>语句。当options.leading为false时，第一次执行会满足这个条件，所以赋值previous=== now，间接使得remaining&gt;0。</p><p>由于timeout此时为undefined，所以!timeout为true。设置later为异步任务，在remaining时间之后执行。</p><p>此后再不断的调用throttled方法，思路同2.1无异，因为!previous为false，所以<code>if(!previous &amp;&amp; options.leading === false)</code>该语句不再判断，会被完全忽略。可以理解为设置判断!previous的目的就是在第一次调用throttled函数时，判断options.leading是否为false，之后便不再进行判断。</p><h2 id="options-trailing-false" tabindex="-1">options.trailing === false <a class="header-anchor" href="#options-trailing-false" aria-hidden="true">#</a></h2><p>此时的区别在于else if中的执行语句。如果<code>options.trailing === false</code>成立，那么当remaining&gt;0时间足够时，不会设置timeout异步任务。那么如何实现时间到就立即执行func呢？是通过不断的判断remaining，一旦<code>remaining &lt;= 0</code>成立，那么就立即执行func。</p>`,74),r=[c];function i(y,F,d,D,b,u){return a(),n("div",null,r)}const B=s(t,[["render",i]]);export{f as __pageData,B as default};
