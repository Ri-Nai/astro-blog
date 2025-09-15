# Astro 博客主题

基于 BIT-SE 样式的现代化 Astro 博客主题，具有优雅的设计和丰富的功能。

## ✨ 特性

- 🎨 **现代设计** - 基于 BIT-SE 项目的优雅样式
- 📱 **响应式布局** - 完美适配各种设备
- 🌙 **暗色模式** - 自动切换和手动控制
- 🏷️ **标签筛选** - 强大的文章筛选功能
- 📝 **Markdown 支持** - 完整的 Markdown 语法支持
- 🔍 **搜索功能** - 快速查找文章内容
- 📊 **目录导航** - 自动生成文章目录
- ⚡ **极速性能** - Astro 的静态生成优势
- 🎯 **SEO 友好** - 完整的 meta 标签和结构化数据

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd astro-blog

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:4321 查看博客。

### 构建和部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📁 项目结构

```
astro-blog/
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   └── favicon.svg        # 网站图标
├── src/
│   ├── components/        # 可复用组件
│   │   ├── Navigation.astro
│   │   └── BlogHome.astro
│   ├── layouts/           # 页面布局
│   │   └── BaseLayout.astro
│   ├── pages/             # 页面文件
│   │   ├── index.astro    # 首页
│   │   ├── about.astro    # 关于页面
│   │   └── blog/          # 博客相关页面
│   ├── content/           # 内容集合
│   │   ├── config.ts      # 内容配置
│   │   └── blog/          # 博客文章
│   └── styles/            # 样式文件
│       └── global.css     # 全局样式
├── astro.config.mjs       # Astro 配置
└── package.json
```

## ✍️ 写作指南

### 创建新文章

在 `src/content/blog/` 目录下创建新的 `.md` 文件：

```markdown
---
title: '文章标题'
description: '文章描述'
pubDate: 2024-01-01
heroImage: '/images/hero.jpg'
tags: ['标签1', '标签2']
category: '分类'
author: '作者'
readingTime: 5
featured: true
---

# 文章内容

这里是文章的正文内容...
```

### 前置数据字段

- `title` - 文章标题（必需）
- `description` - 文章描述（可选）
- `pubDate` - 发布日期（必需）
- `updatedDate` - 更新日期（可选）
- `heroImage` - 封面图片（可选）
- `tags` - 标签数组（可选）
- `category` - 分类（可选）
- `author` - 作者（默认：'作者'）
- `readingTime` - 阅读时间（分钟）
- `featured` - 是否为精选文章（默认：false）

## 🎨 自定义样式

### 颜色主题

在 `src/styles/global.css` 中修改 CSS 变量：

```css
:root {
  /* 品牌颜色 */
  --brand-primary: #f06292;
  --brand-light: #ff94c2;
  --brand-dark: #ba2d65;
  
  /* 文本颜色 */
  --text-primary: rgba(60, 60, 67);
  --text-secondary: rgba(60, 60, 67, 0.78);
  
  /* 背景颜色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
}
```

### 暗色模式

暗色模式会根据系统偏好自动切换，也可以手动控制。样式定义在 `@media (prefers-color-scheme: dark)` 中。

## 📦 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify 部署

1. 将代码推送到 GitHub
2. 在 Netlify 中连接仓库
3. 设置构建命令：`pnpm build`
4. 设置发布目录：`dist`

### 其他平台

Astro 支持多种部署平台，详见 [Astro 部署文档](https://docs.astro.build/en/guides/deploy/)。

## 🛠️ 技术栈

- **[Astro](https://astro.build/)** - 静态站点生成器
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[MDX](https://mdxjs.com/)** - Markdown + JSX

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题或建议，请通过以下方式联系：

- Email: your-email@example.com
- GitHub: [your-github](https://github.com/your-github)

---

感谢使用这个 Astro 博客主题！希望它能帮助你创建一个优雅的博客。
