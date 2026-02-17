import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Timer, Calendar, Archive } from 'lucide-react';
import { useTimer } from '../context/TimerContext';

const Navigation = () => {
    const { isActive } = useTimer();
    const [testBadge, setTestBadge] = useState(null);
    const [archiveCount, setArchiveCount] = useState(0);
    const location = useLocation();

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
        <nav className="fixed bottom-0 left-0 w-full bg-[var(--color-bg-card)]/90 backdrop-blur-md border-t border-[var(--color-border)] pb-safe-area pb-2 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden animate-slideUp transition-smooth">
            <div className="flex justify-around items-center max-w-md mx-auto">

                <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>
                    <Home size={24} />
                    <span className="text-[10px] font-medium mt-1">ホーム</span>
                </NavLink>

                <NavLink to="/timer" className={({ isActive: isNavActive }) => `flex flex-col items-center p-2 rounded-lg transition-colors relative ${isNavActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>
                    <div className={`relative ${isActive ? 'animate-pulse text-[var(--color-accent-coral)]' : ''}`}>
                        <Timer size={24} />
                        {isActive && <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-coral)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-accent-coral)]"></span>
                        </span>}
                    </div>
                    <span className="text-[10px] font-medium mt-1">タイマー</span>
                </NavLink>

                <NavLink to="/calendar" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-colors relative ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>
                    <div className="relative">
                        <Calendar size={24} />
                        {testBadge && <span className="absolute -top-1 -right-1 h-3 w-3 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-bg-card)] animate-bounce"></span>}
                    </div>
                    <span className="text-[10px] font-medium mt-1">カレンダー</span>
                </NavLink>

                <NavLink to="/archive" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-colors relative ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>
                    <div className="relative">
                        <Archive size={24} />
                        {archiveCount > 0 && <span className="absolute -top-2 -right-2 bg-[var(--color-accent-gold)] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-[var(--color-bg-card)]">
                            {archiveCount > 9 ? '9+' : archiveCount}
                        </span>}
                    </div>
                    <span className="text-[10px] font-medium mt-1">アーカイブ</span>
                </NavLink>

            </div>
        </nav>
    );
};

export default Navigation;
