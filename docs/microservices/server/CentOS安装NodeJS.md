# CentOS安装NodeJS

> CentOS上安装NodeJS

1、从官网下载最新的nodejs，<https://nodejs.org/en/download/>

  **历史版本可从https://nodejs.org/dist/下载**

2、通过ftp工具上传到linux服务，解压安装包

```
tar -xvf node-v10.16.0-linux-x64.tar.xz
```

 3、移动并改名文件夹（不改名也行）

```javascript
cd /usr/local/
mv /var/ftp/pub/node-v10.16.0-linux-64 . //后面的.表示移动到当前目录
mv node-v10.16.0.0-linux-64/ nodejs
```

4、让npm和node命令全局生效

　　方式一：环境变量方式（这种方式似乎只对登录用户有效？）

　　1）、加入环境变量，在 /etc/profile 文件末尾增加配置

```
vi /ect/profile
export PATH=$PATH:/usr/local/nodejs/bin
```

　　2）、执行命令使配置文件生效

```
source /etc/profile
```

　　方式二：软链接方式（推荐）

```
ln -s /usr/local/nodejs/bin/npm /usr/local/bin/
ln -s /usr/local/nodejs/bin/node /usr/local/bin/
```

5、查看nodejs是否安装成功

```
node -v
npm -v
```

 