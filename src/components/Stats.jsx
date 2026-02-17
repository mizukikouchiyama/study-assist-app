import React from 'react';
import StatsDisplay from './StatsDisplay';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, StatsIcon } from './icons/Icons';

const Stats = () => {
    return (
        <div className="min-h-screen pb-20 animate-fadeIn bg-[var(--color-bg-primary)]">

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
                        <StatsIcon size={22} color="var(--color-primary)" />
                        Stats
                    </h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
                <StatsDisplay />
            </main>
        </div>
    );
};

export default Stats;
