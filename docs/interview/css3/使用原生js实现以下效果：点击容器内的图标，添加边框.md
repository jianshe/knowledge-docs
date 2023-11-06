# 使用原生 js 实现以下效果：点击容器内的图标，图标边框变成 border:1px solid red，点击空白处重置

## 代码实现如下

```javascript
const box = document.getElementById("box");

function isIcon(target) {
  return target.className.includes("icon");
}
box.onClick = function (e) {
  e.stopPropagation();
  const target = e.target;
  if (isIcon(target)) {
    target.style.border = "1px solid red";
  }
};

const doc = document;

doc.onClick = function (e) {
  const children = box.children;
  for (let i = 0; i < children.length; i++) {
    if (isIcon(children[i])) {
      children[i].style.border = "none";
    }
  }
};
```
