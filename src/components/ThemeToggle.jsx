import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './icons/Icons';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            style={{
                backgroundColor: isDark ? '#334155' : '#E5E7EB'
            }}
            aria-label="Toggle theme"
        >
            <div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
                style={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    transform: isDark ? 'translateX(28px)' : 'translateX(0)'
                }}
            >
                {isDark ? (
                    <MoonIcon size={13} color="#6366F1" />
                ) : (
                    <SunIcon size={13} color="#F59E0B" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
