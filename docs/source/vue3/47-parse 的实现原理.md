# 47-parse 的实现原理

## 有限状态机

1. 定义：读取一组输入然后根据这些输入来更改为不同的状态

## parse 原理流程图

1. 初始状态 -> 插值({{}}) ->end -> 初始状态。
2. 初始状态 -> < =>parseElement -> parseTag -> parseChildren->parseTag（结束）
3. 初始状态-> text -> 非插值和 element 状态 -> text -> end - > 初始状态

## 测试案例

1. <div>hi, {{message }}</div>
1. root -> element -> text
   element -> 插值

## 有限状态集和正则表达式之间的关系

## 测试案例

1. // /abc/.test("")

## 核心代码

```javascript
function test(string) {
  let i;
  let startIndex;
  let endIndex;
  function waitForA(char) {
    if (char === "a") {
      startIndex = i;
      return waitForB;
    }
    return waitForA;
  }
  function waitForB(char) {
    if (char === "b") {
      return waitForC;
    }
    return waitForA;
  }
  function waitForC(char) {
    if (char === "c") {
      endIndex = i;
      return end;
    }
    return waitForA;
  }

  function end() {
    return end;
  }

  let currentState = waitForA;

  for (let i = 0; i < string.lenght; i++) {
    let nextState = currentState(string(i));
    currentState = nextState;

    if (currentState === end) {
      console.log(startIndex, endIndex);
      currentState = waitForA;
      return true;
    }
    return false;
  }
}

// 调用
console.log(test("abc"));
```
