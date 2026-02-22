import React from 'react';

const base = (size, color) => ({
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: 1.5,
    strokeLinecap: 'round', strokeLinejoin: 'round',
});

export const HomeIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

export const TimerIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5" />
        <path d="M9 3h6" /><path d="M12 3v2" />
    </svg>
);

export const CalendarIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="8" cy="15" r="1.2" fill={color} />
        <circle cx="12" cy="15" r="1.2" fill={color} />
        <circle cx="16" cy="15" r="1.2" fill={color} />
    </svg>
);

export const ArchiveIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <polyline points="21,8 21,21 3,21 3,8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
);

export const StatsIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
);

export const BellIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

export const PlayIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)} fill={color}>
        <polygon points="5,3 19,12 5,21" />
    </svg>
);

export const PauseIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)} fill={color}>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

export const ResetIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <polyline points="1,4 1,10 7,10" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
);

export const PlusIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export const TrashIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <polyline points="3,6 5,6 21,6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

export const DownloadIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const UploadIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17,8 12,3 7,8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

export const SearchIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export const SunIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

export const MoonIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)} fill={color}>
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

export const ArrowRightIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12,5 19,12 12,19" />
    </svg>
);

export const ArrowLeftIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12,19 5,12 12,5" />
    </svg>
);

// ファイルアイコン（PDF Support用）
export const FileIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
    </svg>
);

// クロックアイコン（Reminder用）
export const ClockIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    </svg>
);

// トレンドアップアイコン（Streak用）
export const TrendingUpIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
        <polyline points="17,6 23,6 23,12" />
    </svg>
);

export const CoffeeIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

export const TomatoIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M12 4v4" />
        <path d="M12 8l-2.5-2.5" />
        <path d="M12 8l2.5-2.5" />
    </svg>
);

export const PartyIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M5.8 11.3L2 22l10.7-3.8" />
        <path d="M4 3h.01M22 6h.01M19 13h.01M22 22h.01M8 2h.01M16 2h.01" />
        <line x1="15.3" y1="8.7" x2="20.6" y2="3.4" />
        <line x1="11" y1="13" x2="15" y2="9" />
    </svg>
);

export const TrophyIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);

export const MedalIcon = ({ size = 24, color = 'currentColor', text }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="6" />
        <path d="M9 10L6 2l3-1 3 8" />
        <path d="M15 10l3-8-3-1-3 8" />
        {text && <text x="12" y="17" fontSize="8" textAnchor="middle" fill={color} strokeWidth="0" fontWeight="bold">{text}</text>}
    </svg>
);

export const BadgeIcon = ({ size = 24, color = 'currentColor', text }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" />
        {text && <text x="12" y="16" fontSize="12" textAnchor="middle" fill={color} strokeWidth="0" fontWeight="bold">{text}</text>}
    </svg>
);

export const SubjectMathIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <polygon points="4,20 20,20 4,4" />
        <circle cx="8" cy="16" r="1.5" />
    </svg>
);

export const SubjectEnglishIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
    </svg>
);

export const SubjectJapaneseIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export const SubjectScienceIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <path d="M9 3h6" />
        <path d="M10 3v4l-6 11a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3l-6-11V3" />
        <path d="M8 14h8" />
    </svg>
);

export const SubjectSocialIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg {...base(size, color)}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
    </svg>
);

export const CircleFilledIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="10" />
    </svg>
);
