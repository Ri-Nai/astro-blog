---
title: "GitHub Actions 小记"
description: GitHub Actions自动部署 Hugo 博客、Vue 网页以及 Typst 文档
pubDate: "2025-02-11T20:05:06+08:00"
updatedDate: "2025-02-11T20:05:06+08:00"
math: false
category: 技术分享
tags:
  - GitHub Actions
  - CI/CD
  - 自动化部署
---

## GitHub Actions 介绍

简单的来说，就是 GitHub 给你提供的一个 CI/CD 服务，可以在你的代码仓库中运行一些自动化的任务，比如测试、构建、部署等等。

你只需要在代码仓库中创建一个 `.github/workflows` 目录，然后在这个目录中创建一个 `.yaml` 文件，就可以配置一个 GitHub Actions 任务了。

比如你的仓库目录结构是这样的：

```batch
├── .github
│   └── workflows
│       └── hugo-deploy.yaml
│
├── content
│   └── post
...
│
├── .gitignore
│
└── hugo.yaml

```

你在 `push` 或者 `pull request` 的时候，GitHub 就会自动运行 `.github/workflows/hugo-deploy.yaml` 中的任务。

一般你问 AI 的话大概都能做出来比较好的结果。

### GitHub Actions 部署 GitHub Pages

GitHub Pages 是 GitHub 提供的一个静态网页托管服务，你可以把 `html`、`css`、`js`、`image` 等静态资源放到仓库中，然后通过 `https://<user-name>.github.io/<repo-name>` 访问你的网页。

你可以在`https://github.com/<user-name>/<repo-name>/settings/pages`中设置你的 GitHub Pages。

可以选择：
1. 通过 `GitHub Actions` 部署，通过一系列自动化任务，将网站静态资源部署到 `github.io`。
2. 通过 `branch` 部署，通常不选择 `main` 分支，因为会污染源码。可以选择将网站静态资源部署到 `gh-pages` 分支。

- 若仓库名为 `<user-name>.github.io`，则会部署到 `https://<user-name>.github.io`。
- 否则会 `https://<user-name>.github.io/<repo-name>`。

暂时没研究出怎么样让非 `<user-name>.github.io` 的仓库部署到 `https://<user-name>.github.io`。
## Hugo 博客自动部署

