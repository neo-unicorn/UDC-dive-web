// src/components/ui/Card.tsx
// 卡片组件（桩代码）

import type { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

/**
 * 卡片组件
 */
export function Card(props: CardProps): JSX.Element {
    throw new Error('Not implemented');
}

export default Card;
