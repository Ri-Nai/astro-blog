import { getCollection, type CollectionEntry } from 'astro:content';

export async function GET() {
  // 搜索索引覆盖全部未隐藏文章，两个分区（技术博客 / 个人随笔）都在内，
  // 随笔不会因为在 /blog 列表页被过滤掉而从搜索里消失。
  const posts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => {
    return !data.hidden;
  });

  const postsData = posts.map((post: CollectionEntry<'blog'>) => {
    // 确保 pubDate 是有效的 Date 对象
    let dateString = '';
    try {
      if (post.data.pubDate instanceof Date) {
        dateString = post.data.pubDate.toISOString();
      } else if (typeof post.data.pubDate === 'string') {
        dateString = new Date(post.data.pubDate).toISOString();
      } else {
        dateString = new Date().toISOString(); // 使用当前日期作为后备
      }
    } catch (error) {
      console.error(`日期转换错误: ${error}`);
      dateString = new Date().toISOString(); // 错误时使用当前日期
    }

    return {
      title: post.data.title,
      description: post.data.description,
      url: `/blog/${post.slug}`, // 使用 slug 而不是 id
      date: dateString,
      category: post.data.category,
      section: post.data.section, // blog = 技术博客，essay = 个人随笔
      tags: post.data.tags,
      author: post.data.author,
    };
  });

  return new Response(JSON.stringify(postsData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