抄自 [Hugo Docs](https://gohugo.io/hosting-and-deployment/hosting-on-github/)，我们可以在 GitHub Actions 中配置一个自动部署 Hugo 博客的任务。

仓库结构详见 [Hugo-Blog](https://github.com/Ri-Nai/Hugo-Blog)。

当你每次 `push` 你的 Hugo 博客源码时，GitHub Actions 就会自动构建你的 Hugo 博客，并将构建好的静态资源部署到 GitHub Pages。<br>
构建实例在 [GitHub Actions](https://github.com/Ri-Nai/Hugo-Blog/actions)。<br>
网站实例在 [GitHub Pages](https://ri-nai.github.io/Hugo-Blog/)。

下附配置文件 `hugo-deploy.yaml`：

```yaml
# Hugo 网站自动化部署到 GitHub Pages 的工作流配置
name: Deploy Hugo site to Pages

on:
  # 当推送到默认分支（main）时触发
  push:
    branches:
      - main

  # 允许从 GitHub Actions 页面手动触发
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read  # 仓库内容的读取权限
  pages: write    # GitHub Pages 的写入权限
  id-token: write # token 的写入权限

# 并发控制
# 同一时间只允许一个部署任务运行
# 如果有新的部署请求，会排队等待当前任务完成
# 不会取消正在进行的部署，确保生产环境部署的完整性
concurrency:
  group: "pages"
  cancel-in-progress: false

# 设置默认 shell 为 bash
defaults:
  run:
    shell: bash

jobs:
  # 构建任务
  build:
    runs-on: ubuntu-latest  # 在最新版本的 Ubuntu 运行
    env:
      HUGO_VERSION: 0.141.0 # Hugo 版本号
    steps:
      - name: 安装 Hugo CLI  # 安装 Hugo 命令行工具
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb

      - name: 安装 Dart Sass  # 安装 Sass 预处理器
        run: sudo snap install dart-sass

      - name: 检出代码  # 检出仓库代码
        uses: actions/checkout@v4
        with:
          submodules: recursive  # 递归检出子模块（主题等）
          fetch-depth: 0        # 完整克隆，包含所有历史记录

      - name: 配置 Pages  # 设置 GitHub Pages 环境
        id: pages
        uses: actions/configure-pages@v5

      - name: 安装 Node.js 依赖  # 如果项目有 Node.js 依赖则安装
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"

      - name: 构建 Hugo 网站  # 使用 Hugo 构建静态网站
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache  # 设置 Hugo 缓存目录
          HUGO_ENVIRONMENT: production                  # 设置为生产环境
          TZ: America/Los_Angeles                      # 设置时区
        run: |
          hugo \
            --gc \            # 运行垃圾回收
            --minify \       # 压缩输出文件
            --baseURL "${{ steps.pages.outputs.base_url }}/"  # 设置网站基础 URL

      - name: 上传构建产物  # 上传构建后的文件
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public     # 指定构建输出目录

  # 部署任务
  deploy:
    environment:
      name: github-pages    # 部署环境名称
      url: ${{ steps.deployment.outputs.page_url }}  # 部署后的 URL
    runs-on: ubuntu-latest
    needs: build           # 依赖 build 任务完成
    steps:
      - name: 部署到 GitHub Pages  # 将网站部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Vue 网页自动部署
使用 `Vue3` + `Vite` 写了一个 [个人主页](https://ri-nai.github.io/)，源码在 [Ri-Nai.github.io](https://github.com/Ri-Nai/Ri-Nai.github.io)。

由于包管理器是 `pnpm`，所以需要安装 `pnpm`，并且在 `build` 时使用 `pnpm`。

下附配置文件 `vue-deploy.yaml`，涉及到操作的部分还算简单。

```yaml
name: Deploy Vue Site to GitHub Pages

on:
  push:
    branches: ["main"]   # 当 main 分支有更新时触发
  workflow_dispatch:     # 允许手动触发部署

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 1. 检出代码
      - name: Checkout Repository
        uses: actions/checkout@v3

      # 2. 设置 Node.js 环境，并启用 pnpm 缓存
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.13.1'

      # 3. 安装 pnpm
      - name: Install pnpm
        run: npm install -g pnpm

      # 4. 使用 pnpm 安装依赖
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      # 5. 构建项目（假设构建产物生成在 dist 目录下）
      - name: Build Project
        run: pnpm run build

      # 6. 上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      # 7. 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## Typst 文档自动部署

来自 [issue #2](https://github.com/Ri-Nai/BIT-Typst-Template/issues/2) 的提议。

仓库详见 [BIT-Typst-Template](https://github.com/Ri-Nai/BIT-Typst-Template)。

工作就是编译 `Typst` 文档到 GitHub Actions。

下附配置文件 `typst-deploy.yaml`：

```yaml
name: Build PDFs
on:
  push:
    branches: [ main ]  # 仅监听 main 分支推送

permissions:
  contents: read  # 只需读取权限

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        template:
          - path: "slides-template/main.typ"
            output: "slides.pdf"
          - path: "slides-template/samples/sample.typ"
            output: "slides-sample.pdf"
          - path: "undergraduate-thesis-template/main.typ"
            output: "thesis.pdf"
          - path: "undergraduate-thesis-template/samples/sample.typ"
            output: "thesis-sample.pdf"
    steps:
      # 步骤 1: 检出代码
      - name: Checkout repository
        uses: actions/checkout@v4

      # 步骤 2: 下载字体
      - name: Download fonts
        run: |
          mkdir -p fonts
          curl -L -o fonts.tgz https://github.com/Ri-Nai/BIT-Typst-Template/releases/download/assets/fonts.tgz
          tar -xzf fonts.tgz -C fonts/
          echo "✅ 字体下载完成"

      # 步骤 3: 安装 Typst
      - name: Setup Typst
        # You may pin to the exact commit or the version.
        # uses: typst-community/setup-typst@bf23b5bbaead4a583e631c2823ce2b3569fa7d17
        uses: typst-community/setup-typst@v2.0.1
        with:
          # The token used to authenticate when fetching Typst distributions. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting.
          version: v0.12.0


      # 步骤 4: 编译文档
      - name: Compile document
        run: |
          typst compile --font-path ./fonts --root ./ ${{ matrix.template.path }} ${{ matrix.template.output }}

      # 步骤 5: 上传产物到 Artifacts
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.template.output }}
          path: ${{ matrix.template.output }}
```
