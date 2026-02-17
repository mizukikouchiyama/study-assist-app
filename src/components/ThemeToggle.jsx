import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none"
            style={{
                backgroundColor: isDark
                    ? 'var(--color-primary)'
                    : 'var(--color-border)'
            }}
            aria-label="ダークモード切替"
        >
            {/* スライダー */}
            <span
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md
          flex items-center justify-center text-sm
          transition-transform duration-300"
                style={{
                    transform: isDark ? 'translateX(28px)' : 'translateX(0)'
                }}
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    );
};

export default ThemeToggle;
