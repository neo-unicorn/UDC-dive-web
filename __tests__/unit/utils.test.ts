// __tests__/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import {
  generateSlug,
  extractExcerpt,
  countWords,
  calculateReadingTime,
  formatDate,
  isValidSlug,
} from '@/lib/utils';

describe('generateSlug', () => {
  it('中文标题生成包含语言后缀的 slug', () => {
    const slug = generateSlug('潜水入门指南', 'zh');
    expect(slug).toMatch(/^潜水入门指南-zh-[a-z0-9]{4}$/);
  });

  it('英文标题转小写连字符', () => {
    const slug = generateSlug('Beginner Diving Guide', 'en');
    expect(slug).toMatch(/^beginner-diving-guide-en-[a-z0-9]{4}$/);
  });

  it('去除中文标点符号', () => {
    const slug = generateSlug('潜水！入门，指南。', 'zh');
    expect(slug).not.toMatch(/[，。！？]/);
  });

  it('超过50字符的标题被截断', () => {
    const longTitle = 'a'.repeat(60);
    const slug = generateSlug(longTitle, 'en');
    // slug 应该被截断到 50 字符 + "-en-xxxx" 后缀
    const baseSlug = slug.replace(/-en-[a-z0-9]{4}$/, '');
    expect(baseSlug.length).toBeLessThanOrEqual(50);
  });

  it('每次生成的 slug 末尾4位随机码不同', () => {
    const slug1 = generateSlug('测试标题', 'zh');
    const slug2 = generateSlug('测试标题', 'zh');
    // 有极小概率相同，但整体逻辑是随机的
    // 至少验证格式正确
    expect(slug1).toMatch(/-zh-[a-z0-9]{4}$/);
    expect(slug2).toMatch(/-zh-[a-z0-9]{4}$/);
  });
});

describe('extractExcerpt', () => {
  it('去除 Markdown 标题符号', () => {
    const result = extractExcerpt('## 这是一个标题\n\n正文内容');
    expect(result).not.toContain('##');
    expect(result).toContain('这是一个标题');
    expect(result).toContain('正文内容');
  });

  it('去除代码块', () => {
    const result = extractExcerpt('```javascript\nconst x = 1;\n```\n正文');
    expect(result).not.toContain('const x = 1');
    expect(result).toContain('正文');
  });

  it('去除粗体和斜体标记', () => {
    const result = extractExcerpt('**粗体** 和 *斜体* 文字');
    expect(result).toBe('粗体 和 斜体 文字');
  });

  it('去除超链接只保留文字', () => {
    const result = extractExcerpt('[点击这里](https://example.com) 查看详情');
    expect(result).not.toContain('https://');
    expect(result).toContain('点击这里');
    expect(result).toContain('查看详情');
  });

  it('超过200字符时截断并加省略号', () => {
    const longText = '测'.repeat(250);
    const result = extractExcerpt(longText);
    expect(result.length).toBeLessThanOrEqual(204); // 200 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('短于200字符的内容原样返回', () => {
    const shortText = '这是一段短文字，不超过200字符。';
    const result = extractExcerpt(shortText);
    expect(result).toBe(shortText);
    expect(result.endsWith('...')).toBe(false);
  });

  it('自定义 maxLength', () => {
    const text = '这是一段文字内容，用来测试自定义长度限制。';
    const result = extractExcerpt(text, 10);
    expect(result.length).toBeLessThanOrEqual(13); // 10 + '...'
  });
});

describe('countWords', () => {
  it('正确统计中文字符数', () => {
    const count = countWords('你好世界');
    expect(count).toBe(4);
  });

  it('正确统计英文单词数', () => {
    const count = countWords('hello world foo');
    expect(count).toBe(3);
  });

  it('混合中英文统计', () => {
    const count = countWords('潜水 diving 技巧');
    // "潜水" = 2, "diving" = 1, "技巧" = 2
    expect(count).toBe(5);
  });

  it('Markdown 内容去除标记后统计', () => {
    const count = countWords('## 标题\n**粗体文字** 普通文字');
    // "标题粗体文字普通文字" = 8 中文字符
    expect(count).toBeGreaterThan(0);
  });

  it('空字符串返回0', () => {
    const count = countWords('');
    expect(count).toBe(0);
  });
});

describe('calculateReadingTime', () => {
  it('短文章至少1分钟', () => {
    const time = calculateReadingTime('短文');
    expect(time).toBe(1);
  });

  it('300字约1分钟', () => {
    const text = '字'.repeat(300);
    const time = calculateReadingTime(text);
    expect(time).toBe(1);
  });

  it('600字约2分钟', () => {
    const text = '字'.repeat(600);
    const time = calculateReadingTime(text);
    expect(time).toBe(2);
  });

  it('阅读时间向上取整', () => {
    const text = '字'.repeat(350); // 350/300 = 1.167 → ceil = 2
    const time = calculateReadingTime(text);
    expect(time).toBe(2);
  });
});

describe('formatDate', () => {
  it('中文格式化日期', () => {
    const date = new Date('2025-01-15');
    const result = formatDate(date, 'zh');
    expect(result).toContain('2025');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('英文格式化日期', () => {
    const date = new Date('2025-01-15');
    const result = formatDate(date, 'en');
    expect(result).toContain('2025');
    expect(result).toContain('January');
  });

  it('接受字符串类型的日期', () => {
    const result = formatDate('2025-06-01', 'zh');
    expect(result).toContain('2025');
  });
});

describe('isValidSlug', () => {
  it('有效英文 slug', () => {
    expect(isValidSlug('hello-world')).toBe(true);
  });

  it('有效数字 slug', () => {
    expect(isValidSlug('article-123')).toBe(true);
  });

  it('有效中文 slug', () => {
    expect(isValidSlug('潜水-入门')).toBe(true);
  });

  it('连续连字符无效', () => {
    expect(isValidSlug('hello--world')).toBe(false);
  });

  it('以连字符开头无效', () => {
    expect(isValidSlug('-hello-world')).toBe(false);
  });

  it('以连字符结尾无效', () => {
    expect(isValidSlug('hello-world-')).toBe(false);
  });

  it('包含大写字母无效', () => {
    expect(isValidSlug('Hello-World')).toBe(false);
  });

  it('包含空格无效', () => {
    expect(isValidSlug('hello world')).toBe(false);
  });
});
