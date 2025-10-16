#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取当前日期
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // 正确生成东八区时间
  const time = new Date(now.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace('Z', '+08:00');

  return { year, month, day, time };
}

// 生成 frontmatter 模板
function generateFrontmatter(title, dateInfo) {
  return `---
title: "${title}"
description: ""
pubDate: "${dateInfo.time}"
updatedDate: "${dateInfo.time}"
# heroImage: /imgs/blog/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/${title}/cover.jpg
math: false
hidden: true
# category:
# tags:
---

# ${title}

`;
}

// 主函数
async function createBlog(title) {
  if (!title) {
    console.error('❌ 请提供文章标题');
    console.log('用法: pnpm create-blog "文章标题"');
    process.exit(1);
  }

  const dateInfo = getCurrentDate();
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog', String(dateInfo.year), String(dateInfo.month), String(dateInfo.day), title);
  const ImagePath = path.join(__dirname, '..', 'public', 'imgs', 'blog', String(dateInfo.year), String(dateInfo.month), String(dateInfo.day), title);
  const indexPath = path.join(blogDir, 'index.mdx');

  try {
    // 检查目录是否已存在
    try {
      await fs.access(blogDir);
      console.log(`⚠️  目录已存在: ${blogDir}`);
      console.log('是否要覆盖现有文件? (y/N)');

      // 简单的输入处理
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('', resolve);
      });

      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ 操作已取消');
        process.exit(0);
      }
    } catch (error) {
      // 目录不存在，创建目录
      await fs.mkdir(blogDir, { recursive: true });
      console.log(`✅ 创建目录: ${blogDir}`);
    }

    try {
      await fs.access(ImagePath);
    } catch (error) {
      await fs.mkdir(ImagePath, { recursive: true });
      console.log(`✅ 创建图片目录: ${ImagePath}`);
    }
    // 生成并写入文件
    const frontmatter = generateFrontmatter(title, dateInfo);
    await fs.writeFile(indexPath, frontmatter, 'utf8');

    console.log(`✅ 创建博客文章: ${indexPath}`);
    console.log(`📝 标题: ${title}`);
    console.log(`📅 日期: ${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`);
    console.log(`📁 路径: ${blogDir}`);
    console.log('');
    console.log('💡 提示:');
    console.log('  - 编辑 index.mdx 文件来编写内容');
    console.log('  - 将图片放在同目录下，并更新 heroImage 路径');
    console.log('  - 设置 hidden: false 来发布文章');
    console.log('  - 根据需要调整 category 和 tags');

  } catch (error) {
    console.error('❌ 创建博客文章时出错:', error.message);
    process.exit(1);
  }
}

// 获取命令行参数
const args = process.argv.slice(2);
const title = args[0];

createBlog(title);
