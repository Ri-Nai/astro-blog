import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	site: 'https://ri-nai.github.io',
  base: '/astro-blog',
  trailingSlash: 'ignore',
	integrations: [mdx(), sitemap(), tailwind()],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
			defaultColor: false,
			wrap: true
		},
		remarkPlugins: [remarkMath],
		rehypePlugins: [
			[rehypeKatex, {
				// 启用 MathML 输出以提供更好的可访问性
				output: 'mathml',
				// 保留 HTML 输出作为后备
				trust: true,
				// 使用更好的字体设置
				macros: {
					'\\RR': '\\mathbb{R}',
					'\\NN': '\\mathbb{N}',
					'\\ZZ': '\\mathbb{Z}',
					'\\CC': '\\mathbb{C}',
					'\\QQ': '\\mathbb{Q}'
				},
				// 启用严格模式以获得更好的渲染
				strict: false,
				// 启用颜色支持
				colorIsTextColor: true
			}]
		]
	}
});
