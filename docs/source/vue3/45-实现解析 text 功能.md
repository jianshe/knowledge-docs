# 45-实现解析 text 功能

## 核心功能
1. 如果命中插值和element，当作text来处理。
2. 当处理完字符串后，需要将其截取掉。

## 单元测试
```javascript
  describe("text", () => {
    test("simple text", () => {
      const ast = baseParse("some text");
      const text = ast.children[0];

      expect(text).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });

    test("simple text with invalid end tag", () => {
      const ast = baseParse("some text</div>");
      const text = ast.children[0];

      expect(text).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });

    test("text with interpolation", () => {
      const ast = baseParse("some {{ foo + bar }} text");
      const text1 = ast.children[0];
      const text2 = ast.children[2];

      // ast.children[1] 应该是 interpolation
      expect(text1).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some ",
      });
      expect(text2).toStrictEqual({
        type: NodeTypes.TEXT,
        content: " text",
      });
    });
  });
```
## 核心代码
```javascript

function parseText(context): any {
  console.log("解析 text", context);

  // endIndex 应该看看有没有对应的 <
  // 比如 hello</div>
  // 像这种情况下 endIndex 就应该是在 o 这里
  // {
  const endTokens = ["<", "{{"];
  let endIndex = context.source.length;

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    // endIndex > index 是需要要 endIndex 尽可能的小
    // 比如说：
    // hi, {{123}} <div></div>
    // 那么这里就应该停到 {{ 这里，而不是停到 <div 这里
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}
```
