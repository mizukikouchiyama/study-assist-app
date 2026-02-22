import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { sendPomodoroStartNotification, sendPomodoroCompleteNotification } from '../services/slackService';
import { statsService } from '../services/statsService';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const [taskName, setTaskName] = useState('学習');
    const [isCompleted, setIsCompleted] = useState(false);

    // 最新のStateをRefで保持（イベントリスナー内で参照するため）
    const stateRef = useRef({ taskName, mode, isActive });
    useEffect(() => {
        stateRef.current = { taskName, mode, isActive };
    }, [taskName, mode, isActive]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft <= 0) {
            setIsActive(false);
            localStorage.removeItem('timerStartTime');
            localStorage.removeItem('timerDuration');
            handleCompleteCore(stateRef.current.taskName, stateRef.current.mode);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const startTime = localStorage.getItem('timerStartTime');
                const duration = localStorage.getItem('timerDuration');

                // タイマー稼働中として記録がある場合のみ計算
                if (startTime && duration && stateRef.current.isActive) {
                    const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
                    const newTimeLeft = parseInt(duration, 10) - elapsed;

                    if (newTimeLeft <= 0) {
                        setTimeLeft(0);
                        setIsActive(false);
                        stateRef.current.isActive = false; // 重複実行防止
                        localStorage.removeItem('timerStartTime');
                        localStorage.removeItem('timerDuration');
                        handleCompleteCore(stateRef.current.taskName, stateRef.current.mode);
                    } else {
                        setTimeLeft(newTimeLeft);
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleCompleteCore = (currentTaskName, currentMode) => {
        setIsCompleted(true);

        // 統計を保存
        statsService.savePomodoroSession({
            taskName: currentTaskName || '学習',
            duration: currentMode === 'work' ? 25 : 5,
            type: currentMode
        });

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ポモドーロ完了！', { body: 'お疲れ様でした。休憩しましょう。' });
        }

        if (currentMode === 'work') {
            sendPomodoroCompleteNotification(currentTaskName, 25);
        }
    };

    const toggleTimer = () => {
        if (!isActive) {
            // タイマー開始または再開時
            if (mode === 'work' && timeLeft === 25 * 60) {
                sendPomodoroStartNotification(taskName);
            }
            setIsCompleted(false);

            // バックグラウンド同期用に保存
            localStorage.setItem('timerStartTime', Date.now().toString());
            localStorage.setItem('timerDuration', timeLeft.toString());
        } else {
            // タイマー一時停止時
            localStorage.removeItem('timerStartTime');
            localStorage.removeItem('timerDuration');
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
        localStorage.removeItem('timerStartTime');
        localStorage.removeItem('timerDuration');
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
        localStorage.removeItem('timerStartTime');
        localStorage.removeItem('timerDuration');
    };

    return (
        <TimerContext.Provider value={{
            timeLeft,
            isActive,
            mode,
            taskName,
            isCompleted,
            setTaskName,
            toggleTimer,
            resetTimer,
            switchMode
        }}>
            {children}
        </TimerContext.Provider>
    );
};
