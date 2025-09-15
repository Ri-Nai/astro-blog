// 博客配置文件
export interface ProfileConfig {
  avatar: string;
  name: string;
  bio: string;
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
  name: '作者',
  bio: '热爱技术，分享生活',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/example',
      icon: '🐙',
    },
    {
      name: 'Email',
      url: 'mailto:example@example.com',
      icon: '📧',
    },
  ],
};
