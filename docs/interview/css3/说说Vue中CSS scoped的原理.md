# 说说 Vue 中 CSS scoped 的原理

## 前言

在日常的 Vue 项目开发过程中，为了让项目更好的维护一般都会使用模块化开发的方式进行。也就是每个组件维护独立的 template，script，style。今天主要介绍一下使用\<style scoped\>为什么在页面渲染完后样式之间并不会造成污染。

## 示例

搭建一个简单的 Vue 项目测试一下：

<ViewerZoom src="../images/css3/1715cc286d639f17~tplv-t2oaga2asx-image.png" />

给个目录结构吧，代码并不是我们讲解的重点，如果需要源码测试的话后续我放到 github 上去。
终端执行 npx webpack 输出 dist 目录，我们在浏览器打开 index.html 调试一下看看现象：

<ViewerZoom src="../images/css3/1715ccab4b543081~tplv-t2oaga2asx-image.png" />

1. 每个组件都会拥有一个[data-v-hash:8]插入 HTML 标签，子组件标签上也具体父组件[data-v-hash:8];
2. 如果 style 标签加了 scoped 属性，里面的选择器都会变成(Attribute Selector) [data-v-hash:8];
3. 如果子组件选择器跟父组件选择器完全一样，那么就会出现子组件样式被父组件覆盖，因为子组件会优先于父组件 mounted，有兴趣可以测试一下哦。

## webpack.config.js 配置

我们先看看在 webpack.config.js 中的配置：

<ViewerZoom src="../images/css3/171538289cdb0b59~tplv-t2oaga2asx-image.png" />

## vue-loader 工作流

以下就是 vue-loader 工作大致的处理流程：
<ViewerZoom src="../images/css3/1715e3645c082cc7~tplv-t2oaga2asx-image.png" />

开启 node 调试模式进行查看阅读，package.json 中配置如下：

```javascript
"scripts": {
    "debug": "node --inspect-brk ./node_modules/webpack/bin/webpack.js"
 },
```

## VueLoaderPlugin

先从入口文件 lib/index.js 开始分析，因为我的 Webpack 是 4.x 版本，所以 VueLoaderPlugin = require('./plugin-webpack4')，重点来看看这个 lib/plugin-webpack4.js 文件:

```javascript
const qs = require("querystring");
const RuleSet = require("webpack/lib/RuleSet");

const id = "vue-loader-plugin";
const NS = "vue-loader";
// 很明显这就是一个webpack插件写法
class VueLoaderPlugin {
  apply(compiler) {
    if (compiler.hooks) {
      // 编译创建之后，执行插件
      compiler.hooks.compilation.tap(id, (compilation) => {
        const normalModuleLoader = compilation.hooks.normalModuleLoader;
        normalModuleLoader.tap(id, (loaderContext) => {
          loaderContext[NS] = true;
        });
      });
    } else {
      // webpack < 4
      compiler.plugin("compilation", (compilation) => {
        compilation.plugin("normal-module-loader", (loaderContext) => {
          loaderContext[NS] = true;
        });
      });
    }

    // webpack.config.js 中配置好的 module.rules
    const rawRules = compiler.options.module.rules;
    // 对 rawRules 做 normlized
    const { rules } = new RuleSet(rawRules);

    // 从 rawRules 中检查是否有规则去匹配 .vue 或 .vue.html
    let vueRuleIndex = rawRules.findIndex(createMatcher(`foo.vue`));
    if (vueRuleIndex < 0) {
      vueRuleIndex = rawRules.findIndex(createMatcher(`foo.vue.html`));
    }
    const vueRule = rules[vueRuleIndex];
    if (!vueRule) {
      throw new Error(
        `[VueLoaderPlugin Error] No matching rule for .vue files found.\n` +
          `Make sure there is at least one root-level rule that matches .vue or .vue.html files.`
      );
    }
    if (vueRule.oneOf) {
      throw new Error(
        `[VueLoaderPlugin Error] vue-loader 15 currently does not support vue rules with oneOf.`
      );
    }

    // 检查 normlized rawRules 中 .vue 规则中是否具有 vue-loader
    const vueUse = vueRule.use;
    const vueLoaderUseIndex = vueUse.findIndex((u) => {
      return /^vue-loader|(\/|\\|@)vue-loader/.test(u.loader);
    });

    if (vueLoaderUseIndex < 0) {
      throw new Error(
        `[VueLoaderPlugin Error] No matching use for vue-loader is found.\n` +
          `Make sure the rule matching .vue files include vue-loader in its use.`
      );
    }

    // make sure vue-loader options has a known ident so that we can share
    // options by reference in the template-loader by using a ref query like
    // template-loader??vue-loader-options
    const vueLoaderUse = vueUse[vueLoaderUseIndex];
    vueLoaderUse.ident = "vue-loader-options";
    vueLoaderUse.options = vueLoaderUse.options || {};

    // 过滤出 .vue 规则，其他规则调用 cloneRule 方法重写了 resource 和 resourceQuery 配置
    // 用于编译vue文件后匹配依赖路径 query 中需要的loader
    const clonedRules = rules.filter((r) => r !== vueRule).map(cloneRule);

    // 加入全局 pitcher-loader，路径query有vue字段就给loader添加pitch方法
    const pitcher = {
      loader: require.resolve("./loaders/pitcher"),
      resourceQuery: (query) => {
        const parsed = qs.parse(query.slice(1));
        return parsed.vue != null;
      },
      options: {
        cacheDirectory: vueLoaderUse.options.cacheDirectory,
        cacheIdentifier: vueLoaderUse.options.cacheIdentifier,
      },
    };

    // 修改原始的 module.rules 配置
    compiler.options.module.rules = [pitcher, ...clonedRules, ...rules];
  }
}
```

