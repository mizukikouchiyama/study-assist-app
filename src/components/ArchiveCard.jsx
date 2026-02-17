import React, { memo } from 'react';
import { FileText, Trash2, Download } from 'lucide-react';

const ArchiveCard = memo(({ archive, onDownload, onDelete, getSubjectColor, index }) => {
    return (
        <div
            className="bg-[var(--color-bg-card)] rounded-xl shadow-[var(--shadow-md)] p-6 hover:shadow-lg transition-all border border-[var(--color-border)] hover:border-[var(--color-primary)] animate-slideUp hover-lift group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getSubjectColor(archive.subject)}`}>
                    {archive.subject}
                </div>
                <button
                    onClick={() => onDelete(archive.id)}
                    className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="flex items-center mb-4">
                <div className="bg-[var(--color-bg-secondary)] p-3 rounded-full mr-4 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    <FileText size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{archive.testType}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{archive.school}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">📅 {archive.date.replace(/-/g, '/')}</p>
                <div className="flex flex-wrap gap-2">
                    {archive.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-[10px] px-2 py-1 rounded border border-[var(--color-border)]">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onDownload(archive)}
                className="w-full flex items-center justify-center px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-smooth text-sm font-bold group-hover:bg-[var(--color-primary)] group-hover:text-white active-press"
            >
                <Download size={18} className="mr-2" /> ダウンロード
            </button>
        </div>
    );
});

export default ArchiveCard;
