// __tests__/components/Pagination.test.tsx
// 分页组件测试

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pagination } from '@/components/ui/Pagination';

describe('Pagination', () => {
    it('应该渲染页码', () => {
        expect(() => {
            render(<Pagination page={1} pages={5} baseUrl="/zh" />);
        }).toThrow('Not implemented');
    });

    it('第一页时上一页按钮应该禁用', () => {
        expect(() => {
            render(<Pagination page={1} pages={5} baseUrl="/zh" />);
        }).toThrow('Not implemented');
    });

    it('最后一页时下一页按钮应该禁用', () => {
        expect(() => {
            render(<Pagination page={5} pages={5} baseUrl="/zh" />);
        }).toThrow('Not implemented');
    });

    it('只有一页时不应该显示分页', () => {
        expect(() => {
            render(<Pagination page={1} pages={1} baseUrl="/zh" />);
        }).toThrow('Not implemented');
    });

    it('应该高亮当前页', () => {
        expect(() => {
            render(<Pagination page={3} pages={5} baseUrl="/zh" />);
        }).toThrow('Not implemented');
    });
});
