// 博客配置文件
export interface ProfileConfig {
  avatar: string;
  name: string;
  bio: string;
  author: string;
  socialLinks: {
    name: string;
    url: string;
    icon: string;
  }[];
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  lang: string;
  createAt: Date;
  postsPerPage: number;
}

export const siteConfig: SiteConfig = {
  title: '我的博客',
  subtitle: '基于Astro的现代博客主题',
  lang: 'zh-CN',
  createAt: new Date('2024-01-01'),
  postsPerPage: 10,
};

export const profileConfig: ProfileConfig = {
  avatar: '/imgs/avatar.jpg',
  name: 'Reina',
  bio: '如果努力的尽头是奇迹',
  author: 'Reina',
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
