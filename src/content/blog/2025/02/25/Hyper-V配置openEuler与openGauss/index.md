---
title: "Hyper V 配置 openEuler 与 openGauss"
description: Hyper-V配置openEuler与openGauss
pubDate: "2025-02-25T19:23:12+08:00"
updatedDate: "2025-02-25T19:23:12+08:00"
math: false
category: 技术分享
tags:
  - Hyper-V
  - openEuler
  - openGauss
  - 虚拟化
---

## 启用 Hyper-V

Hyper-V 是 Windows 自带的虚拟化软件，可以用来创建虚拟机。（主要是懒得装 VMware）

首先启用 Hyper-V 功能。

## 安装 openEuler

### 下载镜像

openGauss 官网上推荐使用 CentOS 7.6，但是 CentOS 7.6 早就不维护了。我一开始使用的时候出了很多问题（比如 yum 的镜像源设置），所以我决定向华为低头。

{{< linkpage  "https://www.openeuler.org/zh/download/#openEuler%2024.03%20LTS%20SP1" "openEuler 24.03 LTS SP1" "" "https://www.openeuler.org/favicon.ico" >}}

### 导入镜像

按镜像导入 Hyper-V，然后安装 openEuler。自己设置一下内存和硬盘大小。网络连接选 Default Switch，其他基本就默认。

如果你连接虚拟机发现一片黑，点开虚拟机的设置 > 安全，把启用安全启动关掉。

### 安装 openEuler

1. 连接以太网，不然话没法联网。
2. 设置 root 密码和创建用户，据说不建议直接用 root。
   笑点解析：如果用户未设置密码，没法通过 SSH 连接，所以要设置密码。
   笑点解析：上面这条也是可以在 `sshd_config` 里面设置的，但是我当时不知道。
3. 安装完成后，重启。

### SSH 连接

可以直接在 Hyper-V 下面的详细信息里面看到 IP 地址，然后用 SSH 连接。

```bash
ssh reina@<your-ip>
```

我这里没配置其他任何的东西了，可以直接 ssh 到虚拟机。

不过据说这样的话，虚拟机的 IP 地址会变，所以可以设置静态 IP。我还没试过。

### 配置网络

欧耶，回旋镖来咯，不配置的话我不知道为什么过两天虚拟机就没网了，呃呃。

在 Hyper-V 的虚拟机设置里面，点击虚拟交换机管理器，新建一个虚拟交换机，属性为 `外部`，然后在虚拟机的设置里面把网络连接改为这个虚拟交换机。

然后这样疑似就好了。

在 虚拟机里 运行 `ip` 命令，可以看到 IP 地址。之后 SSH 连接的时候就可以用这个 IP 地址了。

#### VSCode SSH 连接

由于这个 openEuler 实在是太垃圾了，连 VSCode 的时候都卡了我好久。

1. 安装 `tar`，笑点解析：openEuler 默认没有安装 `tar`，所以要安装。
    ```bash
    sudo yum install -y tar
    ```
2. 后面的忘记写了，好像过了这关问题不大了。
    如果还有问题的话可以先在虚拟机里改下设置：
    ```bash
    sudo vim /etc/ssh/sshd_config
    # 找到 如下内容 取消注释
    Port 22
    AddressFamily any
    ListenAddress 0.0.0.0
    ListenAddress ::
    # 找到 PasswordAuthentication，改为 yes 或取消注释
    PasswordAuthentication yes
    # 找到 PermitRootLogin，改为 yes 或取消注释
    PermitRootLogin yes
    # 重启 sshd
    sudo systemctl restart sshd
    ```

### 安装 zsh

因为我习惯用 zsh，所以安装了 zsh 和 oh-my-zsh，主要是为了好看。

参考文献：
{{< linkpage "https://blog.csdn.net/qimowei/article/details/119517167" "Centos7-Linux安装zsh和oh-my-zsh(内含国内安装方法)" "" "https://g.csdnimg.cn/static/logo/favicon32.ico">}}
{{< linkpage "https://zhuanlan.zhihu.com/p/265525597" "Oh My Zsh, 『 Powerlevel10k 安装 & 配置 』" "" "https://static.zhihu.com/heifetz/assets/apple-touch-icon-152.81060cab.png">}}

#### zsh
```bash
sudo yum install -y zsh # 安装 zsh
usermod -s /bin/zsh reina # 切换 shell
```

#### oh-my-zsh

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

#### 插件

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
```


修改 `.zshrc` 文件，添加插件
```bash
vim ~/.zshrc
plugins=(git zsh-syntax-highlighting zsh-autosuggestions zsh-completions)
```

#### 主题:Powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

修改 `.zshrc` 文件，添加主题

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```
重启终端，根据提示配置主题。

## 安装 openGauss
参考文档
{{< linkpage "https://docs.opengauss.org/zh/docs/6.0.0/docs/InstallationGuide/%E6%9E%81%E7%AE%80%E7%89%88%E5%AE%89%E8%A3%85.html" "极简版安装文档" "" "https://docs.opengauss.org/favicon.ico" >}}

### 软件环境

#### 安装了 python3

```bash
sudo yum install -y python3.11
alias python=python3
```

#### 提前建立软件目录

```bash
sudo mkdir -p /opt/software/openGauss
sudo chmod -R 777 /opt/software/openGauss # 不然会有权限问题，我也不知道到底在哪所以就直接 chmod 777 了
```
#### 关闭防火墙