以上大概就是 VueLoaderPlugin 所做的事情。也就是说 VueLoaderPlugin 主要就是修改 module.rules 的配置。总的来说就是对 vue 单文件编写做的一个扩展(比如我们可以写 less 文件，在 vue style 中也可以写 less)

## vue-loader

继续来看看 vue-loader 是如何操作.vue 文件的，目前只关心 style 部分，逻辑在 lib/index.js：

## vue 文件解析

```javascript
// 很明显这就是一个loader写法
module.exports = function (source) {
  const loaderContext = this;
  // ...
  const {
    target,
    request, // 请求资源路径
    minimize,
    sourceMap,
    rootContext, // 根路径
    resourcePath, // vue文件的路径
    resourceQuery, // vue文件的路径 query 参数
  } = loaderContext;
  // ...

  // 解析 vue 文件，descriptor 是AST抽象语法树的描述
  const descriptor = parse({
    source,
    compiler: options.compiler || loadTemplateCompiler(loaderContext),
    filename,
    sourceRoot,
    needMap: sourceMap,
  });
  /**
   *
   */
  // hash(文件路径 + 开发环境 ？文件内容 : "")生成 id
  const id = hash(isProduction ? shortFilePath + "\n" + source : shortFilePath);
  // descriptor.styles 解析后是否具有 attrs: {scoped: true}
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  /**
   *
   */
  let stylesCode = ``;
  if (descriptor.styles.length) {
    // 最终生成一个import依赖请求
    stylesCode = genStylesCode(
      loaderContext,
      descriptor.styles,
      id,
      resourcePath,
      stringifyRequest,
      needsHotReload,
      isServer || isShadow // needs explicit injection?
    );
  }
};
```

可以看到解析完 vue 文件的结果大概就是这样的：

<ViewerZoom src="../images/css3/1715cedd2e458619~tplv-t2oaga2asx-image.png" />

## 依赖解析

vue 文件解析完之后 template，script，style 等都有个依赖的路径，后续可以通过配置的 loader 进行解析了，因为我们已经在 VuePluginLoader 中修改了 module.rules 的配置，而且依赖的路径中 query 中都拥有 vue 字段，所以会先走到 pitcher-loader,现在来分析 lib/loaders/pitcher.js 中的逻辑：

