# linux常用命令

- tar

```shell
tar cvf etcbak.tar etc/ // 打包一个tar
tar xvf etcbak.tar // 解压一个tar
tar cvzf etcbak.tar.gz etc/ // 打包压缩一个tar
tar zxvf etcbak.tar.gz // 解压一个tar
```

- cp [options] 源文件(source) 目标文件(destination)

```shell
-a : 相当于dpr参数组合，至于dpr请参考下列说明；（常用）
-d : 若源文件为链接文件的属性（link file）,则复制链接文件属性而不是文件本身
-f, --force : 若目标文件已经存在，则直接覆盖且没有提示；
-i,--interactive 与-f选项不同，在覆盖目标文件之前先给出提示，要求用户予以确定。回答y时目标文件将被覆盖。
-p: 除复制源文件的内容外，还将其修改时间和存取权限也复制到新文件中。
-R,-r： 递归复制目录，即将源目录下的所有文件及其各级子目录都复制到目标位置。
-l: 不复制，而是创建指向源文件的链接文件，链接文件名由目标文件给出。  
```

- rm命令 rm [选项] 文件列表

  **该命令删除指定的文件，默认情况下，它不能删除目录。如果没有给出选项-f或--force，该命令删除文件之前会提示用户是否删除该文件；如果用户没有回答y或者Y，则不删除文件**

```shell
-f,--force 忽略不存的的文件，并且不给出提示信息。
-r, -R, --recursive 递归地删除指定目录及其下属的各级子目录和相应的文件。
-i 交互式删除文件。
```

- mv命令 mv [选项] source target

```shell
-i,--interactive 交互式操作。如果源文件与目标文件或目标目录中的文件同名，则询问用户是否覆盖目标文件。用户输入y，表示将覆盖目标文件；输入n,表示取消对源文件的移动。这样可以避免误将文件覆盖。
-f 与-i相反，它禁止交互式操作。在覆盖已有的目录文件时，不给出任何提示；
```

- ssh 用于登录远程主机

```shell
 ssh [-p port] user@remote
 user 是在远程机器上的用户名，如果不指定的话默认为当前用户
 remote是远程机器的地址，可以是IP/域名，或者是别名
 port是SSH Server监听的端口，如果不指定，就为默认值22
```

- find 命令格式

```shell
find path -options [-print][-exec -ok | xargs | grep] [command {}\;]
```

1) path:要找的目录路径

- ~ 表示$HOME目录
- .表示当前目录
- /表示根目录

2) print: 表示将结果输出到标准输出。

3) exec:对匹配的文件执行该参数所给出的shell命令。

​	形式为command {} \; **注意{}与\;之间有空格**

4) ok: 与exec作用相同，起承接作用

​	区别在于，在执行命令之前，都会给出提示，让用户确认是否执行

5) |xargs与exec作用相同，起承接作用

​	区别在于|xargs主要用于承接删除操作，而-exec都可用 如复制、移动、重命名等

6) options: 表示查找方式

​	options常用的选项如下：

```shell
-name filename #查找名为filename的文件
-perm #按执行权限来查找
-user username #按文件属主来查找
-group groupname #按组来查找
-mtime -n +n #按文件更改时间来查找文件，-n指n天以内，+n指n天以前
-atime -n +n #按文件访问时间来查找文件，-n指n天以内，+n指n天以前
-ctime -n +n #按文件创建时间来查找文件，-n指n天以内，+n指n天以前
-prune #忽略某个目录
```

eg:

```shell
find / -mtime 5 //找5天前的那一天被更改过的档案名。
find / -mtime +5 // 找5天之前被更改过的档案名。
find / -mtime -5 // 找5天前的那一天被更改过的档案名。
find / -mtime 0 // 将系统24小时内更改过内容的档案列出。
```

- df 查看文件系统硬盘使用情况

  ```shell
  df [选项] [目录或文件名]
  ```

  | 选项 | 作用                                                         |
  | ---- | ------------------------------------------------------------ |
  | -a   | 显示所有文件系统信息，包括系统特有的 /proc、/sysfs 等文件系统； |
  | -m   | 以 MB 为单位显示容量；                                       |
  | -k   | 以 KB 为单位显示容量，默认以 KB 为单位；                     |
  | -h   | 使用人们习惯的 KB、MB 或 GB 等单位自行显示容量；             |
  | -T   | 显示该分区的文件系统名称；                                   |
  | -i   | 不用硬盘容量显示，而是以含有 inode 的数量来显示。            |

