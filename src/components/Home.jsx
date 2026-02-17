import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { sendSlackMessage } from '../services/slackService';
import ThemeToggle from './ThemeToggle';

const Home = () => {
    const [loading, setLoading] = useState(false);

    const handleTestNotification = async () => {
        setLoading(true);
        try {
            await sendSlackMessage('🔔 Slack通知テスト: ボタンが押されました！');
            alert('Slackに通知を送信しました！');
        } catch (error) {
            alert('通知の送信に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24 md:pb-16 animate-fadeIn smooth-scroll">
            {/* ヘッダー */}
            <header className="sticky top-0 bg-[var(--color-bg-card)]/90 backdrop-blur-md shadow-sm z-40 mobile-padding border-b border-[var(--color-border)] transition-smooth">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="heading-responsive font-bold text-[var(--color-primary)] truncate">
                        防府市学習アシスト
                    </h1>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleTestNotification}
                            disabled={loading}
                            className="tap-target bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg px-4 hover-scale active-press transition-smooth shadow-md disabled:opacity-50 text-sm md:text-base whitespace-nowrap flex items-center"
                        >
                            <Bell size={18} className="mr-2" />
                            <span className="hidden md:inline">Slack通知テスト</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto mobile-padding py-6 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* ポモドーロカード */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-1 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] dark:from-[var(--color-bg-card)] dark:to-[var(--color-bg-hover)]">
                        {/* アイコン背景 */}
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center border border-[var(--color-primary)]/20">
                            <span className="text-5xl">🍅</span>
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center text-[var(--color-primary)]">
                            ポモドーロタイマー
                        </h2>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 text-center">
                            25分集中 × 5分休憩で<br />効率的に学習
                        </p>

                        {/* 統計バッジ */}
                        <div className="flex justify-center gap-3 mb-6">
                            <span className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs px-3 py-1 rounded-full border border-[var(--color-border)]">
                                🎯 集中力UP
                            </span>
                            <span className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-xs px-3 py-1 rounded-full border border-[var(--color-border)]">
                                ⏱️ 25分
                            </span>
                        </div>

                        <Link to="/timer" className="block w-full tap-target bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-center rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md active-press">
                            タイマーを開く →
                        </Link>
                    </div>

                    {/* カレンダーカード */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-2 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] dark:from-[var(--color-bg-card)] dark:to-[var(--color-bg-hover)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                            <span className="text-5xl">📅</span>
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center text-blue-600 dark:text-blue-400">
                            学習カレンダー
                        </h2>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 text-center">
                            テスト日程を管理<br />自動リマインダー付き
                        </p>

                        <div className="flex justify-center gap-3 mb-6">
                            <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                🔔 自動通知
                            </span>
                            <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                📆 日程管理
                            </span>
                        </div>

                        <Link to="/calendar" className="block w-full tap-target bg-blue-500 text-white text-center rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md active-press">
                            カレンダーを開く →
                        </Link>
                    </div>

                    {/* アーカイブカード */}
                    <div className="mobile-card hover-lift animate-slideUp-delay-3 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-secondary)] dark:from-[var(--color-bg-card)] dark:to-[var(--color-bg-hover)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center border border-amber-100 dark:border-amber-800">
                            <span className="text-5xl">📚</span>
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-center text-amber-600 dark:text-amber-400">
                            テストアーカイブ
                        </h2>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 text-center">
                            過去問を保存・管理<br />いつでも振り返り可能
                        </p>

                        <div className="flex justify-center gap-3 mb-6">
                            <span className="bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800">
                                📁 PDF対応
                            </span>
                            <span className="bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800">
                                🔍 検索可能
                            </span>
                        </div>

                        <Link to="/archive" className="block w-full tap-target bg-amber-500 text-white text-center rounded-xl py-3 font-semibold hover-scale transition-smooth shadow-md active-press">
                            アーカイブを開く →
                        </Link>
                    </div>

                </div>
            </main>

            <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-transparent p-4 text-center pointer-events-none">
                <p className="text-[var(--color-text-muted)] text-xs md:text-sm animate-fadeIn">
                    © 2024 Hofu City Study Assist App.
                </p>
            </div>
        </div>
    );
};

export default Home;
