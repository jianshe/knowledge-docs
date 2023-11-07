# 如何使用 promise 封装 ajax 请求

## 核心代码如下

```javascript
function ajax(method, url, date) {
  var xhr = new XMLHttpRequest();

  return new Promise(function (resolve, reject) {
    xhr.onreadystateChange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.responseText);
      }
    };
    xhr.open(method, url);
    xhr.send(data);
  });
}
```
