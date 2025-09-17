#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取当前日期，生成符合ISO8601格式的时间戳（东八区）
function getCurrentTimestamp() {
  const now = new Date();
  // 生成东八区时间
  const time = new Date(now.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace('Z', '+08:00');
  return time;
}

// 执行git命令并返回结果
function executeGitCommand(command) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'), // 在项目根目录执行
      env: { ...process.env, LC_ALL: 'C' } // 避免Git输出使用转义字符
    }).trim();
  } catch (error) {
    console.error(`❌ Git命令执行失败: ${command}`);
    console.error(`错误信息: ${error.message}`);
    return null;
  }
}

// 检查是否在git仓库中
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'ignore' 
    });
    return true;
  } catch {
    return false;
  }
}

// 获取所有修改的MDX文件
function getModifiedMdxFiles() {
  if (!isGitRepository()) {
    console.error('❌ 当前目录不是Git仓库');
    return [];
  }

  // 使用 -z 选项获取空字符分隔的输出，避免引号和转义问题
  const modifiedFiles = executeGitCommand('git status --porcelain -z');
  if (!modifiedFiles) {
    return [];
  }

  // 解析git status输出，筛选出MDX文件
  const mdxFiles = [];
  // 使用空字符分割，然后过滤空行
  const lines = modifiedFiles.split('\0').filter(line => line.trim());
  
  for (const line of lines) {
    // Git status格式：状态码 + 空格 + 文件路径
    const status = line.substring(0, 2);
    const filePath = line.substring(3);
    
    // 只处理修改的文件（M），不处理新增（A）、删除（D）等
    if (status.includes('M') && (filePath.endsWith('.mdx') || filePath.endsWith('.md'))) {
      const fullPath = path.join(__dirname, '..', filePath);
      console.log(`📝 发现修改的MDX文件: ${filePath}`);
      mdxFiles.push({
        relativePath: filePath,
        fullPath: fullPath,
        status: status
      });
    }
  }


  return mdxFiles;
}

// 解析frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', body: content, hasFrontmatter: false };
  }

  return {
    frontmatter: match[1],
    body: match[2],
    hasFrontmatter: true
  };
}

// 更新frontmatter中的updatedDate字段
function updateFrontmatterDate(frontmatter, newTimestamp) {
  // 匹配updatedDate字段的正则表达式
  const updatedDateRegex = /^(\s*updatedDate:\s*)(.*?)(\s*)$/m;
  
  if (updatedDateRegex.test(frontmatter)) {
    // 如果存在updatedDate字段，则更新它
    return frontmatter.replace(updatedDateRegex, `$1"${newTimestamp}"$3`);
  } else {
    // 如果不存在updatedDate字段，在pubDate后面添加它
    const pubDateRegex = /^(\s*pubDate:\s*.*?)(\s*)$/m;
    if (pubDateRegex.test(frontmatter)) {
      return frontmatter.replace(pubDateRegex, `$1$2\nupdatedDate: "${newTimestamp}"`);
    } else {
      // 如果连pubDate都没有，添加到frontmatter开头
      return `updatedDate: "${newTimestamp}"\n${frontmatter}`;
    }
  }
}

// 更新单个MDX文件的updatedDate
async function updateMdxFile(filePath) {
  try {
    console.log(`🔄 正在处理: ${filePath}`);
    
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf8');
    
    // 解析frontmatter
    const { frontmatter, body, hasFrontmatter } = parseFrontmatter(content);
    
    if (!hasFrontmatter) {
      console.log(`⚠️  ${filePath} 没有frontmatter，跳过`);
      return false;
    }

    // 获取当前时间戳
    const timestamp = getCurrentTimestamp();
    
    // 更新frontmatter
    const updatedFrontmatter = updateFrontmatterDate(frontmatter, timestamp);
    
    // 重构文件内容
    const newContent = `---\n${updatedFrontmatter}\n---\n${body}`;
    
    // 写回文件
    await fs.writeFile(filePath, newContent, 'utf8');
    
    console.log(`✅ 已更新 ${filePath} 的updatedDate为: ${timestamp}`);
    return true;
    
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错:`, error.message);
    return false;
  }
}

// 主函数
async function updateModifiedMdxFiles() {
  console.log('🔍 检查Git环境中修改的MDX文件...\n');
  
  // 获取所有修改的MDX文件
  const modifiedFiles = getModifiedMdxFiles();
  
  if (modifiedFiles.length === 0) {
    console.log('✨ 没有找到修改的MDX文件');
    return;
  }

  console.log(`📋 找到 ${modifiedFiles.length} 个修改的MDX文件:`);
  modifiedFiles.forEach(file => {
    console.log(`   ${file.status} ${file.relativePath}`);
  });
  console.log('');

  // 逐个更新文件
  let successCount = 0;
  for (const file of modifiedFiles) {
    const success = await updateMdxFile(file.fullPath);
    if (success) {
      successCount++;
    }
  }

  console.log(`\n🎉 处理完成！成功更新了 ${successCount}/${modifiedFiles.length} 个文件`);
  
  if (successCount > 0) {
    console.log('\n💡 提示: 文件已更新，你可能需要再次提交这些更改');
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  updateModifiedMdxFiles().catch(error => {
    console.error('❌ 脚本执行出错:', error.message);
    process.exit(1);
  });
}

export { updateModifiedMdxFiles, getModifiedMdxFiles, updateMdxFile };