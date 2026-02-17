// 統計データの保存・取得
export const statsService = {

    // ポモドーロ記録を保存
    savePomodoroSession: (session) => {
        const sessions = statsService.getPomodoroSessions();
        sessions.push({
            id: Date.now(),
            taskName: session.taskName,
            duration: session.duration, // 分
            type: session.type, // 'work' or 'break'
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
    },

    // ポモドーロ記録を取得
    getPomodoroSessions: () => {
        try {
            return JSON.parse(localStorage.getItem('pomodoroSessions') || '[]');
        } catch { return []; }
    },

    // 今日の統計
    getTodayStats: () => {
        const today = new Date().toISOString().split('T')[0];
        const sessions = statsService.getPomodoroSessions()
            .filter(s => s.date === today && s.type === 'work');
        return {
            count: sessions.length,
            totalMinutes: sessions.length * 25,
            tasks: [...new Set(sessions.map(s => s.taskName))]
        };
    },

    // 週間統計
    getWeeklyStats: () => {
        const sessions = statsService.getPomodoroSessions();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const daySessions = sessions.filter(
                s => s.date === dateStr && s.type === 'work'
            );
            days.push({
                date: dateStr,
                label: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
                count: daySessions.length,
                minutes: daySessions.length * 25
            });
        }
        return days;
    },

    // 月間統計
    getMonthlyStats: () => {
        const sessions = statsService.getPomodoroSessions();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthlySessions = sessions.filter(s => {
            const d = new Date(s.date);
            return d.getFullYear() === year &&
                d.getMonth() === month &&
                s.type === 'work';
        });
        return {
            totalCount: monthlySessions.length,
            totalMinutes: monthlySessions.length * 25,
            totalHours: Math.floor(monthlySessions.length * 25 / 60),
            avgPerDay: Math.round(monthlySessions.length / now.getDate() * 10) / 10
        };
    },

    // 科目別統計
    getSubjectStats: () => {
        const sessions = statsService.getPomodoroSessions()
            .filter(s => s.type === 'work');
        const subjectMap = {};
        sessions.forEach(s => {
            const key = s.taskName || 'その他';
            subjectMap[key] = (subjectMap[key] || 0) + 1;
        });
        return Object.entries(subjectMap)
            .map(([name, count]) => ({ name, count, minutes: count * 25 }))
            .sort((a, b) => b.count - a.count);
    },

    // 連続学習日数（ストリーク）
    getStreak: () => {
        const sessions = statsService.getPomodoroSessions()
            .filter(s => s.type === 'work');
        const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
        if (dates.length === 0) return 0;

        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        // 今日の分があるか確認（なければ昨日からカウント）
        const todayStr = current.toISOString().split('T')[0];
        if (dates[0] !== todayStr) {
            // 昨日やってなければ0
            const yesterday = new Date(current);
            yesterday.setDate(yesterday.getDate() - 1);
            if (dates[0] !== yesterday.toISOString().split('T')[0]) {
                return 0;
            }
            // 昨日からスタートならcurrentを昨日にセットしてループ開始
            current = yesterday;
        }

        for (const dateStr of dates) {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            const diff = Math.round(
                (current - date) / (1000 * 60 * 60 * 24)
            );
            if (diff === streak) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
};
