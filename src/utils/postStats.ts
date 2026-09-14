import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 站点分区。
 * - blog：技术博客（技术分享类）
 * - essay：个人随笔（生活碎片 / 课余沉思）
 *
 * 列表页（/blog、/essays）复用同一套统计逻辑，只传不同的分区名，
 * 避免两个页面各自算一份标签/分类统计而互相串味。
 */
export const SECTIONS = ['blog', 'essay'] as const;
export type SectionName = (typeof SECTIONS)[number];

export type SectionPost = CollectionEntry<'blog'>;

export interface PostStats {
  allTags: string[];
  allCategories: string[];
  tagCounts: Record<string, number>;
  categoryStats: Array<{ name: string; count: number }>;
}

/**
 * 取出某个分区下所有可见（!hidden）文章，按发布时间倒序。
 * 注：本项目的 astro:content 类型目前是 Astro 的降级 stub（`src/env.d.ts`
 * 没有引用 `.astro/types.d.ts`），条目类型是 any，因此这里的标注方式
 * 与既有的 src/pages/blog/index.astro 保持一致。
 */
export async function getSectionPosts(section: SectionName): Promise<SectionPost[]> {
  const posts = await getCollection('blog');
  return (posts as any[])
    .filter((post: any) => !post.data.hidden && post.data.section === section)
    .sort((a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * 统计传入文章集合的标签与分类。
 * 统计范围严格等于传入的集合，所以每个分区页只会看到自己分区的标签/分类。
 */
export function getPostStats(posts: any[]): PostStats {
  const allTags = [
    ...new Set(posts.flatMap((post: any) => post.data.tags ?? [])),
  ].filter((tag): tag is string => typeof tag === 'string');

  const allCategories = [
    ...new Set(posts.map((post: any) => post.data.category).filter(Boolean)),
  ] as string[];

  const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = posts.filter((post: any) => post.data.tags.includes(tag)).length;
    return acc;
  }, {});

  const categoryStats = allCategories.map((category) => ({
    name: category,
    count: posts.filter((post: any) => post.data.category === category).length,
  }));

  return { allTags, allCategories, tagCounts, categoryStats };
}