```javascript
/**
 *
 */
module.exports = (code) => code;

module.exports.pitch = function (remainingRequest) {
  const options = loaderUtils.getOptions(this);
  const { cacheDirectory, cacheIdentifier } = options;
  const query = qs.parse(this.resourceQuery.slice(1));

  let loaders = this.loaders;
  if (query.type) {
    if (/\.vue$/.test(this.resourcePath)) {
      // 过滤eslint-loader
      loaders = loaders.filter((l) => !isESLintLoader(l));
    } else {
      loaders = dedupeESLintLoader(loaders);
    }
  }
  // 过滤pitcher-loader
  loaders = loaders.filter(isPitcher);

  const genRequest = (loaders) => {
    const seen = new Map();
    const loaderStrings = [];

    loaders.forEach((loader) => {
      const identifier =
        typeof loader === "string" ? loader : loader.path + loader.query;
      const request = typeof loader === "string" ? loader : loader.request;
      if (!seen.has(identifier)) {
        seen.set(identifier, true);
        // loader.request contains both the resolved loader path and its options
        // query (e.g. ??ref-0)
        loaderStrings.push(request);
      }
    });

    return loaderUtils.stringifyRequest(
      this,
      "-!" +
        [...loaderStrings, this.resourcePath + this.resourceQuery].join("!")
    );
  };

  if (query.type === `style`) {
    const cssLoaderIndex = loaders.findIndex(isCSSLoader);
    // 调整loader执行顺序
    if (cssLoaderIndex > -1) {
      const afterLoaders = loaders.slice(0, cssLoaderIndex + 1);
      const beforeLoaders = loaders.slice(cssLoaderIndex + 1);
      const request = genRequest([
        ...afterLoaders, // [style-loader,css-loader]
        stylePostLoaderPath, // style-post-loader
        ...beforeLoaders, // [vue-loader]
      ]);
      return `import mod from ${request}; export default mod; export * from ${request}`;
    }
  }
  /**
   *
   */
  const request = genRequest(loaders);
  return `import mod from ${request}; export default mod; export * from ${request}`;
};
```

可以看到解析带 scoped 属性的 style 的结果大概就是这样的：

<ViewerZoom src="../images/css3/1715e11bc86e5a36~tplv-t2oaga2asx.png" />

## 新的依赖解析

分析{type：style}的处理流程顺序：

- vue-loader、style-post-loader、css-loader、style-loader。
  处理资源的时候先走的是 vue-loader，这时 vue-loader 中的处理逻辑与第一次解析 vue 文件不一样了：

```javascript
const incomingQuery = qs.parse(rawQuery)
// 拥有{type:style}
if (incomingQuery.type) {
    return selectBlock(
      descriptor,
      loaderContext,
      incomingQuery,
      !!options.appendExtension
    )
 }


 // lib/select.js
 module.exports = function selectBlock (
  descriptor,
  loaderContext,
  query,
  appendExtension
) {
   // ...
  if (query.type === `style` && query.index != null) {
    const style = descriptor.styles[query.index]
    if (appendExtension) {
      loaderContext.resourcePath += '.' + (style.lang || 'css')
    }
    loaderContext.callback(
      null,
      style.content,
      style.map
    )
    return
  }

```

> 可以看到 vue-loader 处理完后返回的就是 style.content，也就是 style 标签下的内容，然后交给后续的 loader 继续处理

再来看一下 style-post-loader 是如何生成 data-v-hash:8 的,逻辑主要在 lib/loaders/stylePostLoaders.js 中：

```javascript
const qs = require("querystring");
const { compileStyle } = require("@vue/component-compiler-utils");

module.exports = function (source, inMap) {
  const query = qs.parse(this.resourceQuery.slice(1));
  const { code, map, errors } = compileStyle({
    source,
    filename: this.resourcePath,
    id: `data-v-${query.id}`,
    map: inMap,
    scoped: !!query.scoped,
    trim: true,
  });

  if (errors.length) {
    this.callback(errors[0]);
  } else {
    this.callback(null, code, map);
  }
};
```

处理最终返回的 code 是这样的：
<ViewerZoom src="../images/css3/1715e40c4ac7c36e~tplv-t2oaga2asx-image.png" />
