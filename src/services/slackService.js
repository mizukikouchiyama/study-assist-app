const SLACK_WEBHOOK_PATH = import.meta.env.VITE_SLACK_WEBHOOK_URL
    ? import.meta.env.VITE_SLACK_WEBHOOK_URL.replace('https://hooks.slack.com/services', '')
    : '';

const PROXY_URL = `/api/slack${SLACK_WEBHOOK_PATH}`;

/**
 * Sends a message to Slack via Webhook (via Proxy).
 * @param {string} text - The main text of the message.
 * @param {Array} blocks - Optional Slack blocks for rich formatting.
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function sendSlackMessage(text, blocks = null) {
    console.log('=== Slack通知（プロキシ経由） ===');
    console.log('プロキシURL:', PROXY_URL);

    if (!SLACK_WEBHOOK_PATH) {
        console.error('❌ Webhook URL未設定');
        throw new Error('Slack Webhook URL is not configured');
    }

    const payload = { text, ...(blocks && { blocks }) };

    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('レスポンス:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ エラー:', errorText);
            throw new Error(`Slack API error: ${response.status}`);
        }

        console.log('✅ 送信成功！');
        return { success: true };
    } catch (error) {
        console.error('❌ 送信失敗:', error);
        throw error;
    }
}

/**
 * Sends a simplified test reminder notification.
 * @param {Object} test - Test object containing name, subject, date, range, etc.
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function sendTestReminderNotification(test) {
    const daysText = test.daysUntil === 0 ? '今日' : `あと${test.daysUntil}日`;
    const message = `🔔 *テストリマインダー*: ${test.name} (${test.subject}) まで ${daysText} です！\n📅 日付: ${test.date}\n📚 範囲: ${test.range || '未定'}`;

    return sendSlackMessage(message);
}

export async function sendPomodoroStartNotification(taskName = '集中') {
    const message = `🍅 ポモドーロ開始: *${taskName}* に集中します！`;
    return sendSlackMessage(message);
}

export async function sendPomodoroCompleteNotification(taskName = '集中', duration = 25) {
    const message = `✅ ポモドーロ完了: *${taskName}* (${duration}分) を達成しました！休憩しましょう ☕`;
    return sendSlackMessage(message);
}
