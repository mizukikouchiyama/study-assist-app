import React, { createContext, useState, useContext, useEffect } from 'react';
import { sendPomodoroStartNotification, sendPomodoroCompleteNotification } from '../services/slackService';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const [taskName, setTaskName] = useState('学習');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        setIsCompleted(true);
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ポモドーロ完了！', { body: 'お疲れ様でした。休憩しましょう。' });
        }

        if (mode === 'work') {
            sendPomodoroCompleteNotification(taskName, 25);
        }
    };

    const toggleTimer = () => {
        if (!isActive) {
            if (mode === 'work' && timeLeft === 25 * 60) {
                sendPomodoroStartNotification(taskName);
            }
            setIsCompleted(false);
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
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
