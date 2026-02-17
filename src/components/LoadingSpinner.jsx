import React from 'react';

const LoadingSpinner = ({ message = '読み込み中...' }) => (
    <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-border)]
      border-t-[var(--color-primary)] animate-spin mb-4" />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {message}
        </p>
    </div>
);

export default LoadingSpinner;
