# 44-实现解析 element

## 核心功能
1. 解析element(<div>hello</div>)。

## 测试案例
```javascript
   test("simple div", () => {
      const ast = baseParse("<div>hello</div>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        tagType: ElementTypes.ELEMENT,
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hello",
          },
        ],
      });
    });
```

## 核心代码

```javascript
function parseElement(context, ancestors) {
  // 应该如何解析 tag 呢
  // <div></div>
  // 先解析开始 tag
  const element = parseTag(context, TagType.Start);

  ancestors.push(element);
  const children = parseChildren(context, ancestors);
  ancestors.pop();

  // 解析 end tag 是为了检测语法是不是正确的
  // 检测是不是和 start tag 一致
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺失结束标签：${element.tag}`);
  }

  element.children = children;

  return element;
}

```