- chmod 改变一个或多个文件的存取模式(mode) 

  ```shell
  chmod [options] mode files
  ```

  **mode：**
  可以是数字形式或以who opcode permission形式表示。who是可选的，默认是a(所有用户)。只能选择一个opcode(操作码)。可指定多个mode，以逗号分开。

  > 综上，包含options、who、opcode、permission等选项，下面分别进行介绍

  options:

  | 标识                | 含义                                               |
  | ------------------- | -------------------------------------------------- |
  | -c，–changes        | 只输出被改变文件的信息                             |
  | -f，–silent，–quiet | 当chmod不能改变文件模式时，不通知文件的用户        |
  | –help               | 输出帮助信息。                                     |
  | -R，–recursive      | 可递归遍历子目录，把修改应到目录下所有文件和子目录 |
  | –reference=filename | 参照filename的权限来设置权限                       |
  | -v，–verbose        | 无论修改是否成功，输出每个文件的信息               |
  | –version            | 输出版本信息                                       |

  **who**

  | 标识 | 含义           |
  | ---- | -------------- |
  | u    | 用户           |
  | g    | 组             |
  | o    | 其它           |
  | a    | 所有用户(默认) |

  **opcode**

  | 标识 | 含义         |
  | ---- | ------------ |
  | +    | 增加权限     |
  | -    | 删除权限     |
  | =    | 重新分配权限 |

  **permission**

  | 标识 | 含义                                               |
  | ---- | -------------------------------------------------- |
  | r    | 读                                                 |
  | w    | 写                                                 |
  | x    | 执行                                               |
  | s    | 设置用户(或组)的ID号                               |
  | t    | 设置粘着位(sticky bit)，防止文件或目录被非属主删除 |

  eg: 

  ```
  chmod u+x file                　给file的属主增加执行权限
  ```

- lsof 是list open files的简称。它的参数很多，但是我们这里只介绍一些实用的用法（注意有些情况需要root权限执行）。 

  ```shell
  lsof abc.txt 显示开启文件abc.txt的进程
  lsof -i :22 知道22端口现在运行什么程序
  lsof -c abc 显示abc进程现在打开的文件
  lsof -g gid 显示归属gid的进程情况
  lsof +d /usr/local/ 显示目录下被进程开启的文件
  lsof +D /usr/local/同上，但是会搜索目录下的目录，时间较长
  lsof -d 4 显示使用fd为4的进程
  ```

- curl 是一个利用URL规则在命令行下工作的文件传输工具。它支持文件的上传和下载 

  ```shell
  curl(选项)(参数)
  
  -F/--form <name=content>	模拟http表单提交数据
     --form-string <name=string>	模拟http表单提交数据
  -o/--output	把输出写到该文件中
  -O/--remote-name	把输出写到该文件中，保留远程文件的文件名
  
  eg:
  curl http://127.0.0.1:8080 -o file.txt --progress # 使用选项 -o 将下载的数据写入到文件 并使用 --progress 显示进度条
  curl -F avatar=@dist.tar.gz 29.2.221.176/ishare/profile #模拟http表单提交，将文件dist.tar.gz上传到29.2.221.176/ishare/profile接口服务
  ```

- wget 是一个下载文件的工具，它用在命令行下。对于Linux用户是必不可少的工具, wget工具体积小但功能完善，它支持断点下载功能，同时支持FTP和HTTP下载方式，支持代理服务器和设置起来方便简单。下面我们以实例的形式说明怎么使用wget。  

  安装方式：yum install wget 

  **主要使用如下：**

  ```shell
  wget http://mirrors.163.com/.help/CentOS7-Base-163.repo #使用wget下载单个文件 
  wget -O wordpress.zip http://www.centos.bz/download.php?id=1080 #使用wget -O下载并以不同的文件名保存 
  wget –limit-rate=300k http://cn.wordpress.org/wordpress-3.1-zh_CN.zip #使用wget –limit -rate限速下载 
  wget -c http://cn.wordpress.org/wordpress-3.1-zh_CN.zip  #使用wget -c断点续传 
  wget -b http://cn.wordpress.org/wordpress-3.1-zh_CN.zip #使用wget -b后台下载 
  wget -o download.log URL #使用wget -o把下载信息存入日志文件 
  ```

- ls命令用于显示文件目录列表， 当不加参数时，默认列出当前目录的列表信息。 

  ```shell
  ls [选项] [目录或文件名]
  参数：
  -a：--all的缩写，显示所有的文件，包括隐藏文件(以.开头的文件)，参考示例1。(常用)
  -A：--almost-all的缩写，显示所有的文件，包括隐藏文件，但不包括表示当前目录.和上级目录..这两个文件，参考示例2。
  -c：和-lt一起使用：显示列表并且以ctime(文件状态最后改变时间)排序。和-l一起使用：显示ctime并且以文件名排序。其他情况，以ctime排序。参考示例3。
  -d：--directory的缩写，仅列出目录本身，而不是列出目录里的内容列表，参考示例4。(常用)
  -f：直接列出结果，而不进行排序(ls默认会以文件名排序)
  --color[=WHEN]：是否根据文件类型显示颜色，WHEN可以为never、always或者auto
  --full-time：以完整的实际模式显示(包含年月日时分)，类似与ls -l --time-style=full-iso，参考示例5。
  -g：列表显示结果，和-l类似，但是不显示文件所属者。
  -h：将文件内容大小以GB、KB等易读的方式显示，参考示例6。
  -i：结合-l参数，列出每个文件的inode，参考示例7。
  -l：列出长数据串，显示出文件的属性与权限等数据信息(常用)
  -n：和-l类似，只是显示的所属用户和组不是名称而是对应的id，参考示例8。
  -r：--reverse，将排序结果以倒序方式显示，参考示例9。
  -S：以文件大小排序，参考示例9。
  -t：以修改时间排序
  --help：显示帮助信息
  ```

  eg:

  ```shell
  ls -a #列出所有文件
  ls -A #列出所有的文件，但不包括表示当前目录.和上级目录..这两个文件。
  ls -clt #显示列表并且以ctime排序
  ls -d /home   #仅列出/home目录本身
  ls /home   #列出/home目录里的内容
  ls --full-time / #显示完整时间
  ls -l #以易读方式显示列表
  ls -lh #将文件内容大小以GB、KB等易读的方式显示
  ls -il #查看建立的软链接
  ```

