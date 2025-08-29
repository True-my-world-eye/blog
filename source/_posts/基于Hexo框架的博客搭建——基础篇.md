---
title: 基于Hexo框架的博客搭建——基础篇
date: 2025-08-12
tags: [hexo] 
categories: [hexo]
author: True my world eye
---

# 基于Hexo框架的博客搭建——基础篇



## 环境搭建

#### 1.安装Node.js

- 下载地址：https://nodejs.org/

- 安装时勾选「Add to PATH」，自动配置环境变量

**验证安装成功**

```bash
node -v  # 输出v20.x.x等版本号
npm -v   # 输出9.x.x等版本号，npm是Node.js的包管理工具
```

#### 2.安装Hexo命令行工具

**终端执行**

```bash
npm install -g hexo-cli  # 全局安装Hexo
hexo -v  # 验证安装，输出版本号即成功
```

## 本地初始化博客

#### 1.在本地新建博客文件夹并 cd进入

#### 2.初始化Hexo项目

```bash
hexo init  # 初始化项目（会下载基础代码，等待1-2分钟）
npm install  # 安装依赖包
```

#### 3.本地预览

```bash
hexo server  # 启动本地服务器（缩写：hexo s）
```

- 终端会显示 `Hexo is running at http://localhost:4000/`
- 打开浏览器访问该地址，就能看到默认的 Hexo 博客页面（自带一篇 "Hello World" 文章）
- 停止服务：终端按 `Ctrl+C`

### 三、基础配置与主题更换

#### 1. 修改站点基本信息

1. 找到 `_config.yml`（博客核心配置文件）

2. 修改以下内容（注意：每行冒号后必须有一个空格，否则会报错）：

```yaml
title: 你的博客名称  # 比如"XX的技术笔记"
subtitle: ""  # 副标题（可选）
description: 记录学习过程的个人博客  # 博客描述
author: 你的名字  # 作者名
language: zh-CN  # 中文显示
timezone: Asia/Shanghai  # 时区
```

3. 保存后，重启本地服务（`hexo s`），刷新浏览器就能看到修改效果

#### 2. 更换主题（以「Butterfly」为例，美观且适合新手）

官方主题库：https://hexo.io/themes/

1. 在终端中安装主题：

   ```bash
   npm install hexo-theme-butterfly --save
   ```

2. 告诉 Hexo 使用新主题：
   打开 `_config.yml`，找到 `theme:` 一行，修改为：

   ```yaml
   theme: butterfly  # 替换默认的theme: landscape
   ```

3. 配置主题基础信息：
   复制主题配置文件到根目录（方便修改）：

   ```bash
   cp node_modules/hexo-theme-butterfly/_config.yml _config.butterfly.yml
   ```

   打开 `_config.butterfly.yml`，可以修改：

   - `avatar:` 你的头像图片路径（建议先在`source`文件夹新建`images`文件夹，放入头像图片，路径填`/images/头像名.jpg`）
   - `navbar:` 导航菜单（比如添加「首页」「归档」「关于」）

4. 重启服务 `hexo s`，刷新浏览器，就能看到新主题效果了（比默认主题美观很多）



### 四、发布第一篇文章

#### 1. 创建新文章

在终端执行：

```bash
hexo new "我的第一篇博客"  # 新建文章，标题为"我的第一篇博客"
```

- 会在 `source/_posts` 文件夹下生成 `我的第一篇博客.md` 文件

#### 2. 编写文章内容

markdown基础语法

~~~markdown
# 一级标题（文章大标题）
## 二级标题（小节标题）

这是正文内容，可以加粗 **文字**，或者斜体 *文字*。

插入图片（图片放在source/images文件夹下）：
![图片描述](/images/图片名.jpg)

代码块（适合贴代码，自动高亮）：
```javascript
console.log("Hello Hexo!");
~~~

#### 3. 生成静态文件并预览

```bash
hexo clean  # 清除缓存（修改配置后建议执行）
hexo generate  # 生成静态文件（缩写：hexo g）
hexo server  # 再次启动服务，查看文章效果
```

### 五、部署到服务器

**目标**：让所有人通过你的域名访问博客。

#### 前提：服务器已准备好

- 已购买服务器，并通过 VS Code 的「Remote-SSH」连接成功

- 服务器已安装 Nginx（用于展示静态文件）：

  连接服务器后，在远程终端执行：

  ```bash
  sudo apt update && sudo apt install nginx  # Ubuntu系统
  sudo systemctl start nginx  # 启动Nginx
  ```

  此时访问你的服务器 IP，能看到 Nginx 默认页面，说明成功。

#### 部署方法：用 SFTP 插件手动上传（适合新手）

1. 在 VS Code 中安装「SFTP」插件

2. 在本地博客文件夹右键→「SFTP: Config」，生成`sftp.json`配置文件并修改为：

   ```json
   {
     "name": "我的服务器",
     "host": "你的服务器IP",
     "protocol": "sftp",
     "port": 22,
     "username": "服务器用户名（如root）",
     "password": "服务器密码",
     "remotePath": "/var/www/html",  # Nginx默认网站目录
     "uploadOnSave": true  # 保存文件时自动上传
   }
   ```

3. 生成待部署的静态文件：
   本地终端执行 `hexo g`，会在`public`文件夹下生成所有静态文件（HTML/CSS/JS 等）

4. 上传文件：
   在 VS Code 左侧文件栏，右键`public`文件夹→「SFTP: Upload Folder」，等待上传完成

5. 访问博客：
   打开浏览器输入你的域名，就能看到博客了！