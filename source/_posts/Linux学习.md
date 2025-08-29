---
title: Linux与阿里云服务器
date: 2025-08-13
tags:
author: True my world eye
---

# 基础操作

### 一、目录与文件导航

1. **`pwd`**
   - 功能：显示当前所在目录的绝对路径
   - 示例：`pwd` → 输出 `/home/user/Documents`
2. **`cd [目录路径]`**
   - 功能：切换目录
   - 常用示例：
     - `cd /usr/local` → 切换到 `/usr/local` 目录
     - `cd ~` 或 `cd` → 切换到当前用户的家目录
     - `cd ..` → 切换到上一级目录
     - `cd -` → 切换到上一次所在的目录
3. **`ls [选项] [目录]`**
   - 功能：列出目录中的文件 / 子目录
   - 常用选项：
     - `ls` → 简单列出当前目录内容
     - `ls -l`（缩写 `ll`）→ 显示详细信息（权限、大小、修改时间等）
     - `ls -a` → 显示所有文件（包括隐藏文件，以 `.` 开头）
     - `ls -lh` → 以人类可读的单位（K、M）显示文件大小

### 二、文件与目录操作

1. **创建**

   - `touch 文件名` → 创建空文件（若文件已存在，更新修改时间）
     示例：`touch note.txt`

   - `mkdir 目录名`→ 创建目录

     示例：`mkdir pics`

     - 选项 `-p`：创建多级目录，如 `mkdir -p docs/reports`

2. **复制**

   - `cp` 源路径 目标路径→ 复制文件 / 目录

     示例：

     - 复制文件：`cp note.txt backup/`（复制到 backup 目录）
     - 复制目录（需加 `-r` 递归）：`cp -r pics images/`

3. **移动 / 重命名**

   - `mv` 源路径 目标路径→ 移动文件 / 目录，或重命名

     示例：

     - 移动：`mv note.txt docs/`
     - 重命名：`mv old.txt new.txt`

4. **删除**

   - `rm 文件名` → 删除文件
     示例：`rm temp.txt`
   - `rm -r 目录名` → 删除目录（递归删除内部内容）
     示例：`rm -r old_dir`
   - 注意：`rm -rf 路径` 会强制删除（`-f` 强制），**谨慎使用**，删除后无法恢复！

### 三、文件内容查看

1. **`cat 文件名`** → 一次性显示文件全部内容（适合短文件）
   示例：`cat README.md`
2. **`more 文件名` / `less 文件名`** → 分页查看长文件（`more` 只能向下翻页，`less` 支持上下滚动和搜索）
   示例：`less long_log.txt`（按 `q` 退出）
3. **`head 文件名` / `tail 文件名`** → 查看文件开头 / 结尾内容
   - 示例：
     - `head -n 5 data.csv` → 显示前 5 行
     - `tail -f log.txt` → 实时跟踪文件新增内容（常用于日志监控，按 `Ctrl+C` 退出）

### 四、系统信息与管理

1. **`uname -a`** → 显示系统内核版本、主机名等信息
2. **`df -h`** → 查看磁盘空间使用情况（`-h` 人类可读单位）
3. **`free -h`** → 查看内存和交换分区使用情况
4. **`top` / `htop`** → 实时显示进程占用资源情况（`top` 是系统自带，`htop` 更直观需单独安装；按 `q` 退出）
5. **`whoami`** → 显示当前登录的用户名

### 五、权限管理

Linux 中文件 / 目录权限分为读（`r`/4）、写（`w`/2）、执行（`x`/1），分别对应所有者、所属组、其他用户三类。

- `chmod 权限 文件名`→ 修改权限

  示例：

  - `chmod 755 script.sh` → 所有者可读可写可执行（7=4+2+1），组和其他用户可读可执行（5=4+1）
  - `chmod u+x file` → 仅给所有者增加执行权限（`u`= 所有者，`g`= 组，`o`= 其他，`a`= 全部）

### 六、网络相关

1. **`ping 域名/IP`** → 测试网络连通性
   示例：`ping baidu.com`（按 `Ctrl+C` 停止）
2. **`ifconfig` 或 `ip addr`** → 查看网卡信息（IP 地址、MAC 等）
3. **`netstat -tuln`** → 查看系统监听的端口（`-t` tcp，`-u` udp，`-l` 监听中，`-n` 显示 IP 而非域名）

# 基于Alibaba Cloud Linux

### 一.**配置用户的 SSH 密钥登录**

1. **本地复制公钥内容**：

   - 打开 `C:\Users\你的用户名\.ssh\id_rsa.pub`（记事本打开，全选复制内容）。

2. **服务器端：上传公钥到新用户目录**：

   ```bash
   # 切换到新用户
   su - newuser  
   # 创建 .ssh 目录（若不存在）
   mkdir -p ~/.ssh  
   chmod 700 ~/.ssh  # 限制权限，仅当前用户可访问
   # 将本地公钥粘贴到 authorized_keys
   echo "粘贴本地 id_rsa.pub 的内容" >> ~/.ssh/authorized_keys  
   chmod 600 ~/.ssh/authorized_keys  # 限制权限，仅当前用户可读写
   ```

#### **（可选）禁用 root 的 SSH 登录（增强安全）**

1. 编辑 SSH 配置文件：

   ```bash
   sudo nano /etc/ssh/sshd_config  
   ```

2. 修改以下行：

   ```ini
   PermitRootLogin no  # 禁止 root 直接 SSH 登录
   PasswordAuthentication no  # 可选：禁止密码登录，仅允许密钥（更安全）
   ```

3. 重启 SSH 服务：

   ```bash
   sudo systemctl restart sshd  
   ```