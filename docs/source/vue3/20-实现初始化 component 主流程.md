# 20-实现初始化 component 主流程

## 核心代码

component.ts

```javascript
export function createComponentInstance(vnode) {
  const component = {
    type: vnode.type,
    vnode,
  };

  return component;
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 获取到用户给到的配置
  const Component = instance.type;

  const { setup } = Component;
  if (setup) {
    // function Object

    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

```
createApp.ts
```javascript
import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换为vnode
      // 所有的逻辑操作都会基于vnode做处理
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}


```
renderer.ts

```javascript
import { createComponentInstance, setupComponent } from "./component"

export function render (vnode,container) {
    // path
    patch(vnode,container)
    
}

function patch(vnode,container) {

    // 去处理组件
    processComponent(vnode,container)

}

function processComponent(vnode,container) {
    mountComponent(vnode,container)
}

function mountComponent(vnode:any,container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance);
    setupRenderEffect(instance,container);
}

function setupRenderEffect(instance: any,container) {
    const subTree= instance.render();

    // vnode -> patch
    // vnode -> element

    patch(subTree,container)
}


```
vnode.ts
```javascript
export function createVNode(type,prop?,children?) {
    return {
        type,
        prop,
        children
    }
}

```
h.ts
```javascript
import { createVNode } from "./vnode";
export const h = (type: string, props: any, children: string | Array<any>) => {
  return createVNode(type, props, children);
};


```
index.ts
```javascript
export * from "./h";
export * from "./createApp";

```