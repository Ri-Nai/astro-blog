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



export const profileConfig: ProfileConfig = {
  avatar: '/imgs/avatar.jpg',
  name: 'Ri-Nai',
  bio: '神明大人，为什么要教会我打开鸟笼的方法',
  author: 'Ri-Nai',
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
