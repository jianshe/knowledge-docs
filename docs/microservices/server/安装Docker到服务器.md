# 安装Docker到服务器

> 前端开发人员基本上都会写前端项目和node后端服务，但如何将代码部署到服务器，相信不是每一位开发人员都会的，下面，针对不同的操作系统，分别讲解，如何部署项目到远端服务器

目前接触的服务器类型大约有两种：

- Ubuntu 18.04 64位    
- CentOS 8.0 64位

​	**不同的服务器，部署方式有所不同。**

针对Ubuntu 18.04 64位阿里云服务器先安装Docker

1. 申请并连接远端服务器。

2. 升级apt和添加相关软件包。

   ```javascript
   # apt升级
   sudo apt-get update
   # 添加相关软件包
   sudo apt-get install \
   apt-transport-https \
   ca-certificates \
   curl \
   software-properties-common
   ```

3. 下载软件包的合法性，需要添加软件源的 GPG 密钥。

   ```javascript
   curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
   ```

4. source.list 中添加 Docker 软件源。

   ```javascript
   sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
   ```

5. 安装 Docker CE。

   ```javascript
   sudo apt-get update
   sudo apt-get install docker-ce
   ```

1. 启动 Docker CE。

   ```javascript
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

1. 建立 docker 用户组(附加) 。

   ```javascript
   sudo groupadd docker
   sudo usermod -aG docker $USER
   ```

1. Helloworld 测试

   ```javascript
   docker run hello-world
   ```

1. docker 拉取镜像时，可以设置镜像进行加速。

   ```javascript
   # /etc/docker/daemon.json
   {
   "registry-mirrors": [
   "https://dockerhub.azk8s.cn", 
   "https://reg-mirror.qiniu.com" // 七牛云加速器
   ]
   }
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

   **针对CentOS 8.0 64位腾讯云服务器 Docker安装**

   **安装脚本自动安装**

   安装命令如下：

   ```
   curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
   ```

   也可以使用国内 daocloud 一键安装命令：

   ```
   curl -sSL https://get.daocloud.io/docker | sh
   ```

   **手动安装**

   1.卸载旧版已安装docker如果有。

   较旧的 Docker 版本称为 docker 或 docker-engine 。如果已安装这些程序，请卸载它们以及相关的依赖项。

   ```javascript
   sudo yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-engine
   ```

   2.安装 Docker Engine-Community

   在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker。

   **设置仓库**

   安装所需的软件包。yum-utils 提供了 yum-config-manager ，并且 device mapper 存储驱动程序需要 device-mapper-persistent-data 和 lvm2。

   ```javascript
   sudo yum install -y yum-utils \
     device-mapper-persistent-data \
     lvm2
   ```

   使用以下命令来设置稳定的仓库。

   ## 使用官方源地址（比较慢）

   ```javascript
   sudo yum-config-manager \
       --add-repo \
       https://download.docker.com/linux/centos/docker-ce.repo
   ```

   可以选择国内的一些源地址：

   ## 阿里云

   ```javascript
   sudo yum-config-manager \
       --add-repo \
       http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ```

   ## 清华大学源

   ```javascript
   sudo yum-config-manager \
       --add-repo \
       https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/docker-ce.repo
   ```

   ## 安装 Docker Engine-Community

   安装最新版本的 Docker Engine-Community 和 containerd，或者转到下一步安装特定版本：

   ```
   sudo yum install docker-ce docker-ce-cli containerd.io
   ```

   如果提示您接受 GPG 密钥，请选是。

   > **有多个 Docker 仓库吗？**
   >
   > 如果启用了多个 Docker 仓库，则在未在 yum install 或 yum update 命令中指定版本的情况下，进行的安装或更新将始终安装最高版本，这可能不适合您的稳定性需求。

   Docker 安装完默认未启动。并且已经创建好 docker 用户组，但该用户组下没有用户。

   **要安装特定版本的 Docker Engine-Community，请在存储库中列出可用版本，然后选择并安装：**

   1、列出并排序您存储库中可用的版本。此示例按版本号（从高到低）对结果进行排序。

   ```javascript
   yum list docker-ce --showduplicates | sort -r
   docker-ce.x86_64  3:18.09.1-3.el7                     docker-ce-stable
   docker-ce.x86_64  3:18.09.0-3.el7                     docker-ce-stable
   docker-ce.x86_64  18.06.1.ce-3.el7                    docker-ce-stable
   docker-ce.x86_64  18.06.0.ce-3.el7                    docker-ce-stable
   ```

   2、通过其完整的软件包名称安装特定版本，该软件包名称是软件包名称（docker-ce）加上版本字符串（第二列），从第一个冒号（:）一直到第一个连字符，并用连字符（-）分隔。例如：docker-ce-18.09.1。

   ```
   sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
   ```

   启动 Docker。

   ```
   sudo systemctl start docker
   ```

   通过运行 hello-world 映像来验证是否正确安装了 Docker Engine-Community 。

   ```
   sudo docker run hello-world
   ```

   docker 拉取镜像时，可以设置镜像进行加速。

   ```javascript
   {
   "registry-mirrors": ["https://r9xxm8z8.mirror.aliyuncs.com","https://registry.docker-cn.com"],
   "insecure-registries": ["172.16.213.38:5000","172.16.213.39:5000"]
   }
   ```

   这样就可以同时使用公有和私有镜像仓库

   重启docker

   ```javascript
   systemctl restart docker.service #重启Docker 即可
   ```

   