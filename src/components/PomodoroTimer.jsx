import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTimer } from '../context/TimerContext';

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

    // セッション完了時にカウントを増やす
    useEffect(() => {
        if (isCompleted && mode === 'work') {
            setCompletedSessions(prev => prev + 1);
        }
    }, [isCompleted, mode]);

    const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;

    const { progress, strokeDashoffset } = useMemo(() => {
        const p = ((totalTime - timeLeft) / totalTime) * 100;
        const radius = 120;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * ((100 - p) / 100);
        return { progress: p, strokeDashoffset: offset };
    }, [timeLeft, totalTime]);

    const timerColor = useMemo(() => {
        if (mode === 'break') return 'stroke-blue-500';
        return 'stroke-[var(--color-primary)]';
    }, [mode]);

    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [timeLeft]);

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col animate-fadeIn pb-24 md:pb-0">
            {/* Header / Nav */}
            <div className="p-4 md:p-8">
                <Link to="/" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors hover-scale tap-target">
                    <ArrowLeft className="mr-2" size={20} /> <span className="text-sm md:text-base">ホームに戻る</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className={`bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-lg)] p-6 md:p-12 w-full max-w-md text-center border border-[var(--color-border)] animate-slideUp relative overflow-hidden transition-colors`}>

                    {/* 背景装飾 */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-teal)]"></div>

                    {isCompleted && (
                        <div className="absolute inset-0 z-50 bg-[var(--color-bg-card)]/90 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-sm">
                            <span className="text-6xl mb-4 animate-bounce">🎉</span>
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
                            <span className="text-4xl mb-2 animate-bounce-slow">
                                {isActive ? (mode === 'work' ? '🍅' : '☕') : '⏸️'}
                            </span>
                            <div className={`text-5xl font-mono font-bold tracking-wider ${mode === 'work' ? 'text-[var(--color-text-primary)]' : 'text-blue-600 dark:text-blue-400'}`}>
                                {formattedTime}
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
                            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-smooth border border-[var(--color-border)] shadow-sm hover:scale-105 active:scale-95"
                        >
                            <RotateCcw size={28} />
                        </button>
                    </div>

                    {/* セッション完了カウンター */}
                    {completedSessions > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide font-bold">Today's Focus</p>
                            <div className="flex justify-center flex-wrap gap-1 text-2xl">
                                {[...Array(completedSessions)].map((_, i) => (
                                    <span key={i} className="animate-scaleIn" style={{ animationDelay: `${i * 0.1}s` }}>🍅</span>
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
