---
title: 基于Hexo框架的博客搭建——进阶篇
date: 2025-08-12
tags: [hexo] 
categories: [hexo]
author: True my world eye
---

# 基于Hexo框架的博客搭建——进阶篇



## Hexo 架构逻辑：核心组件与工作流

Hexo 的架构可抽象为「输入→处理→输出」三层，核心组件通过事件驱动和钩子机制协同工作，整体流程如下：

#### 1. 核心组件

- **源文件系统（Source）**：存储博客的原始内容，包括：
  - 文章（`source/_posts/` 下的 Markdown 文件）
  - 页面（`source/` 下的独立 Markdown 或 HTML 文件）
  - 静态资源（图片、CSS、JS 等，存放于 `source/` 子目录）
  - 配置文件（根目录 `_config.yml`、主题配置 `_config.<theme>.yml`）
- **处理器（Processors）**：负责解析和转换源文件，核心包括：
  - **解析器（Parsers）**：解析 Front-matter（YAML 元数据）、Markdown 内容、配置文件（使用 `js-yaml` 库）。
  - **渲染器（Renderers）**：将 Markdown 转换为 HTML（默认用 `marked` 库），将模板文件（EJS/Pug 等）与数据结合生成最终页面（依赖 `hexo-renderer-ejs` 等插件）。
  - **过滤器（Filters）**：在处理过程中修改内容（如自动给图片添加标签、替换链接格式），基于「钩子函数」实现。
- **数据模型（Models）**：Hexo 内部维护的抽象数据结构，包括：
  - `Post`：文章对象（包含标题、日期、标签等属性）。
  - `Page`：页面对象（独立页面，如「关于页」）。
  - `Tag`/`Category`：标签和分类对象，用于构建归档页面。
- **生成器（Generators）**：根据数据模型和模板，生成静态 HTML 文件，核心逻辑是：
  1. 读取数据模型（如所有文章、标签列表）；
  2. 匹配主题中的模板文件（如 `index.ejs` 对应首页，`post.ejs` 对应文章详情页）；
  3. 将数据注入模板，生成 `public/` 目录下的静态 HTML。
- **部署器（Deployers）**：将 `public/` 目录下的静态文件部署到服务器、GitHub Pages 等平台（如 `hexo-deployer-git` 插件通过 Git 推送）。

#### 2. 工作流程图

```plaintext
源文件（Markdown/配置）  
    ↓（解析）  
Front-matter 元数据 + 内容文本  
    ↓（渲染）  
HTML 片段 + 数据模型（Post/Page 等）  
    ↓（生成）  
结合主题模板（EJS/Pug）→ 静态 HTML（public/）  
    ↓（部署）  
上传到服务器/托管平台  
```



## 底层实现：技术栈与核心机制

Hexo 基于 Node.js 开发，核心依赖以下技术和机制：

#### 1. 技术栈基础

- **运行时**：Node.js（利用其异步 I/O 特性高效处理文件读写）。
- **依赖管理**：`npm`（通过 `package.json` 管理插件和主题依赖）。
- **Markdown 解析**：默认用 `marked` 库，可通过插件替换为 `hexo-renderer-markdown-it` 等（支持更多语法）。
- **模板引擎**：默认支持 EJS，可通过插件扩展 Pug、Nunjucks 等（主题模板文件需对应引擎）。
- **YAML 解析**：用 `js-yaml` 库解析 Front-matter 和配置文件（严格要求 YAML 语法，如冒号后必须有空格）。

#### 2. 核心机制

- **事件驱动与钩子（Hooks）**：
  Hexo 内部通过 `hexo.extend` 注册钩子，允许插件在特定阶段介入处理流程。例如：
  - `before_generate`：生成静态文件前触发（可用于动态添加数据）。
  - `after_render:html`：HTML 渲染完成后触发（可用于压缩 HTML）。
- **插件系统**：
  所有功能（渲染器、生成器、部署器等）均通过插件实现，核心代码仅提供框架。例如：
  - 渲染 Markdown 需要 `hexo-renderer-marked` 插件；
  - 用 Git 部署需要 `hexo-deployer-git` 插件。
    插件通过 `hexo.extend` API 注册功能（如 `hexo.extend.renderer.register` 注册自定义渲染器）。
- **缓存机制**：
  生成静态文件时，Hexo 会将解析后的元数据缓存到 `db.json`，避免重复解析未修改的文件（`hexo clean` 会清空缓存）。



## 内容创作

#### 1. 新建文章 / 页面

```bash
# 新建文章（默认存到 source/_posts/ ）
hexo new <title>          # 如：hexo new "我的第一篇博客"  
hexo new [layout] <title> # layout 可选 post（默认）、page、draft  

# 高级用法：自定义路径（避免标题影响文件名）
hexo new page --path about/me "关于我"  # 生成 source/about/me.md  
```

#### 2. 发布草稿

