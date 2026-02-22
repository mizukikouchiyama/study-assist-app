import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlayIcon, PauseIcon, ResetIcon, ArrowLeftIcon, TimerIcon, CoffeeIcon, TomatoIcon, PartyIcon } from './icons/Icons';
import { Link } from 'react-router-dom';
import { useTimer } from '../context/TimerContext';
import { statsService } from '../services/statsService';
import { sendPomodoroCompleteNotification } from '../services/slackService';

const PomodoroTimer = () => {
    const {
        timeLeft,
        isActive,
        mode,
        taskName,
        isCompleted,
        setTaskName,
        toggleTimer,
        resetTimer,
        switchMode
    } = useTimer();

    const [completedSessions, setCompletedSessions] = useState(0);

    // セッション完了時にカウントを増やし、統計を保存
    useEffect(() => {
        if (isCompleted) {
            if (mode === 'work') {
                setCompletedSessions(prev => prev + 1);
            }
            // 統計保存
            statsService.savePomodoroSession({
                taskName: taskName || '学習',
                duration: mode === 'work' ? 25 : 5,
                type: mode
            });
            // 通知
            sendPomodoroCompleteNotification(taskName, mode === 'work' ? 25 : 5).catch(console.error);
        }
    }, [isCompleted, mode, taskName]);

    const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;

    const { progress, strokeDashoffset } = useMemo(() => {
        const p = ((totalTime - timeLeft) / totalTime) * 100;
        const radius = 120;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * ((100 - p) / 100);
        return { progress: p, strokeDashoffset: offset };
    }, [timeLeft, totalTime]);

    const timerColor = useMemo(() => {
        return mode === 'work' ? 'var(--color-primary)' : 'var(--color-accent-teal)';
    }, [mode]);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col animate-fadeIn pb-24 md:pb-0">
            {/* Header */}
            <header className="sticky top-0 z-40 shadow-sm bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
                    <Link to="/" className="mr-4 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] md:hidden">
                        <ArrowLeftIcon size={20} />
                    </Link>
                    <h1 style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        fontFamily: "'Libre Baskerville', serif",
                        color: 'var(--color-primary)', fontSize: '20px', fontWeight: '700'
                    }}>
                        <TimerIcon size={22} color="var(--color-primary)" />
                        Timer
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className={`bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-lg)] p-6 md:p-12 w-full max-w-md text-center border border-[var(--color-border)] animate-slideUp relative overflow-hidden transition-colors`}>

                    {/* 背景装飾 */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-teal)]"></div>

                    {isCompleted && (
                        <div className="absolute inset-0 z-50 bg-[var(--color-bg-card)]/90 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-sm">
                            <div className="flex justify-center mb-4 animate-bounce">
                                <PartyIcon size={64} color="var(--color-primary)" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">お疲れ様でした！</h3>
                            <p className="text-[var(--color-text-secondary)] mb-6">セッション完了です</p>
                            <button
                                onClick={resetTimer}
                                className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                            >
                                次へ進む
                            </button>
                        </div>
                    )}

                    <h2 className="heading-responsive font-bold text-[var(--color-text-primary)] mb-6">ポモドーロタイマー</h2>

                    <div className="flex justify-center mb-6 space-x-2">
                        <button
                            onClick={() => switchMode('work')}
                            className={`flex-1 tap-target rounded-full font-bold transition-smooth text-sm px-4 py-2 ${mode === 'work' ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'}`}
                        >
                            集中 (25分)
                        </button>
                        <button
                            onClick={() => switchMode('break')}
                            className={`flex-1 tap-target rounded-full font-bold transition-smooth text-sm px-4 py-2 ${mode === 'break' ? 'bg-blue-500 text-white shadow-md' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'}`}
                        >
                            休憩 (5分)
                        </button>
                    </div>

                    {mode === 'work' && (
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                placeholder="タスクを入力..."
                                className="w-full text-center bg-[var(--color-bg-secondary)] rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-[var(--color-bg-card)] outline-none px-4 py-3 text-lg font-medium text-[var(--color-text-primary)] transition-all placeholder-[var(--color-text-muted)]"
                            />
                        </div>
                    )}

                    {/* 円形タイマー */}
                    <div className="relative mb-8 flex items-center justify-center">
                        <svg width="260" height="260" viewBox="0 0 260 260" className="transform -rotate-90">
                            {/* 背景円 */}
                            <circle
                                cx="130"
                                cy="130"
                                r="120"
                                fill="none"
                                stroke="var(--color-bg-secondary)"
                                strokeWidth="12"
                                className="transition-colors"
                            />
                            {/* 進捗円 */}
                            <circle
                                cx="130"
                                cy="130"
                                r="120"
                                fill="none"
                                className={`transition-all duration-1000 ease-linear ${timerColor}`}
                                strokeWidth="12"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-6xl mb-2">
                                {isActive ? (
                                    mode === 'work' ? (
                                        <TimerIcon size={36} color="var(--color-primary)" />
                                    ) : (
                                        <CoffeeIcon size={36} color="var(--color-primary)" />
                                    )
                                ) : (
                                    <PauseIcon size={32} color="var(--color-primary)" />
                                )}
                            </div>
                            <div className="text-5xl font-mono font-bold tracking-wider ${mode === 'work' ? 'text-[var(--color-text-primary)]' : 'text-blue-600 dark:text-blue-400'}">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                                {isActive ? '進行中' : '一時停止'}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-6 mb-6">
                        <button
                            onClick={toggleTimer}
                            className={`flex items-center justify-center w-16 h-16 rounded-full text-white transition-smooth shadow-lg hover:scale-105 active:scale-95 ${isActive ? 'bg-[var(--color-accent-coral)]' : (mode === 'work' ? 'bg-[var(--color-primary)]' : 'bg-blue-500')}`}
                        >
                            {isActive ? <PauseIcon size={32} color="currentColor" /> : <PlayIcon size={32} color="currentColor" />}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-smooth border border-[var(--color-border)] shadow-sm hover:scale-105 active:scale-95"
                        >
                            <ResetIcon size={24} color="currentColor" />
                        </button>
                    </div>

                    {/* セッション完了カウンター */}
                    {completedSessions > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide font-bold">Today's Focus</p>
                            <div className="flex justify-center flex-wrap gap-1 text-2xl">
                                {[...Array(completedSessions)].map((_, i) => (
                                    <div key={i} className="animate-scaleIn flex items-center justify-center p-1" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <TomatoIcon size={28} color="var(--color-accent-coral)" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
