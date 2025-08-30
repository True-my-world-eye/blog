# 基于Hexo框架的个人博客

这是一个基于Hexo框架开发的个人博客项目，以下是详细的目录结构说明和可修改的部分。

## 目录结构

```
myblog/
├── .github/                 # GitHub相关配置
│   └── dependabot.yml       # 依赖自动更新配置
├── .gitignore               # Git忽略规则
├── _config.butterfly.yml    # Butterfly主题配置文件
├── _config.yml              # Hexo主配置文件
├── package-lock.json        # npm依赖锁定文件
├── package.json             # 项目依赖和脚本配置
├── readme.md                # 项目说明文档（当前文件）
├── scaffolds/               # 文章模板目录
│   ├── draft.md             # 草稿模板
│   ├── page.md              # 页面模板
│   └── post.md              # 文章模板
├── source/                  # 博客内容和资源主目录
│   ├── _posts/              # 博客文章目录
│   │   ├── Linux学习.md
│   │   ├── git基础.md
│   │   ├── hello-world.md
│   │   ├── python_study.md
│   │   ├── 基于Hexo框架的博客搭建——基础篇.md
│   │   └── 基于Hexo框架的博客搭建——进阶篇.md
│   ├── archives/            # 归档页面
│   │   └── index.md
│   ├── categories/          # 分类页面
│   │   └── index.md
│   ├── css/                 # 自定义CSS样式
│   │   └── custom.css
│   ├── fonts/               # 自定义字体
│   │   └── MyFont.woff2
│   ├── guestbook/           # 留言板页面
│   │   └── index.md
│   ├── images/              # 图片资源目录
│   │   ├── avatar.jpg       # 头像
│   │   ├── background-dark.jpg  # 暗色背景
│   │   ├── background-light.jpg # 亮色背景
│   │   └── posts/           # 文章图片目录
│   └── tags/                # 标签页面
│       └── index.md
└── themes/                  # 主题目录
    └── .gitkeep
```

## 文件和目录详细说明

### 根目录文件

- **_config.yml**：Hexo站点的主配置文件
  - 包含博客的基本信息（标题、描述、作者等）
  - 设置URL结构、目录配置、文章格式等
  - 当前配置：博客标题为"Welcome to my world!"，语言为中文，时区为上海
  - **可修改**：可调整站点名称、描述、URL等基本设置

- **_config.butterfly.yml**：Butterfly主题的专属配置文件
  - 控制主题样式、导航菜单、代码块样式等
  - 当前配置：包含主页、归档、标签、分类、留言等导航菜单
  - **可修改**：可定制主题外观、功能和行为

- **package.json**：Node.js依赖和脚本配置
  - 管理Hexo及插件版本
  - 一般不需手动修改，除非添加/升级插件

- **.gitignore**：Git忽略规则
  - 防止上传缓存、依赖等无关文件

- **.github/dependabot.yml**：GitHub依赖自动更新配置
  - 与博客内容无关，用于自动管理依赖更新

### 内容目录

- **source/**：博客内容和资源的主目录
  - **_posts/**：存放所有博客文章（Markdown格式）
    - 文章格式：包含YAML前置信息（Front-matter）和Markdown内容
    - 示例：hello-world.md是默认的欢迎文章
    - **可修改**：可自由增删改文章，是博客最核心的内容部分
  
  - **archives/、categories/、tags/、guestbook/**：特殊页面目录
    - 存放归档、分类、标签、留言板等页面的入口文件
    - **可修改**：可编辑这些页面的内容和Front-matter元数据
  
  - **css/、fonts/、images/**：资源目录
    - 存放自定义样式、字体、图片等资源
    - **可修改**：可添加/替换自己的资源文件，个性化博客外观

- **scaffolds/**：模板目录
  - 包含post.md（文章）、page.md（页面）、draft.md（草稿）模板
  - 决定使用`hexo new`命令创建内容时的默认结构
  - 当前post模板包含title、date和tags字段
  - **可修改**：可自定义模板，添加常用的Front-matter字段

- **themes/**：主题目录
  - 存放主题源码（当前使用Butterfly主题）
  - 一般不直接修改，建议通过_config.butterfly.yml配置主题

### 生成目录（不在版本控制中）

- **public/**：Hexo生成的静态网站文件
  - 包含HTML、CSS、JS、图片等
  - 由`hexo generate`命令生成
  - **不建议修改**：每次生成会被覆盖

- **node_modules/**：npm依赖包目录
  - **不建议修改**：由npm自动管理

- **db.json**：Hexo生成的缓存数据库文件
  - **不建议修改**：由Hexo自动管理

## 可修改的部分

1. **内容修改**：
   - **_posts/**：添加、编辑或删除博客文章
   - **archives/、categories/、tags/、guestbook/**：编辑特殊页面
   - **images/、css/、fonts/**：添加或替换资源文件

2. **配置修改**：
   - **_config.yml**：修改站点基本配置
   - **_config.butterfly.yml**：自定义主题外观和功能

3. **模板修改**：
   - **scaffolds/**：自定义新文章/页面的默认模板

## 常用Hexo命令

```bash
# 创建新文章
hexo new "文章标题"

# 启动本地服务器预览
hexo server

# 生成静态文件
hexo generate (简写: hexo g)

# 部署网站
hexo deploy (简写: hexo d)

# 清除缓存
hexo clean
```

## 不建议修改的部分

- **public/**：每次生成会被覆盖
- **db.json**、**node_modules/**：由Hexo自动生成或管理
- themes：如需定制主题，建议通过主题配置文件而不是直接改源码。

---

如需详细说明某个文件或目录内容，可点开对应文件查看：

- _posts
- images
- [_config.yml](g:/myblog/_config.yml)
- [_config.butterfly.yml](g:/myblog/_config.butterfly.yml)
- scaffolds
- public

如需进一步定制，建议优先修改source和配置文件。



# 下面是备忘录



## 友链

### 1.创建了友链页面 ：

​	使用 hexo new page link 命令创建了友链页面，并在 source/link/index.md 文件中设置了正确的front-matter，包括 type: link 属性。

### 2.创建了友链数据文件 ：

​	在 source/_data/link.yml 中添加了友链数据，包含了示例友链分类和链接信息。您可以根据需要修改此文件来添加或删除友链。

### 3.在导航菜单中添加了友链入口 ：

​	在 _config.butterfly.yml 文件中的菜单配置部分添加了友链入口，使用了 fas fa-link 图标。

### 4.自定义了友链页面样式 ：

- 创建了 source/css/link.css 文件，添加了友链卡片、头像、名称等元素的样式

- 在 _config.butterfly.yml 的 inject 部分引入了自定义CSS文件

- 在 custom.css 中添加了深色模式下友链页面的透明度设置

### 5.如何添加新友链
要添加新的友链，只需编辑 source/_data/link.yml 文件，按照现有格式添加新的友链信息即可。例如：

```
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: 新朋友的博客
      link: https://example.com
      avatar: https://example.com/
      avatar.jpg
      descr: 这是一个很棒的博客
```

