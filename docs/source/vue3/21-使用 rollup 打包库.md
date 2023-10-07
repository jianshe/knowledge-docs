# 21-使用 rollup 打包库
## 安装依赖

```javascript
   "rollup": "^2.17.1",
    "rollup-plugin-typescript": "^1.0.1",
    "tslib": "^2.0.0",
```
## 配置rollup.config.js

```javascript
import pkg from "./package.json";
import typescript from "rollup-plugin-typescript";

export default {
  input: "./src/index.ts",
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    })
  ],
  output: [
    {
      format: "cjs",
      file: pkg.main,
      sourcemap: true,
    },
    {
      name: "vue",
      format: "es",
      file: pkg.module,
      sourcemap: true,
    },
  ],
  onwarn: (msg, warn) => {
    // 忽略 Circular 的错误
    if (!/Circular/.test(msg)) {
      warn(msg);
    }
  },
};

```
## 执行命令 yarn build
```javascript
  "scripts": {
    "build": "rollup -c rollup.config.js",
    "test": "jest"
  },
```