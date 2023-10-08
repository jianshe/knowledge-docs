# 35-更新 element 的 children

## 核心功能

1. children支持两种类型，string和array。
2. 老的是一个string，新的是一个数组。
3. 老的是一个数组，新的是一个数组。
4. 新的是一个文本，老的是一个数组。
5. 新的是一个文本，老的也是一个文本。

## 测试案例
```javascript

// App.js
import { h } from "../../lib/mini-vue.esm.js";
import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // 老的是 array 新的是 text
      //   h(ArrayToText),
      // 老的是 text 新的是 text
      //   h(TextToText),
      // 老的是 text 新的是 array
      h(TextToArray),
      // 老的是 array 新的是 array
      // h(ArrayToArray),
    ]);
  },
};

// ArrayToText.js
// 老的是 array
// 新的是 text
import {ref, h } from "../../lib/mini-vue.esm.js";

const nextChildren = "newChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
// TextToArray.js
// 新的是 array
// 老的是 text
import { ref,h } from "../../lib/mini-vue.esm.js";

const prevChildren = "oldChild";
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];

export default {
  name: "TextToArray",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    console.log("?????????")

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
// TextToText.js

// 新的是 text
// 老的是 text
import { ref, h } from "../../lib/mini-vue.esm.js";

const prevChildren = "oldChild";
const nextChildren = "newChild";

export default {
  name: "TextToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};

```
## 核心代码

```javascript
  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;
    const c1 = n1.children;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 证明当前新的节点是文本节点
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的children清空。
        unmountChildren(n1.children);
      }
      // 2. 设置新的text
      // 新的是Text，老的也是Text文本节点
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新的是一个数组
      // 如果老的是一个文本，先将文本清空掉
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent);
      }
    }
  }

```