// デバウンスで保存頻度を制限
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// テスト情報の保存（500ms後に保存）
export const saveTests = debounce((tests) => {
    try {
        localStorage.setItem('scheduledTests', JSON.stringify(tests));
    } catch (error) {
        console.error('保存エラー:', error);
    }
}, 500);

// アーカイブの保存（1000ms後に保存）を最適化
// ファイルデータは容量が大きいため、変更頻度が低いメタデータとは分離して保存することを検討すべきですが、
// 現状の要件（localStorageのみ）では、頻繁な書き込みを避けることが最重要です。
export const saveArchives = debounce((archives) => {
    try {
        localStorage.setItem('testArchives', JSON.stringify(archives));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('保存容量の上限を超えました。');
            // ユーザーへの通知はコンポーネント側で行う必要があるため、ここではエラーログのみ
        } else {
            console.error('アーカイブ保存エラー:', error);
        }
    }
}, 1000);

// データ読み込み
export const loadTests = () => {
    try {
        const saved = localStorage.getItem('scheduledTests');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const loadArchives = () => {
    try {
        const saved = localStorage.getItem('testArchives');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};
