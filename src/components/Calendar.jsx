import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIconLucide } from 'lucide-react';
import { CalendarIcon, PlusIcon, FileIcon, TrashIcon, SubjectMathIcon, SubjectEnglishIcon, SubjectJapaneseIcon, SubjectScienceIcon, SubjectSocialIcon, CircleFilledIcon } from './icons/Icons';
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
        if (daysUntil === 0) return { icon: <CircleFilledIcon size={14} color="#ef4444" />, text: '今日!', color: 'bg-red-500', textCol: 'text-red-600 dark:text-red-400', bgCol: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800' };
        if (daysUntil <= 1) return { icon: <CircleFilledIcon size={14} color="#f97316" />, text: '明日', color: 'bg-orange-500', textCol: 'text-orange-600 dark:text-orange-400', bgCol: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' };
        if (daysUntil <= 3) return { icon: <CircleFilledIcon size={14} color="#eab308" />, text: `あと${daysUntil}日`, color: 'bg-yellow-500', textCol: 'text-yellow-600 dark:text-yellow-400', bgCol: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800' };
        return { icon: <CircleFilledIcon size={14} color="#22c55e" />, text: `あと${daysUntil}日`, color: 'bg-green-500', textCol: 'text-green-600 dark:text-green-400', bgCol: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' };
    };

    const getSubjectIcon = (subject) => {
        switch (subject) {
            case '数学': return <SubjectMathIcon size={24} color="var(--color-primary)" />;
            case '英語': return <SubjectEnglishIcon size={24} color="var(--color-primary)" />;
            case '国語': return <SubjectJapaneseIcon size={24} color="var(--color-primary)" />;
            case '理科': return <SubjectScienceIcon size={24} color="var(--color-primary)" />;
            case '社会': return <SubjectSocialIcon size={24} color="var(--color-primary)" />;
            default: return <FileIcon size={24} color="var(--color-primary)" />;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24 md:pb-8 animate-fadeIn smooth-scroll">
            {/* Header */}
            <header className="sticky top-0 z-40 shadow-sm bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="mr-4 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] md:hidden">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontFamily: "'Libre Baskerville', serif",
                            color: 'var(--color-primary)', fontSize: '20px', fontWeight: '700'
                        }}>
                            <CalendarIcon size={22} color="var(--color-primary)" />
                            Calendar
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '12px', border: 'none',
                            backgroundColor: 'var(--color-primary)', color: 'white',
                            fontFamily: "'Libre Baskerville', serif",
                            fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                    >
                        <PlusIcon size={13} color="white" />
                        <span>Add Test</span>
                    </button>
                </div>
            </header>

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
                                                    {testsOnDay.map((test, idx) => (
                                                        <div key={idx} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '3px',
                                                            fontSize: '10px',
                                                            color: 'var(--color-primary)',
                                                            backgroundColor: 'rgba(0,112,74,0.10)',
                                                            border: '1px solid rgba(0,112,74,0.2)',
                                                            borderRadius: '4px',
                                                            padding: '2px 4px',
                                                            overflow: 'hidden',
                                                            whiteSpace: 'nowrap',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            <FileIcon size={10} color="var(--color-primary)" />
                                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {test.subject}
                                                            </span>
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


                <div style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '20px'
                }} className="shadow-[var(--shadow-md)] animate-slideUp-delay-1 transition-colors">
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: "'Libre Baskerville', serif",
                        color: 'var(--color-primary)',
                        fontWeight: '700',
                        marginBottom: '16px',
                        fontSize: '18px'
                    }}>
                        <CalendarIcon size={18} color="var(--color-primary)" />
                        近日のテスト予定
                    </h3>

                    {tests.filter(test => new Date(test.date) >= new Date()).length === 0 ? (
                        <div className="text-center py-8 md:py-12 bg-[var(--color-bg-card)] rounded-xl border border-dashed border-[var(--color-border)]">
                            <div style={{
                                opacity: 0.3,
                                marginBottom: '16px',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <CalendarIcon size={64} color="var(--color-primary)" />
                            </div>
                            <p className="text-base md:text-lg font-bold text-[var(--color-text-secondary)]">テストがまだ登録されていません</p>
                            <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-2">「Add Test」で最初のテストを登録しましょう</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tests
                                .filter(test => new Date(test.date) >= new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 5)
                                .map(test => {
                                    const daysUntil = Math.ceil((new Date(test.date) - new Date()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <div key={test.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-xl shadow-sm hover:shadow-md transition-smooth border border-[var(--color-border)]">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        backgroundColor: 'rgba(0,112,74,0.10)',
                                                        border: '1px solid rgba(0,112,74,0.2)',
                                                        fontFamily: "'Libre Baskerville', serif",
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        color: 'var(--color-primary)'
                                                    }}>
                                                        あと{daysUntil}日
                                                    </span>
                                                    <span className="text-xs text-[var(--color-text-muted)]">{test.date.replace(/-/g, '/')}</span>
                                                </div>
                                                <h4 className="font-bold text-[var(--color-text-primary)] text-lg flex items-center">
                                                    <span className="mr-2 flex items-center">{getSubjectIcon(test.subject)}</span>
                                                    {test.name}
                                                </h4>
                                                {test.range && (
                                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 ml-9 flex items-center gap-1">
                                                        <FileIcon size={14} color="var(--color-primary)" />
                                                        範囲: {test.range}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTest(test.id)}
                                                style={{
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    backgroundColor: 'var(--color-bg-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                                className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <TrashIcon size={14} color="var(--color-accent-coral)" />
                                                <span className="md:hidden ml-2 text-[var(--color-accent-coral)]">削除</span>
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
                    <div
                        className="bg-[var(--color-bg-card)] rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md p-6 border-t md:border border-[var(--color-border)] animate-slideUp md:animate-scaleIn overflow-y-auto"
                        style={{ maxHeight: '90vh', WebkitOverflowScrolling: 'touch' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 md:hidden"></div>
                        <h3 className="heading-responsive font-bold mb-6 text-[var(--color-text-primary)] flex items-center gap-2">
                            <FileIcon size={20} color="var(--color-primary)" />
                            新しいテストを追加
                        </h3>
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
