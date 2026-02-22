import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Plus, X, ArrowLeft } from 'lucide-react';
import { ArchiveIcon, PlusIcon, UploadIcon, FileIcon } from './icons/Icons';
import { Link } from 'react-router-dom';
import { saveArchives, loadArchives } from '../services/storageService';
import ArchiveCard from './ArchiveCard';

const TestArchive = () => {
    const [archives, setArchives] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({
        school: '',
        subject: '',
        startDate: '',
        endDate: ''
    });
    const [formData, setFormData] = useState({
        school: '',
        subject: '数学',
        testType: '中間テスト',
        date: new Date().toISOString().split('T')[0],
        tags: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loaded = loadArchives();
        setArchives(loaded);
    }, []);

    useEffect(() => {
        saveArchives(archives);
    }, [archives]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('ファイルサイズは5MB以下にしてください。');
                e.target.value = null;
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    }, []);

    const convertToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('ファイルを選択してください。');
            return;
        }

        setIsUploading(true);
        try {
            const base64Data = await convertToBase64(selectedFile);

            const newArchive = {
                id: Date.now(),
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                school: formData.school,
                subject: formData.subject,
                testType: formData.testType,
                date: formData.date,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                fileData: base64Data, // Note: In a real app with optimization, this might be separate
                createdAt: new Date().toISOString()
            };

            setArchives(prev => [...prev, newArchive]);
            setShowModal(false);
            setFormData({
                school: '',
                subject: '数学',
                testType: '中間テスト',
                date: new Date().toISOString().split('T')[0],
                tags: ''
            });
            setSelectedFile(null);
            alert('アーカイブを保存しました！');
        } catch (error) {
            console.error('Error processing file:', error);
            alert('エラーが発生しました。');
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, formData, convertToBase64]);

    const handleDelete = useCallback((id) => {
        if (window.confirm('このアーカイブを削除しますか？')) {
            setArchives(prev => prev.filter(a => a.id !== id));
        }
    }, []);

    const handleDownload = useCallback((archive) => {
        const link = document.createElement('a');
        link.href = archive.fileData;
        link.download = archive.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const filteredArchives = useMemo(() => {
        return archives.filter(archive => {
            const matchSchool = archive.school.includes(filter.school);
            const matchSubject = filter.subject ? archive.subject === filter.subject : true;
            const matchDateStart = filter.startDate ? new Date(archive.date) >= new Date(filter.startDate) : true;
            const matchDateEnd = filter.endDate ? new Date(archive.date) <= new Date(filter.endDate) : true;
            return matchSchool && matchSubject && matchDateStart && matchDateEnd;
        });
    }, [archives, filter]);

    const subjects = ['数学', '英語', '国語', '理科', '社会'];
    const testTypes = ['中間テスト', '期末テスト', '実力テスト'];

    const getSubjectColor = useCallback((subject) => {
        const map = {
            '数学': 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
            '英語': 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
            '国語': 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            '理科': 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
            '社会': 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        };
        return map[subject] || 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-24 md:pb-16 animate-fadeIn smooth-scroll">
            {/* Header */}
            <header className="page-header sticky top-0 z-40 shadow-sm bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
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
                            <ArchiveIcon size={22} color="var(--color-primary)" />
                            Archive
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '12px', border: 'none',
                            backgroundColor: 'var(--color-primary)', color: 'white',
                            fontFamily: "'Libre Baskerville', serif",
                            fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                    >
                        <PlusIcon size={13} color="white" />
                        <span>New Archive</span>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto mobile-padding">
                <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-sm p-4 md:p-6 mb-8 border border-[var(--color-border)] animate-slideUp">

                    {/* フィルター */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-primary)] h-12">
                            <Search size={18} className="text-[var(--color-text-muted)] mr-2" />
                            <input
                                type="text"
                                placeholder="学校名..."
                                value={filter.school}
                                onChange={(e) => setFilter({ ...filter, school: e.target.value })}
                                className="w-full outline-none text-base bg-transparent text-[var(--color-text-primary)]"
                            />
                        </div>
                        <select
                            value={filter.subject}
                            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-base outline-none h-12 text-[var(--color-text-primary)]"
                        >
                            <option value="">全ての科目</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* アーカイブ一覧 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArchives.map((archive, index) => (
                        <ArchiveCard
                            key={archive.id}
                            archive={archive}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            getSubjectColor={getSubjectColor}
                            index={index}
                        />
                    ))}

                    {/* Empty State */}
                    {filteredArchives.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-[var(--color-bg-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
                            <div style={{ opacity: 0.3, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                                <ArchiveIcon size={64} color="var(--color-primary)" />
                            </div>
                            <p className="text-lg font-bold text-[var(--color-text-secondary)]">アーカイブはまだ空です</p>
                            <p className="text-sm text-[var(--color-text-muted)] mt-2 mb-6">テストのPDFや画像をアップロードして整理しましょう</p>
                            <button
                                onClick={() => setShowModal(true)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                                    backgroundColor: 'var(--color-primary)', color: 'white',
                                    fontFamily: "'Libre Baskerville', serif",
                                    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                <UploadIcon size={15} color="white" />
                                ファイルをアップロード
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* モーダル */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-fadeIn" onClick={() => setShowModal(false)}>
                    <div
                        className="bg-[var(--color-bg-card)] shadow-2xl w-full max-w-lg mx-auto md:relative border-t md:border border-[var(--color-border)] animate-slideUp md:animate-scaleIn"
                        style={{
                            position: 'fixed',
                            bottom: '60px',
                            left: 0,
                            right: 0,
                            maxHeight: 'calc(85vh - 60px)',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '20px 20px 0 0',
                            backgroundColor: 'white',
                            overflow: 'hidden',
                            zIndex: 50
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '16px 16px 0 16px' }}>
                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 md:hidden"></div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">新規アーカイブ追加</h3>
                                <button onClick={() => setShowModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors hidden md:block">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                            {/* Scrollable Form Content */}
                            <div className="space-y-6" style={{
                                flex: 1,
                                overflowY: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                padding: '16px'
                            }}>
                                {/* Drag & Drop Visual Area */}
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                    />
                                    <div className={`border-2 border-dashed ${selectedFile ? 'border-[var(--color-primary)] bg-green-50 dark:bg-green-900/10' : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-hover)]'} rounded-2xl p-8 text-center transition-all`}>
                                        <div className="mb-4 flex justify-center">
                                            {selectedFile ? <FileIcon size={48} color="var(--color-primary)" /> : <UploadIcon size={48} color="var(--color-text-muted)" />}
                                        </div>
                                        <p className={`text-lg font-bold ${selectedFile ? 'text-[var(--color-primary)]' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {selectedFile ? selectedFile.name : 'ファイルをドロップ'}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-2">PDF・画像（最大5MB）</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">学校名</label>
                                        <input
                                            type="text"
                                            value={formData.school}
                                            onChange={e => setFormData({ ...formData, school: e.target.value })}
                                            className="w-full border border-[var(--color-border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-secondary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
                                            placeholder="例: 防府中学校"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">実施日</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full border border-[var(--color-border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-secondary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">科目</label>
                                        <select
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full border border-[var(--color-border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-secondary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
                                        >
                                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">テスト種類</label>
                                        <select
                                            value={formData.testType}
                                            onChange={e => setFormData({ ...formData, testType: e.target.value })}
                                            className="w-full border border-[var(--color-border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-secondary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
                                        >
                                            {testTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">タグ (カンマ区切り)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full border border-[var(--color-border)] rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-[var(--color-bg-secondary)] focus:bg-[var(--color-bg-card)] text-[var(--color-text-primary)]"
                                        placeholder="例: 1学期, 難問"
                                    />
                                </div>
                            </div>

                            {/* Fixed Action Buttons */}
                            <div className="flex gap-4" style={{
                                padding: '16px',
                                paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                                borderTop: '1px solid #eee',
                                backgroundColor: 'var(--color-bg-card)'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 tap-target py-3 border border-[var(--color-border)] rounded-xl text-[var(--color-text-muted)] font-bold hover:bg-[var(--color-bg-hover)] transition-colors"
                                    disabled={isUploading}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 tap-target py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-[var(--color-primary-dark)] shadow-md transition-colors"
                                    disabled={isUploading}
                                >
                                    {isUploading ? '保存中...' : '保存する'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default TestArchive;
