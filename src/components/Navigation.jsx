import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, TimerIcon, CalendarIcon, ArchiveIcon, StatsIcon } from './icons/Icons';
import { useTimer } from '../context/TimerContext';

const Navigation = () => {
    const { isActive } = useTimer();
    const [testBadge, setTestBadge] = useState(null);
    const [archiveCount, setArchiveCount] = useState(0);
    const location = useLocation();

    const navItems = [
        { path: '/', icon: HomeIcon, label: 'Home' },
        { path: '/timer', icon: TimerIcon, label: 'Timer' },
        { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
        { path: '/archive', icon: ArchiveIcon, label: 'Archive' },
        { path: '/stats', icon: StatsIcon, label: 'Stats' },
    ];

    // バッジ情報の更新（ロケーション変更時やマウント時）
    useEffect(() => {
        // カレンダーバッジ（3日以内のテストがあるか）
        const storedTests = localStorage.getItem('scheduledTests');
        if (storedTests) {
            const tests = JSON.parse(storedTests);
            const now = new Date();
            const upcomingUrgent = tests.some(test => {
                const testDate = new Date(test.date);
                const diffTime = testDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 3;
            });
            setTestBadge(upcomingUrgent);
        }

        // アーカイブバッジ（件数）
        const storedArchives = localStorage.getItem('testArchives');
        if (storedArchives) {
            const archives = JSON.parse(storedArchives);
            setArchiveCount(archives.length);
        }
    }, [location]);

    return (
        <nav style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} className="fixed bottom-0 left-0 w-full bg-[var(--color-bg-card)]/90 backdrop-blur-md border-t border-[var(--color-border)] pb-safe-area pb-2 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden animate-slideUp transition-smooth">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive: isNavActive }) =>
                                `flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative`
                            }
                        >
                            {({ isActive: isNavActive }) => {
                                const iconColor = isNavActive ? 'var(--color-primary)' : 'var(--color-text-muted)';
                                const showTimerPulse = item.path === '/timer' && isActive;
                                const showCalendarBadge = item.path === '/calendar' && testBadge;
                                const showArchiveBadge = item.path === '/archive' && archiveCount > 0;

                                return (
                                    <>
                                        <div
                                            className="p-1.5 rounded-xl mb-0.5 transition-all duration-200 relative"
                                            style={{
                                                backgroundColor: isNavActive ? 'rgba(0,112,74,0.12)' : 'transparent'
                                            }}
                                        >
                                            <Icon size={22} color={iconColor} />

                                            {/* Timer Active Indicator */}
                                            {showTimerPulse && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-coral)] opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-accent-coral)]"></span>
                                                </span>
                                            )}

                                            {/* Calendar Urgent Badge */}
                                            {showCalendarBadge && (
                                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-bg-card)] animate-bounce"></span>
                                            )}

                                            {/* Archive Count Badge */}
                                            {showArchiveBadge && (
                                                <span className="absolute -top-2 -right-2 bg-[var(--color-accent-gold)] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-[var(--color-bg-card)]">
                                                    {archiveCount > 9 ? '9+' : archiveCount}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            style={{
                                                fontFamily: "'Libre Baskerville', Baskerville, serif",
                                                fontSize: '9.5px',
                                                fontWeight: isNavActive ? '700' : '400',
                                                letterSpacing: '0.03em',
                                                color: iconColor
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </>
                                );
                            }}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navigation;