草稿存于 `source/_drafts/`，发布时移到 `_posts`：

```bash
hexo publish [layout] <filename>  # 如：hexo publish draft "草稿名"  
```

#### 3.识别文章

对于直接放入posts的md文件，需要添加`Front-matter`元数据：

- Front-matter 是 Hexo 识别文章的「身份证」，必须放在 Markdown 文件的 **最开头**，用 `---` 包裹，格式为 YAML 语法。

**最少需要包含 2 个字段**：`title`（文章标题）和 `date`（发布日期），示例：

```markdown
---
title: 这是我的文章标题
date: 2025-08-12 15:30:00  # 格式：年-月-日 时:分:秒
---

这里是文章正文（Markdown 格式）...
```

**可选补充字段（让文章更规范）**

除了必填的 `title` 和 `date`，还可以添加以下常用字段（按需选择）：

```markdown
---
title: 这是我的文章标题
date: 2025-08-12 15:30:00
categories: 技术笔记  # 文章分类（可多层，如：前端/JavaScript）
tags: [Hexo, 博客]    # 文章标签（数组格式）
author: 你的名字      # 作者（如果主题支持显示）
description: 这是文章的简短描述  # 用于SEO或主题摘要显示
---

正文内容...
```

## 生成与预览

#### 1. 生成静态文件

```bash
hexo generate  # 简写 hexo g，生成 public/ 目录（静态网页）  
# 可选参数：  
# --watch 监听文件变化，自动重新生成  
# --force 强制全量生成（忽略缓存，类似 hexo clean + hexo g）  
# --deploy 生成后立即部署  
```

#### 2. 本地预览

```bash
hexo server  # 简写 hexo s，启动本地服务器（默认 http://localhost:4000 ） 
# 可选参数：  
# --port 3000  # 修改端口（如避免4000冲突）  
```

#### 为什么要生成静态文件

`Hexo` 这类工具的设计目标是 **“预先生成静态文件”**，核心逻辑是：
在本地通过` Markdown `等源文件、模板引擎（如 EJS、Pug）和配置，预先渲染出所有页面的静态 `HTML`，然后将这些静态文件部署到服务器。

这种方式的优势是：

- **性能极快**：静态文件直接由服务器 / CDN 返回，无需数据库查询或后端计算，加载速度远快于动态生成。
- **服务器成本低**：静态文件可部署到轻量服务器、对象存储（如 S3、OSS）甚至纯 CDN，无需复杂的后端环境（如数据库Python/PHP运行时）。
- **安全性高**：没有后端代码和数据库，减少了`SQL`注入、脚本漏洞等风险。

#### 什么情况下不需要生成静态文件？

如果你的网站需要 **实时动态交互**（如用户登录、评论互动、数据实时更新等），可能需要动态处理，此时无需预生成静态文件，常见场景：

- 用 WordPress、Django、Flask 等动态框架开发的网站，直接部署后端代码和数据库，服务器实时处理请求。
- 带用户系统、支付功能、实时数据展示的网站（如电商、社交平台），需要后端逻辑动态生成内容。

## 服务器端(基于vscode)

### 一、环境准备

1. 执行以下命令安装Nginx

```bash
# 更新系统包
sudo yum update -y

# 安装Nginx
sudo yum install nginx -y

# 启动Nginx服务
sudo systemctl start nginx

# 设置Nginx开机自启
sudo systemctl enable nginx
```

2. 确认 Nginx 是否正常运行：

```bash
sudo systemctl status nginx
```

### 二、配置Nginx

1. 创建网站根目录：

   ```bash
   sudo mkdir -p /var/www/hexo-blog
   sudo chmod -R 755 /var/www/hexo-blog
   ```

2. 配置 Nginx 站点：

   ```bash
   sudo vim /etc/nginx/conf.d/hexo-blog.conf
   ```

3. 在打开的文件中输入以下内容（按`i`进入编辑模式）：

   ```nginx
   server {
       listen 80;
       server_name 你的域名;  # 例如：example.com
       				#域名在备案时可填公网IP
       
       root /var/www/hexo-blog;
       index index.html index.htm;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

   按`ESC`，输入`:wq`保存退出

4. 检查 Nginx 配置是否正确：

   ```bash
   sudo nginx -t
   ```

5. 重启 Nginx 使配置生效：

   ```bash
   sudo systemctl restart nginx
   ```

## 三、部署博客文件到服务器

将本地生成的静态文件上传到服务器：

1. 方法一：使用 VSCode 的文件传输功能

   - 在 VSCode 左侧资源管理器中找到本地 Hexo 项目的`public`文件夹
   - 右键点击该文件夹，选择 "上传到远程"
   - 上传到服务器的`/var/www/hexo-blog`目录下

2. 方法二：使用命令行 scp 工具（在本地终端执行）

   ```bash
   scp -r /本地Hexo路径/public/* 用户名@服务器IP:/var/www/hexo-blog/
   ```

   