# Nodejs文件管理模块fs及案例

## 一、fs 基础方法

- fs.stat 检测是文件还是目录。
- fs.mkdir 创建目录。
- fs.writeFile 创建文件。
- fs.appendFile 追回文件。
- fs.readFile 读取文件（异步）。
- fs.readFileSync 读取文件（同步）。
- fs.readdir 读取目录。
- fs.rename 重命名。
- fs.unlink 删除文件。
- fs.existsSync 路径是否存在

## 1、fs.stat: 检测是文件还是目录。

```javascript
const fs = require("fs");
fs.stat("fs.js", (err, stats) => {
  if (error) {
    console.log(err);
    return false;
  } else {
    console.log(stats);
    console.log(`文件：${stats.isFile()}`); // 文件： true
    console.log(`目录：${stats.isDirectory()}`); // 目录： true
    return false;
  }
});
```

**补充：**

- stats.isFile() 如果是文件返回 true，否则返回 false。
- stats.isDirectory() 如果是目录返回 true，否则返回 false。

## 2、fs.mkdir：创建目录

```javascript
const fs = require("fs");
fs.mkdir("images", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("目录创建成功！");
  }
});
```

接收参数：

- path：将创建的目录路径。
- mode：目录权限（读写权限），默认 0777。
- callback：回调，传递异常参数 err。

## 3、fs.rmdir:删除目录

```javascript
const fs = require("fs");
fs.rmdir("images", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("目录删除成功！");
  }
});
```

## 4、fs.writeFile：创建写入文件

```javascript
const fs = require("fs");
fs.writeFile("index.js", "hello NodeJS！", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("文件写入成功！");
  }
});
```

接收参数：

- filename (String) 文件名称。
- data (String | Buffer) 将要写入的内容，可以是字符串或者 buffer 数据。
- encoding (String) 可选。默认 'utf-8'，当 data 是 buffer 时，该值应该为 ignored。
- mode (Number) 文件读写权限，默认 438。
- flag (String) 默认值 'w'。
- callback { Function } 回调，传递一个异常参数 err。

执行 node fs.js。

会发现目录下多了一个 index.js 文件夹，并且添加了“hello NodeJS！”的内容。

注意，这样的写入，是清空原文件中的所有数据，然后添加“hello NodeJS！”这句话，即：存在即覆盖，不存在即创建。

## 5、fs.unlink:删除文件

```javascript
const fs = require("fs");
fs.unlink("index.js", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("删除成功");
  }
});
```

执行 node fs.js。

会发现目录下 index.js 文件被删除。

## 6、fs.appendFile：追回文件

```javascript
const fs = require("fs");
fs.appendFile("index.js", "追回的内容", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("追加成功！");
  }
});
```

执行 node fs.js。

会发现目录下 index.js 文件后有追加了一段话“追加的内容”。

## 7、fs.readFile：读取文件

```javascript
const fs = require("fs");
fs.readFile("index.js", (err, data) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("读取文件成功！");
    console.log(data); // <Buffer 68 65 6c 6c 6f 20 4e 6f 64 65 4a 53 ef bc 81 e8 bf bd e5 8a a0 e7 9a 84 e5 86 85 e5 ae b9>
  }
});
```

## 8、fs.readdir：读取目录

```javascript
const fs = require("fs");
fs.readdir("node_modules", (err, data) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("读取目录成功！");
    console.log(data); // 列出node_modules文件夹下的所有文件名
  }
});
```

执行 node fs.js。

console.log(data) 打印结果：列出 node_modules 文件夹下的所有文件名

## 9、fs.rename：重命名

```javascript
const fs = require("fs");
fs.rename("index.js", "new_index.js", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("重命名成功！");
  }
});
```

执行 node fs.js。

会发现目录下 index.js 文件被修改为 new_index.js。

## 10、补充：fs.rename 还可以剪切

```javascript
const fs = require("fs");
fs.rename("new_index.js", "node_modules/new_index.js", (err) => {
  if (err) {
    console.log(err);
    return false;
  } else {
    console.log("剪切成功！");
  }
});
```

执行 node fs.js。

会发现目录下 new_index.js 文件被移动到了 node_modules 目录下。

## 11、fs.existsSync: 路径是否存在

```javascript
const fs = require("fs");
if (fs.existsSync(path)) {
  console.log("该路径已存在");
}
```

## 二、案例

## 1、判断是否有 upload 目录

```javascript
const fs = require("fs");
fs.stat("upload", (err, stats) => {
  if (err) {
    // 如果没有，创建upload目录
    fs.mkdir("upload", (err) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("创建成功！");
      }
    });
  } else {
    console.log(stats.isDirectory()); // true
    console.log("有 upload 目录，你可以做更多操作！");
  }
});
```

## 2、读取指定目录全部文件

```javascript
const fs = require("fs");
const path = require("path");
const readDir = (entry) => {
  const dirInfo = fs.readdirSync(entry);
  dirInfo.forEach((item) => {
    const location = path.join(entry, item);
    const info = fs.statSync(location);
    if (info.isDirectory()) {
      console.log(`dir:${location}`);
      readDir(location);
    } else {
      console.log(`file:${location}`);
    }
  });
};
readDir(__dirname);
```

## 3、文件复制

使用 Nodejs 的 stream 模块中为我们提供的 pipe()方法来实现。

```javascript
const fs = require("fs");
function handleCopy(src, dst) {
  const paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function (path) {
    const _src = src + "/" + path;
    const _dst = dst + "/" + path;
    fs.stat(_src, function (err, stats) {
      // stats 该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) {
        // 如果是个文件则拷贝
        const readable = fs.createReadStream(_src); //创建读取流
        const writable = fs.createWriteStream(_dst); //创建写入流
        readable.pipe(writable);
      } else if (stats.isDirectory()) {
        //是目录则递归
        exists(_src, _dst);
      }
    });
  });
}
function exists(src, dst) {
  //测试某个路径下文件是否存在
  fs.exists(dst, function (exists) {
    if (exists) {
      //存在
      handleCopy(src, dst);
    } else {
      //不存在
      fs.mkdir(dst, function () {
        //创建目录
        handleCopy(src, dst);
      });
    }
  });
}
module.exports = async function (src, dst) {
  handleCopy(src, dst);
};
```

流的方式写入

```javascript
let uploadFile = function (folder, targetPath, filePath) {
  let existFiles = fs.readdirSync(folder);
  for (var i = 0; i < existFiles.length; i++) {
    fs.unlinkSync(path.join(folder, existFiles[i]));
  }
  //读文件写文件
  let data = fs.readFileSync(filePath);
  if (data) {
    let res = fs.writeFileSync(targetPath, data);
  } else {
    console.log("参数错误");
  }
};
```

## 5、删除目录下的所有文件

```javascript
const fs = require("fs");
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}
module.exports = async function (path) {
  delDir(path);
};
```
