# 请实现下面的 sleep 方法

```javascript
/**
 * @file 返回一个 Promise，并在 ms 毫秒后 Promise 变为完成状态
 */

export function sleep(ms: number): Promise<undefined> {
  // 补全此处代码
  // 参考答案
 return new Promise((resolve:(value:undefined) => void,reject:(value:undefined) => void) => {
    setTimeout(()=> {
        resolve(undefined);
    },ms);
 })
}

async function main(){
    console.log('a')
    await sleep(1000);
    console.log('b');
    await sleep(1000);
    console.log('c');
}
main()

export default {}
```
