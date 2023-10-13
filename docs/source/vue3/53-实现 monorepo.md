# 53-实现 monorepo

## monorepo

1. monorepo 是一种组织代码的方式，单个仓库，把相关的项目都放到一个仓库中。（一般情况下放到 packages 中，但不代表只能放到 packages 中）。

## 优点和缺点

## 优点

1. 共用基础设施，不需要我们重新配置了。
2. 有依赖的项目之间调试开发非常方便。
3. 第三方的库管理更简单了。

## 缺点

1. 项目粒度的权限管理问题。
2. 代码量比较庞大，对于新手不太友好。

## 主流的 monorepo 工具

1. npm
2. yarn
3. pnpm
4. larna
5. turborepo -> 为了解决让我们更快的编辑和 build 命令。
6. nx -> 为了解决让我们更快的编辑和 build 命令。
7. RushJS -> 为了解决让我们更快的编辑和 build 命令。

> 解决执行管理，项目的 command。

## Vue3 是如何做的

1. 从之前的 yarn 升级了 pnpm。 -> 利用软链接的方式节约磁盘空间，并提升安装速度。创建非扁平化的 node_modules 文件夹。
2. Build 命令 -> Script/build.js
3. test 命令 -> vitest

## how

### 1.使用 pnpm 的 monorepo。

#### workplace

> workplace 理解 workplace 的概念，一个 workspace 的根目录下必须有 pnpm-workspace.yaml 文件，也可能会有.npmrc 文件。  
> workplace 命令 Pnpm | xxx -W -> 安装到 root 目录下;Pnpm | xxx -F xxx -> 安装到指定项目下。  
> pnpm-workspace.yaml 指定一下路径。

#### 包的依赖顺序

1. reactivity -> shared
2. runtime-coure 依赖 reactivity 和 shared。
3. runtime-dom 依赖 runtime-core。
4. compiler-core 依赖 shared

### 2. 调整 build 逻辑。

### 3. 使用 vitest 替换 jest。