- rm 命令用于删除一个文件或者目录。 

  ```shell
  rm [options] name
  -i 删除前逐一询问确认。
  -f 即使原档案属性设为唯读，亦直接删除，无需逐一确认。
  -r 将目录及以下之档案亦逐一删除。
  ```

  eg:

  ```shell
  rm  -r  * #删除当前目录下的所有文件及目录
  rm -rf home/ #不询问直接删除home目录下的所有文件
  rm -rf file #删除软链接
  ```

- kill

  ```shell
  kill[参数][进程号]
  -l  信号，若果不加信号的编号参数，则使用“-l”参数会列出全部的信号名称
  -a  当处理当前进程时，不限制命令名和进程号的对应关系
  -p  指定kill 命令只打印相关进程的进程号，而不发送任何信号
  -s  指定发送信号
  -u  指定用户 
  ```

  eg:

  ```shell
   ps -ef|grep vim #先用ps查找进程，然后用kill杀掉
   root      3268  2884  0 16:21 pts/1    00:00:00 vim install.log
   root      3370  2822  0 16:21 pts/0    00:00:00 grep vim
   kill 3268 #用kill杀掉3268这个进程
   kill –9 3268 #彻底杀死进程
  ```

- netstat命令用于显示网络状态。 

  ```shell
  netstat [-acCeFghilMnNoprstuvVwx][-A<网络类型>][--ip]
  -a (all)显示所有选项，默认不显示LISTEN相关
  -t (tcp)仅显示tcp相关选项
  -u (udp)仅显示udp相关选项
  -n 拒绝显示别名，能显示数字的全部转化成数字。
  -l 仅列出有在 Listen (监听) 的服务状态
  -p 显示建立相关链接的程序名
  -r 显示路由信息，路由表
  -e 显示扩展信息，例如uid等
  -s 按各个协议进行统计
  -c 每隔一个固定时间，执行该netstat命令。
  ```

  eg:

  ```shell
  netstat -a #列出所有端口
  netstat -at #列出所有 tcp 端口
  netstat -au #列出所有 udp 端口 netstat -au
  netstat -i #显示网络接口列表
  netstat -c # netstat 将每隔一秒输出网络信息。
  ```

- ln在文件之间建立链接（硬链接和软链接）

  ```shell
  ln [选项] 源文件 目标文件
  选项：
  -s：建立软链接文件。如果不加 "-s" 选项，则建立硬链接文件；
  -f：强制。如果目标文件已经存在，则删除目标文件后再建立链接文件；
  ```

  eg:

  ```shell
  ln /root/cangls /tmp #建立硬链接文件，目标文件没有写文件名，会和原名一致,也就是/tmp/cangls 是硬链接文件
  #比如我的文件在 /opt/cs 下面，我想在 /opt/var/cs 这个路径下面也能访问到，那么应该这样来做
  ln -s  /opt/cs   /opt/var      #/opt/var下面不用创建cs这个目录，会自动创建,注意，软链接文件的源文件必须写成绝对路径，而不能写成相对路径（硬链接没有这样的要求）；否则软链接文件会报错。这是初学者非常容易犯的错误。
  ```

- mount

- telnet

- gzip 

- unzip 

- ps 命令查看当前系统中运行的进程信息

  ```shell
  ps [选项]
  a BSD风格。显示系统中与终端try相关的所有进程的信：当与选项x一起使用时，显示所有进程的信息。
  -e 显示所有进程的信息
  -f 显示进程的所有信息
  -l 以长格式显示进程信息
  r 只显示正在运行的进程
  u 显示面向用户的格式（包括用户名、CPU及内存使用情况等信息）
  x BSD风格。显示所有非控制终端上的进程信息：当与选项a一起使用时，显示所有进程的信息。
  ```

  eg: 

  ```shell
  ps aux #显示所有终端上所有用户的有关进程的所有信息：
  ps aux | grep node #ps是显示当前状态处于running的进程，grep表示在这些里搜索，而ps aux是显示所有进程和其状态，此处是查找node的进程
  ```

  

