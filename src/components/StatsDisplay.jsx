import React, { useMemo } from 'react';
import { statsService } from '../services/statsService';
import { TimerIcon, ClockIcon, TrendingUpIcon, StatsIcon, CalendarIcon, TrophyIcon, MedalIcon, BadgeIcon } from './icons/Icons';

const StatsDisplay = () => {
    const todayStats = useMemo(() => statsService.getTodayStats(), []);
    const weeklyStats = useMemo(() => statsService.getWeeklyStats(), []);
    const monthlyStats = useMemo(() => statsService.getMonthlyStats(), []);
    const subjectStats = useMemo(() => statsService.getSubjectStats(), []);
    const streak = useMemo(() => statsService.getStreak(), []);

    const maxCount = Math.max(...weeklyStats.map(d => d.count), 1);

    const addTestData = () => {
        const tasks = ['数学', '英語', '国語', '理科', '数学', '英語', '数学'];
        const sessions = [];
        tasks.forEach((task, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(i / 2));
            const dateStr = date.toISOString().split('T')[0];
            sessions.push({
                id: Date.now() + i,
                taskName: task,
                duration: 25,
                type: 'work',
                completedAt: new Date().toISOString(),
                date: dateStr
            });
        });
        const existing = JSON.parse(localStorage.getItem('pomodoroSessions') || '[]');
        localStorage.setItem('pomodoroSessions', JSON.stringify([...existing, ...sessions]));
        window.location.reload();
    };

    return (
        <div className="space-y-4 animate-fadeIn">

            {/* テストデータ追加ボタン（開発用） */}
            <button
                onClick={addTestData}
                className="w-full py-2 mb-4 text-sm rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-smooth flex items-center justify-center gap-2"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-text-muted)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
                <span>テストデータを追加（動作確認用）</span>
            </button>

            {/* 今日のサマリー */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-3 text-center border border-[var(--color-border)]">
                    <div className="mb-1 flex justify-center">
                        <TimerIcon size={28} color="var(--color-primary)" />
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-primary)]">
                        {todayStats.count}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        今日のポモドーロ
                    </div>
                </div>
                <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-3 text-center border border-[var(--color-border)]">
                    <div className="mb-1 flex justify-center">
                        <ClockIcon size={28} color="var(--color-primary)" />
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-primary)]">
                        {todayStats.totalMinutes}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        今日の学習分数
                    </div>
                </div>
                <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-3 text-center border border-[var(--color-border)]">
                    <div className="mb-1 flex justify-center">
                        <TrendingUpIcon size={28} color="var(--color-accent-coral)" />
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-accent-coral)]">
                        {streak}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                        連続学習日
                    </div>
                </div>
            </div>

            {/* 週間グラフ */}
            <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-4 border border-[var(--color-border)]">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                    <StatsIcon size={16} color="var(--color-primary)" />
                    <span>今週の学習記録</span>
                </h3>
                <div className="flex items-end justify-around gap-2 h-32">
                    {weeklyStats.map((day) => (
                        <div key={day.date}
                            className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-xs font-medium text-[var(--color-text-muted)]">
                                {day.count}
                            </span>
                            <div className="w-full rounded-t-lg transition-all duration-500"
                                style={{
                                    height: `${(day.count / maxCount) * 100}px`,
                                    minHeight: day.count > 0 ? '8px' : '2px',
                                    backgroundColor: day.count > 0
                                        ? 'var(--color-primary)'
                                        : 'var(--color-border)'
                                }}
                            />
                            <span className="text-xs text-[var(--color-text-muted)]">
                                {day.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 月間サマリー */}
            <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-4 border border-[var(--color-border)]">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-[var(--color-text-primary)]">
                    <CalendarIcon size={16} color="var(--color-primary)" />
                    <span>今月の合計</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                            {monthlyStats.totalCount}
                        </div>
                        <div className="text-xs mt-1 text-[var(--color-text-muted)]">
                            ポモドーロ数
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                            {monthlyStats.totalHours}時間
                        </div>
                        <div className="text-xs mt-1 text-[var(--color-text-muted)]">
                            総学習時間
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                        <div className="text-2xl font-bold text-[var(--color-accent-gold)]">
                            {monthlyStats.avgPerDay}
                        </div>
                        <div className="text-xs mt-1 text-[var(--color-text-muted)]">
                            1日平均
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[var(--color-bg-secondary)]">
                        <div className="text-2xl font-bold text-[var(--color-accent-coral)]">
                            {streak}日
                        </div>
                        <div className="text-xs mt-1 text-[var(--color-text-muted)]">
                            連続記録
                        </div>
                    </div>
                </div>
            </div>

            {/* 科目別ランキング */}
            {
                subjectStats.length > 0 && (
                    <div className="bg-[var(--color-bg-card)] rounded-xl shadow-sm p-4 border border-[var(--color-border)]">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-[var(--color-text-primary)]">
                            <TrophyIcon size={20} color="var(--color-primary)" />
                            <span>科目別学習時間</span>
                        </h3>
                        <div className="space-y-2">
                            {subjectStats.slice(0, 5).map((subject, index) => {
                                const getMedalIcon = (i) => {
                                    switch (i) {
                                        case 0: return <MedalIcon size={24} color="#FFD700" text="1" />;
                                        case 1: return <MedalIcon size={24} color="#C0C0C0" text="2" />;
                                        case 2: return <MedalIcon size={24} color="#CD7F32" text="3" />;
                                        case 3: return <BadgeIcon size={24} color="var(--color-text-muted)" text="4" />;
                                        case 4: return <BadgeIcon size={24} color="var(--color-text-muted)" text="5" />;
                                        default: return null;
                                    }
                                };
                                const maxSubjectCount = subjectStats[0].count;
                                return (
                                    <div key={subject.name}
                                        className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8">
                                            {getMedalIcon(index)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[var(--color-text-primary)]">
                                                    {subject.name}
                                                </span>
                                                <span className="text-[var(--color-text-muted)]">
                                                    {subject.minutes}分
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-[var(--color-border)]">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-700 bg-[var(--color-primary)]"
                                                    style={{
                                                        width: `${(subject.count / maxSubjectCount) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            {/* データがない場合 */}
            {
                subjectStats.length === 0 && todayStats.count === 0 && (
                    <div className="text-center py-8">
                        <div style={{ opacity: 0.3, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <StatsIcon size={64} color="var(--color-primary)" />
                        </div>
                        <p className="font-semibold text-[var(--color-text-secondary)]">
                            まだデータがありません
                        </p>
                        <p className="text-sm mt-1 text-[var(--color-text-muted)]">
                            ポモドーロタイマーを使うと<br />統計が表示されます
                        </p>
                    </div>
                )
            }
        </div >
    );
};

export default StatsDisplay;
