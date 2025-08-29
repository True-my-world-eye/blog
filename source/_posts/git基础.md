---
title: git基础使用指南
date: 2025-08-29
tags: [hexo] 
categories: [hexo]
author: True my world eye
---

Git 的基本用法可围绕**代码提交、分支管理、远程协作**三大核心场景展开，以下是最常用的命令和操作流程：


  ### 一、代码提交：本地仓库的基本操作  
  #### 1. 初始化与配置  
  - **初始化本地仓库**：在项目文件夹中创建 Git 仓库  
    ```bash
    git init
    ```
  - **配置用户信息**（全局或当前仓库）：  
    ```bash
    git config --global user.name "你的用户名"
    git config --global user.email "你的邮箱"
    # 仅当前仓库生效：去掉 --global
    ```


  #### 2. 提交代码到本地仓库  
  - **添加文件到暂存区**：  
    ```bash
    git add 文件名  # 单个文件，如 git add main.js
    git add .       # 添加当前文件夹所有文件
    ```
  - **提交到本地仓库**（附带提交说明）：  
    ```bash
    git commit -m "修复登录按钮 bug"
    ```


  ### 二、分支管理：多版本并行开发  
  #### 1. 分支操作  
  - **创建新分支**：  
    ```bash
    git branch 新分支名  # 如 git branch feature/login
    ```
  - **切换分支**：  
    ```bash
    git checkout 分支名  # 如 git checkout feature/login
    # 简写（创建并切换）：git checkout -b 新分支名
    ```
  - **查看所有分支**：  
    ```bash
    git branch -v
    ```


  #### 2. 合并分支  
  - **合并分支到当前分支**（如将 `feature/login` 合并到 `main`）：  
    ```bash
    git checkout main    # 先切换到目标分支
    git merge feature/login
    ```


  ### 三、远程协作：与 GitHub/GitLab 同步  
  #### 1. 关联远程仓库  
  - **添加远程仓库**（将本地仓库与 GitHub 仓库关联）：  
    ```bash
    git remote add origin https://github.com/你的用户名/仓库名.git
    ```
  - **查看已关联的远程仓库**：  
    ```bash
    git remote -v
    ```


  #### 2. 推送与拉取代码  
  - **推送本地分支到远程**：  
    ```bash
    git push -u origin main  # 首次推送，-u 绑定本地与远程分支
    git push                # 后续直接推送
    ```
  - **拉取远程代码到本地**：  
    ```bash
    git pull origin main  # 拉取远程 main 分支到本地
    ```


  #### 3. 克隆远程仓库到本地  
  - **从远程仓库下载完整项目**：  
    ```bash
    git clone https://github.com/你的用户名/仓库名.git
    ```


  ### 四、常用辅助命令  
  #### 1. 状态与日志  
  - **查看文件状态**（已修改/已暂存/未跟踪）：  
    ```bash
    git status
    ```
  - **查看提交历史**：  
    ```bash
    git log
    ```


  #### 2. 撤销操作  
  - **撤销工作区修改**（回到最近一次 `git add` 或 `git commit` 状态）：  
    ```bash
    git checkout -- 文件名  # 如 git checkout -- main.js
    ```
  - **撤销暂存区文件**（从暂存区移除，回到工作区）：  
    ```bash
    git reset 文件名
    ```


  ### 五、新手常见问题处理  
  #### 1. 提交后发现遗漏文件  
  ```bash
  git add 遗漏的文件
  git commit --amend  # 合并到最近一次提交（修改提交信息）
  ```

  #### 2. 分支合并冲突  
  - 合并时若提示冲突，需先**手动修改冲突文件**，再执行：  
    ```bash
    git add 冲突文件
    git commit -m "解决合并冲突"
    ```
