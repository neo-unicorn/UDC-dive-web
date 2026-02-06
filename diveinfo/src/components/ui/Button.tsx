// src/components/ui/Button.tsx
// 按钮组件（桩代码）

import type { ReactNode } from 'react';

export interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
}

/**
 * 按钮组件
 */
export function Button(props: ButtonProps): JSX.Element {
    throw new Error('Not implemented');
}

export default Button;
