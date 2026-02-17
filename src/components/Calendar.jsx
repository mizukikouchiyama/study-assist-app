import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendTestReminderNotification } from '../services/slackService';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tests, setTests] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTest, setNewTest] = useState({
        name: '',
        subject: '',
        date: '',
        range: '',
        school: ''
    });

    useEffect(() => {
        const savedTests = localStorage.getItem('scheduledTests');
        if (savedTests) {
            setTests(JSON.parse(savedTests));
        }
    }, []);

    useEffect(() => {
        if (tests.length > 0) {
            localStorage.setItem('scheduledTests', JSON.stringify(tests));
        }
    }, [tests]);

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        const startDayOfWeek = firstDay.getDay();

        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const handleAddTest = () => {
        if (!newTest.name || !newTest.date) {
            alert('テスト名と日付は必須です');
            return;
        }
        const testToAdd = {
            ...newTest,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        setTests([...tests, testToAdd]);
        setShowAddModal(false);
        setNewTest({ name: '', subject: '', date: '', range: '', school: '' });
        alert('テストを追加しました！');
    };

    const handleDeleteTest = (testId) => {
        if (window.confirm('このテストを削除しますか？')) {
            const updatedTests = tests.filter(t => t.id !== testId);
            setTests(updatedTests);
            if (updatedTests.length === 0) {
                localStorage.removeItem('scheduledTests');
            }
        }
    };

    const getTestsForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return tests.filter(test => test.date === dateStr);
    };

    const changeMonth = (delta) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    const getUrgencyBadge = (daysUntil) => {
        if (daysUntil === 0) return { emoji: '🔴', text: '今日!', color: 'bg-red-500', textCol: 'text-red-600 dark:text-red-400', bgCol: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800' };
        if (daysUntil <= 1) return { emoji: '🟠', text: '明日', color: 'bg-orange-500', textCol: 'text-orange-600 dark:text-orange-400', bgCol: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' };
        if (daysUntil <= 3) return { emoji: '🟡', text: `あと${daysUntil}日`, color: 'bg-yellow-500', textCol: 'text-yellow-600 dark:text-yellow-400', bgCol: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800' };
        return { emoji: '🟢', text: `あと${daysUntil}日`, color: 'bg-green-500', textCol: 'text-green-600 dark:text-green-400', bgCol: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' };
    };

    const getSubjectEmoji = (subject) => {
        const map = {
            '数学': '📐', '英語': '🔤', '国語': '📖', '理科': '🔬', '社会': '🌍', 'その他': '📝'
        };
        return map[subject] || '📝';
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24 md:pb-8 animate-fadeIn smooth-scroll">
            {/* Header */}
            <div className="mobile-padding border-b border-[var(--color-border)] md:border-none bg-[var(--color-bg-card)] md:bg-transparent sticky top-0 z-30">
                <div className="max-w-7xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors hover-scale tap-target">
                        <ArrowLeft className="mr-2" size={20} /> <span className="text-sm md:text-base">ホームに戻る</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mobile-padding">
                <div className="calendar-header mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-start bg-[var(--color-bg-card)] p-2 rounded-full shadow-sm border border-[var(--color-border)]">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full transition-smooth text-[var(--color-text-secondary)]">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="heading-responsive font-bold text-[var(--color-primary)] tracking-wide min-w-[140px] text-center">
                            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full transition-smooth text-[var(--color-text-secondary)]">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full hover:bg-[var(--color-primary-dark)] transition-smooth shadow-md hover-scale active-press tap-target font-bold"
                    >
                        <Plus size={20} className="mr-2" /> テスト追加
                    </button>
                </div>

                <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-md)] p-2 md:p-6 mb-8 border border-[var(--color-border)] animate-slideUp overflow-hidden">
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4 border-b border-[var(--color-border)] pb-2">
                        {weekDays.map((day, i) => (
                            <div key={day} className={`text-center font-bold py-2 ${i === 0 ? 'text-red-500' : (i === 6 ? 'text-blue-500' : 'text-[var(--color-text-secondary)]')}`}>{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {calendarDays.map((date, index) => {
                            const testsOnDay = date ? getTestsForDate(date) : [];
                            const isToday = date && date.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={index}
                                    className={`
                                        min-h-[80px] md:min-h-32 p-1 md:p-2 border rounded-xl transition-all relative
                                        ${!date ? 'bg-[var(--color-bg-secondary)] border-transparent' : 'bg-[var(--color-bg-card)] border-[var(--color-border)] hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/20'}
                                        ${isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 dark:ring-offset-[var(--color-bg-card)]' : ''}
                                    `}
                                >
                                    {date && (
                                        <>
                                            <span className={`block w-7 h-7 text-center leading-7 rounded-full text-xs md:text-sm font-bold mb-1 ${isToday ? 'bg-[var(--color-primary)] text-white' : (testsOnDay.length > 0 ? 'text-red-500' : 'text-[var(--color-text-secondary)]')}`}>
                                                {date.getDate()}
                                            </span>
                                            {testsOnDay.length > 0 && (
                                                <div className="flex flex-col gap-1 mt-1">
                                                    {testsOnDay.map(test => (
                                                        <div key={test.id} className="text-[10px] md:text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md px-1 py-0.5 truncate border border-blue-200 dark:border-blue-800">
                                                            {getSubjectEmoji(test.subject)} {test.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {/* モバイル用ドットマーカー */}
                                            {testsOnDay.length > 0 && (
                                                <div className="md:hidden absolute top-2 right-2 flex gap-0.5">
                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-[#FFFFF0] dark:bg-[#2C2C20] rounded-2xl shadow-[var(--shadow-md)] p-4 md:p-6 border border-yellow-100 dark:border-yellow-900/30 animate-slideUp-delay-1 transition-colors">
                    <h3 className="heading-responsive font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
                        <CalendarIcon className="mr-2 text-yellow-600 dark:text-yellow-400" /> 近日のテスト予定
                    </h3>

                    {tests.filter(test => new Date(test.date) >= new Date()).length === 0 ? (
                        <div className="text-center py-8 md:py-12 bg-[var(--color-bg-card)] rounded-xl border border-dashed border-yellow-200 dark:border-yellow-800">
                            <div className="text-4xl md:text-6xl mb-4">📭</div>
                            <p className="text-base md:text-lg font-bold text-[var(--color-text-secondary)]">テストがまだ登録されていません</p>
                            <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-2">「＋テスト追加」で最初のテストを登録しましょう</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tests
                                .filter(test => new Date(test.date) >= new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 5)
                                .map(test => {
                                    const daysUntil = Math.ceil((new Date(test.date) - new Date()) / (1000 * 60 * 60 * 24));
                                    const badge = getUrgencyBadge(daysUntil);

                                    return (
                                        <div key={test.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-xl shadow-sm hover:shadow-md transition-smooth border-l-4 ${badge.border.replace('border', 'border-l')} border-y border-r border-gray-100 dark:border-gray-800`}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${badge.bgCol} ${badge.textCol} border ${badge.border}`}>
                                                        {badge.emoji} {badge.text}
                                                    </span>
                                                    <span className="text-xs text-[var(--color-text-muted)]">{test.date.replace(/-/g, '/')}</span>
                                                </div>
                                                <h4 className="font-bold text-[var(--color-text-primary)] text-lg flex items-center">
                                                    <span className="mr-2 text-2xl">{getSubjectEmoji(test.subject)}</span>
                                                    {test.name}
                                                </h4>
                                                {test.range && <p className="text-sm text-[var(--color-text-secondary)] mt-1 ml-9">📝 範囲: {test.range}</p>}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTest(test.id)}
                                                className="w-full md:w-auto mt-4 md:mt-0 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Trash2 size={20} /> <span className="md:hidden ml-2">削除</span>
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* モーダル */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-fadeIn" onClick={() => setShowAddModal(false)}>
                    <div className="bg-[var(--color-bg-card)] rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md p-6 border-t md:border border-[var(--color-border)] animate-slideUp md:animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 md:hidden"></div>
                        <h3 className="heading-responsive font-bold mb-6 text-[var(--color-text-primary)]">📝 新しいテストを追加</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddTest(); }}>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-1">テスト名 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="例: 中間テスト"
                                        value={newTest.name}
                                        onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                                        className="w-full p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)] outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-1">科目</label>
                                        <select
                                            value={newTest.subject}
                                            onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                                            className="w-full p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)] outline-none transition-all"
                                        >
                                            <option value="">選択...</option>
                                            <option value="数学">数学</option>
                                            <option value="英語">英語</option>
                                            <option value="国語">国語</option>
                                            <option value="理科">理科</option>
                                            <option value="社会">社会</option>
                                            <option value="その他">その他</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-1">日付 <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={newTest.date}
                                            onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                                            className="w-full p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)] outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-1">テスト範囲</label>
                                    <input
                                        type="text"
                                        placeholder="例: p.12-34"
                                        value={newTest.range}
                                        onChange={(e) => setNewTest({ ...newTest, range: e.target.value })}
                                        className="w-full p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 tap-target py-3 bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] rounded-xl font-bold hover:bg-[var(--color-border)] transition-colors">
                                    キャンセル
                                </button>
                                <button type="submit" className="flex-1 tap-target py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-[var(--color-primary-dark)] shadow-md transition-colors">
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