```bash
# 禁用 selinux
vim /etc/selinux/config
SELINUX=disabled
# 重启
reboot
# 关闭防火墙
systemctl disable firewalld.service
systemctl stop firewalld.service
# 查看状态
systemctl status firewalld
```


### 安装 openGauss

下载 openGauss 安装包，我安装的是极简版
{{< linkpage "https://opengauss.org/zh/download/" "openGauss Download" "" "https://opengauss.org/favicon.ico" >}}

```bash
# 下载压缩包
curl -O https://opengauss.obs.cn-south-1.myhuaweicloud.com/6.0.1/openEuler22.03/x86/openGauss-Server-6.0.1-openEuler22.03-x86_64.tar.bz2
# 解压到 /opt/software/openGauss
tar -jxf openGauss-Server-6.0.1-openEuler22.03-x86_64.tar.bz2 -C /opt/software/openGauss

cd /opt/software/openGauss
# 必须要用 bash，因为他 install.sh 里有一堆 .bashrc 的操作
# "xxxx" 是你的密码
bash install.sh  -w "xxxx" -p 5432 &&source ~/.bashrc
```
至此，openGauss 安装完成。

不要看着我说起来风轻云淡，我似乎被折磨了两天。（虚拟机网络以及各种权限问题）。

### 检查是否安装成功

```bash
ps ux | grep gaussdb
gs_ctl query -D /opt/software/openGauss/data/single_node
```
理应来说第一个命令会有一个 `gaussdb` 的进程，第二个命令会显示数据库状态。

### 连接数据库

```bash
gsql -d postgres # -p 5432 默认以 5432 端口连接
                 # -U ri_nai 用 ri_nai 用户连接
```
`postgres` 是默认数据库，但是进去之后会显示 `opengauss=#`，哎无耻之人。
可以在 Windows 下安装一个 `psql`，然后用 `psql` 连接。

```bash
psql -h <your-ip> -p 5432 -U ri_nai -d postgres
```

## pgAdmin4 连接 openGauss
{{< linkpage "https://www.pgadmin.org/" "pgAdmin4" "" "https://www.pgadmin.org/static/COMPILED/assets/img/favicon.ico" >}}

pgAdmin4 是一个开源的数据库管理工具，用于管理 PostgreSQL 和其他数据库。有可视化界面，可以方便的管理数据库。

由于 openGauss 是基于 PostgreSQL 的，所以 pgAdmin4 可以连接 openGauss。

高版本的 pgAdmin4 无法兼容 openGauss，所以我随便找了个低版本的 [v4.30](https://pgadmin-archive.postgresql.org/pgadmin4/v4.30/windows/index.html)。

### 更改配置

在远程连接之前，需要更改 openGauss 的配置文件以便有权限连接。

```bash
vim /opt/software/openGauss/data/single_node/postgresql.conf

# 加入一条
listen_addresses = '*' # 允许所有地址连接
# 找到 password_encryption，改为 1
password_encryption_type = 1 # Password storage type, 0 is md5 for PG, 1 is sha256 + md5, 2 is sha256 only
```
解释：`listen_addresses` 允许所有地址连接，`password_encryption_type` 设置密码加密方式。
具体为什么要用 `sha256 + md5` 我忘了，前两天找博客和 AI 的时候看到的。
好像是因为 openGauss 想用 `sha256`，但是 pgAdmin4 只支持 `md5`，所以用了 `sha256 + md5`，不然会报错。

{{< linkpage "https://opengauss.org/zh/blogs/gaoyunlong/openGauss%E4%B8%8Epostgresql%E6%97%A5%E5%B8%B8%E4%BD%BF%E7%94%A8%E5%B7%AE%E5%BC%82.html" "可能的参考文献" "openGauss 与 postgresql 日常使用差异" "https://opengauss.org/favicon.ico" >}}

```bash
vim /opt/software/openGauss/data/single_node/pg_hba.conf

# 在文件末尾加入
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# "local" is for Unix domain socket connections only
host    all             all             <your-ip>/32            sha256
# 这里的 <your-ip> 是你的 IP 地址
# 可以在 PowerShell 里面输入 ipconfig 查看对应网卡的 IP 地址
```

然后重启数据库

```bash
gs_ctl restart -D /opt/software/openGauss/data/single_node -Z single_node
```

### 连接 pgAdmin4

打开 pgAdmin4，新建一个服务器
地址是 openGauss 的 IP 地址（在打开终端的时候可以看到）
用户名不能以超级管理员登录，得在 openGauss 里面创建一个用户。

```postgresql
CREATE USER ri_nai WITH PASSWORD 'xxxx';
```
然后在 pgAdmin4 里面用 `ri_nai` 登录。

数据表都在 `public` 的 `schema` 里面。

## DataGrip 连接 openGauss

由于自己有图形化界面连接 mysql 的需求，所以顺手试了一下 DataGrip。

DataGrip 是 JetBrains 出品的数据库管理工具，支持多种数据库，包括 PostgreSQL。

因为自己有 JetBrains 的学生账号，所以可以免费使用 DataGrip。JB门 🙏。

{{< linkpage "https://www.jetbrains.com/datagrip/" "DataGrip" "" "https://resources.jetbrains.com/storage/products/company/brand/logos/DataGrip_icon.png" >}}

然后因为上面的配置已经完成，所以直接连接就行了。
