# astro-blog 维护规范

默认用中文回复。本站部署在 GitHub Pages 子路径，**所有内部链接必须带 base**。

## Base Path（最高优先级）

- `astro.config.mjs`：`base: '/astro-blog'`，`trailingSlash: 'always'`
- 生产环境正确路径形如：`/astro-blog/blog/`、`/astro-blog/essays/`
- **禁止**在模板/组件里手写裸路径：`href="/blog"`、`href="/essays"`、`src="/imgs/..."`
- 必须走 `@theme/utils/pathUtils`：

| 用途 | 函数 |
|------|------|
| 页面/导航链接 | `getNavPath('/blog')` |
| 文章详情 | `getBlogPostPath(slug)` |
| 图片 / 静态资源 | `getAssetPath('/imgs/...')` |
| API / JSON | `getApiPath('/blog/index.json')` |

```astro
---
import { getNavPath, getAssetPath } from "@theme/utils/pathUtils";
---
<!-- ❌ BAD：生产环境会少掉中间的 /astro-blog -->
<a href="/blog">技术</a>
<img src="/imgs/avatar.jpg" />

<!-- ✅ GOOD -->
<a href={getNavPath("/blog")}>技术</a>
<img src={getAssetPath("/imgs/avatar.jpg")} />
```

`site.config.ts` 里的 `navItems.href` 可以写逻辑路径（如 `/blog`），由 Navigation 等组件统一 `getNavPath`；**页面里自己拼的 `<a href>` 必须显式调用**。

## 内容分区

- Collection：`blog`（`src/content/blog/`）
- Frontmatter `section`：`blog`（技术）或 `essay`（随笔）
- 列表页：`/blog` 只显示 `blog`；`/essays` 只显示 `essay`
- 首页「最新文章」可混排；分区入口卡片必须链到带 base 的列表页

## 目录与配置

- 站点配置：`src/site.config.ts`
- 主题：`themes/astro-theme-kago/`（别名 `@theme`）
- 页面：`src/pages/`
- 新建文章：`pnpm create-blog "标题"`

## 改动原则

- 新增任何内部链接或资源引用时，先确认是否经过 pathUtils
- 不要绕过 theme 组件去复制一套路径拼接逻辑
- 未明确要求时不要 commit / push
