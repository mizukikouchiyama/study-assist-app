import React, { memo } from 'react';

const CalendarDay = memo(({ date, tests, isToday, onClick, getSubjectEmoji }) => {
    if (!date) {
        return <div className="min-h-[80px] md:min-h-32 p-1 md:p-2 border rounded-xl bg-[var(--color-bg-secondary)] border-transparent transition-all"></div>;
    }

    return (
        <div
            onClick={() => onClick(date)}
            className={`
        min-h-[80px] md:min-h-32 p-1 md:p-2 border rounded-xl transition-all relative cursor-pointer
        bg-[var(--color-bg-card)] border-[var(--color-border)] 
        hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/20
        ${isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 dark:ring-offset-[var(--color-bg-card)]' : ''}
      `}
        >
            <span className={`block w-7 h-7 text-center leading-7 rounded-full text-xs md:text-sm font-bold mb-1 ${isToday ? 'bg-[var(--color-primary)] text-white' : (tests.length > 0 ? 'text-red-500' : 'text-[var(--color-text-secondary)]')}`}>
                {date.getDate()}
            </span>
            {tests.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                    {tests.map(test => (
                        <div key={test.id} className="text-[10px] md:text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md px-1 py-0.5 truncate border border-blue-200 dark:border-blue-800">
                            {getSubjectEmoji(test.subject)} {test.name}
                        </div>
                    ))}
                </div>
            )}
            {/* モバイル用ドットマーカー */}
            {tests.length > 0 && (
                <div className="md:hidden absolute top-2 right-2 flex gap-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
            )}
        </div>
    );
});

export default CalendarDay;
