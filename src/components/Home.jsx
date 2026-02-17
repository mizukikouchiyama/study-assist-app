import React from 'react';
import { Link } from 'react-router-dom';
import {
    TimerIcon, CalendarIcon, ArchiveIcon, StatsIcon,
    BellIcon, SearchIcon, FileIcon, ClockIcon,
    TrendingUpIcon, ArrowRightIcon
} from './icons/Icons';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
    const { isDark } = useTheme();

    // バッジの共通スタイル
    const badgeStyle = isDark ? {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        borderRadius: '999px',
        background: 'rgba(74,222,128,0.12)',
        fontFamily: "'Libre Baskerville', Baskerville, serif",
        fontSize: '11px',
        fontWeight: '700',
        color: '#4ADE80',
        border: '1px solid rgba(74,222,128,0.2)',
        letterSpacing: '0.02em',
    } : {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        borderRadius: '999px',
        background: 'rgba(0,112,74,0.10)',
        fontFamily: "'Libre Baskerville', Baskerville, serif",
        fontSize: '11px',
        fontWeight: '700',
        color: 'var(--color-primary)',
        border: '1px solid rgba(0,112,74,0.15)',
        letterSpacing: '0.02em',
    };

    const badgeIconColor = isDark ? '#4ADE80' : 'var(--color-primary)';

    return (
        <div className="min-h-screen pb-20 animate-fadeIn" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            {/* Header */}
            <header className="sticky top-0 z-40 shadow-sm" style={{ backgroundColor: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-primary)' }}>
                            Study Assist
                        </h1>
                        <p className="text-xs italic mt-0.5" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-text-muted)' }}>
                            Hofu City Learning Platform
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="text-center mb-12 animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-text-primary)' }}>
                        Welcome
                    </h2>
                    <p className="text-base md:text-lg italic" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-text-secondary)' }}>
                        Your personal study companion
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

                    {/* Timer Card */}
                    <div className="mobile-card hover-lift animate-slideUp bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,112,74,0.08)' }}>
                            <TimerIcon size={40} color="var(--color-primary)" />
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-primary)' }}>
                            Timer
                        </h2>

                        <p className="text-sm mb-4 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            25分集中 × 5分休憩で<br />効率的に学習
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={badgeStyle}>
                                <TimerIcon size={11} color={badgeIconColor} />
                                Pomodoro
                            </span>
                            <span style={badgeStyle}>
                                <BellIcon size={11} color={badgeIconColor} />
                                Notification
                            </span>
                        </div>

                        <Link to="/timer" className="flex items-center justify-center gap-2 w-full tap-target text-white rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", backgroundColor: 'var(--color-primary)' }}>
                            <span>Open Timer</span>
                            <ArrowRightIcon size={16} color="white" />
                        </Link>
                    </div>

                    {/* Calendar Card */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-1 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,112,74,0.08)' }}>
                            <CalendarIcon size={40} color="var(--color-primary)" />
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-primary)' }}>
                            Calendar
                        </h2>

                        <p className="text-sm mb-4 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            テスト日程を管理<br />自動リマインダー付き
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={badgeStyle}>
                                <CalendarIcon size={11} color={badgeIconColor} />
                                Schedule
                            </span>
                            <span style={badgeStyle}>
                                <ClockIcon size={11} color={badgeIconColor} />
                                Reminder
                            </span>
                        </div>

                        <Link to="/calendar" className="flex items-center justify-center gap-2 w-full tap-target text-white rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", backgroundColor: 'var(--color-primary)' }}>
                            <span>Open Calendar</span>
                            <ArrowRightIcon size={16} color="white" />
                        </Link>
                    </div>

                    {/* Archive Card */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-2 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,112,74,0.08)' }}>
                            <ArchiveIcon size={40} color="var(--color-primary)" />
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-primary)' }}>
                            Archive
                        </h2>

                        <p className="text-sm mb-4 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            過去問を保存・管理<br />いつでも振り返り可能
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={badgeStyle}>
                                <FileIcon size={11} color={badgeIconColor} />
                                PDF Support
                            </span>
                            <span style={badgeStyle}>
                                <SearchIcon size={11} color={badgeIconColor} />
                                Search
                            </span>
                        </div>

                        <Link to="/archive" className="flex items-center justify-center gap-2 w-full tap-target text-white rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", backgroundColor: 'var(--color-primary)' }}>
                            <span>Open Archive</span>
                            <ArrowRightIcon size={16} color="white" />
                        </Link>
                    </div>

                    {/* Stats Card */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-3 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,112,74,0.08)' }}>
                            <StatsIcon size={40} color="var(--color-primary)" />
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", color: 'var(--color-primary)' }}>
                            Stats
                        </h2>

                        <p className="text-sm mb-4 text-center" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            学習時間・連続日数<br />科目別グラフで可視化
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={badgeStyle}>
                                <StatsIcon size={11} color={badgeIconColor} />
                                Charts
                            </span>
                            <span style={badgeStyle}>
                                <TrendingUpIcon size={11} color={badgeIconColor} />
                                Streak
                            </span>
                        </div>

                        <Link to="/stats" className="flex items-center justify-center gap-2 w-full tap-target text-white rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", backgroundColor: 'var(--color-primary)' }}>
                            <span>Open Stats</span>
                            <ArrowRightIcon size={16} color="white" />
                        </Link>
                    </div>

                </div>
            </main>

            <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-transparent p-4 text-center pointer-events-none">
                <p className="text-xs md:text-sm animate-fadeIn" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif", fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                    © 2024 Hofu City Study Assist App
                </p>
            </div>
        </div>
    );
};

export default Home;
