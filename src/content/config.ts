import { defineCollection, z } from 'astro:content';
import { profileConfig } from '@site.config';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    // 站点分区：blog = 技术博客，essay = 个人随笔
    // 列表页据此分流（/blog 只显示 blog，/essays 只显示 essay），
    // 未显式声明时归入技术博客，避免历史文章凭空消失。
    section: z.enum(['blog', 'essay']).default('blog'),
    author: z.string().default(profileConfig.author),

    featured: z.boolean().default(false),
    // 支持从 Hugo 迁移过来的字段
    categories: z.array(z.string()).optional(),
    image: z.string().optional(),
    slug: z.string().optional(),
    hidden: z.boolean().default(false),
    math: z.boolean().default(false),
    license: z.string().optional(),
  }),
});

export const collections = { blog };
