# 05-setup 环境：集成 jest & ts

## 安装jest

```javascript
yarn add --dev jest
```

## 添加babel
```javascript
yarn add --dev babel-jest @babel/core @babel/preset-env
```

## 配置babel.config.js
```javascript
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

## babal 支持typescript
```javascript
yarn add --dev @babel/preset-typescript
```

## 更新配置babel.config.js

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

## 配置scripts 并执行yarn test

```javascript
  "scripts": {
    "test": "jest"
  },
```