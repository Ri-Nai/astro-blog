// 博客站点配置文件
import type { ProfileConfig, NavigationConfig, HomePageConfig, GiscusConfig } from '@theme/site.config.d';

export const profileConfig: ProfileConfig = {
  avatar: '/imgs/avatar.jpg',
  name: 'Ri-Nai',
  bio: '神明大人，为什么要教会我打开鸟笼的方法',
  author: 'Ri-Nai',
  favicon: '/favicon.png',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/Ri-Nai',
      icon: '/icons/github.svg',
    },
    {
      name: 'Email',
      url: 'mailto:Ri_Nai_@outlook.com',
      icon: '/icons/email.svg',
    },
    {
      name: 'Bilibili',
      url: 'https://space.bilibili.com/4151993',
      icon: '/icons/bilibili.svg',
    },
    {
      name: 'Steam',
      url: 'https://steamcommunity.com/id/Reina__/',
      icon: '/icons/steam.svg',
    },
  ],
};

export const navigationConfig: NavigationConfig = {
  brand: {
    icon: '✨',
    text: 'Ri-Nai',
  },
  navItems: [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/blog', label: '技术', icon: '📝' },
    { href: '/essays', label: '随笔', icon: '🍃' },
    { href: '/friends', label: '友链', icon: '🔗' },
    { href: '/about', label: '关于', icon: '👤' },
  ],
  search: {
    placeholder: '输入关键词搜索文章...',
    title: '🔍 搜索文章',
    noResultsText: '未找到相关文章',
    errorText: '搜索失败，请稍后重试',
    startText: '开始输入以搜索文章...',
  },
};

export const homePageConfig: HomePageConfig = {
  title: "首页 - Ri-Nai 的博客",
  description: "如果努力的尽头是奇迹",
  hero: {
    title: "欢迎来到 Ri-Nai 的博客",
    subtitle: profileConfig.bio,
    avatar: profileConfig.avatar
  },
};

export const giscusConfig: GiscusConfig = {
  repo: "Ri-Nai/astro-blog",
  repoId: "R_kgDOPv_k8w",
  category: "Announcements",
  categoryId: "DIC_kwDOPv_k884CvmvD",
  mapping: "url",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "zh-CN",
  enabled: true,
};
