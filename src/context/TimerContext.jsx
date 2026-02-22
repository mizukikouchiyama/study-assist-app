import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { sendPomodoroStartNotification, sendPomodoroCompleteNotification } from '../services/slackService';
import { statsService } from '../services/statsService';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    // 1. Initialize state from localStorage
    const [timeLeft, setTimeLeft] = useState(() => {
        try {
            const savedState = localStorage.getItem('timerState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed.isActive && parsed.startTime) {
                    const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                    const newTime = parsed.initialTimeLeft - elapsed;
                    return newTime > 0 ? newTime : 0;
                }
                return parsed.timeLeft;
            }
        } catch (e) {
            console.error('Error parsing stored timerState:', e);
        }
        return 25 * 60;
    });

    const [isActive, setIsActive] = useState(() => {
        try {
            const savedState = localStorage.getItem('timerState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed.isActive && parsed.startTime) {
                    const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                    if (parsed.initialTimeLeft - elapsed <= 0) return false;
                }
                return parsed.isActive;
            }
        } catch (e) {
            console.error('Error parsing stored timerState:', e);
        }
        return false;
    });

    const [mode, setMode] = useState(() => {
        try {
            const savedState = localStorage.getItem('timerState');
            return savedState ? JSON.parse(savedState).mode || 'work' : 'work';
        } catch (e) {
            return 'work';
        }
    });

    const [taskName, setTaskName] = useState(() => {
        try {
            const savedState = localStorage.getItem('timerState');
            return savedState ? JSON.parse(savedState).taskName || '学習' : '学習';
        } catch (e) {
            return '学習';
        }
    });

    const [isCompleted, setIsCompleted] = useState(false);

    // Keep the latest state in a ref to use in handlers without recreating them
    const stateRef = useRef({ timeLeft, isActive, mode, taskName });

    const handleComplete = () => {
        setIsCompleted(true);
        setIsActive(false);
        const currentMode = stateRef.current.mode;
        const currentTask = stateRef.current.taskName;

        statsService.savePomodoroSession({
            taskName: currentTask || '学習',
            duration: currentMode === 'work' ? 25 : 5,
            type: currentMode
        });

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ポモドーロ完了！', { body: 'お疲れ様でした。休憩しましょう。' });
        }

        if (currentMode === 'work') {
            sendPomodoroCompleteNotification(currentTask, 25);
        }
    };

    // Main interval
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (isActive && timeLeft <= 0) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // Keep stateRef and localStorage up to date
    useEffect(() => {
        stateRef.current = { timeLeft, isActive, mode, taskName };

        let storedState = {};
        try {
            storedState = JSON.parse(localStorage.getItem('timerState') || '{}');
        } catch (e) { }

        const newState = {
            ...storedState,
            timeLeft,
            isActive,
            mode,
            taskName
        };

        if (isActive && !newState.startTime) {
            newState.startTime = Date.now();
            newState.initialTimeLeft = timeLeft;
        } else if (!isActive) {
            delete newState.startTime;
            delete newState.initialTimeLeft;
        }

        localStorage.setItem('timerState', JSON.stringify(newState));
    }, [timeLeft, isActive, mode, taskName]);

    // Visibility change handler for coming back to the app
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const savedState = localStorage.getItem('timerState');
                if (savedState) {
                    try {
                        const parsed = JSON.parse(savedState);
                        if (parsed.isActive && parsed.startTime) {
                            const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                            const newTimeLeft = parsed.initialTimeLeft - elapsed;

                            if (newTimeLeft <= 0) {
                                setTimeLeft(0);
                                setIsActive(false);
                                handleComplete();
                            } else {
                                setTimeLeft(newTimeLeft);
                            }
                        }
                    } catch (e) {
                        console.error('Failed to parse timer state on visibility change', e);
                    }
                }
            } else {
                // Going back to background: anchor the exact moment
                if (stateRef.current.isActive) {
                    const currentState = JSON.parse(localStorage.getItem('timerState') || '{}');
                    localStorage.setItem('timerState', JSON.stringify({
                        ...currentState,
                        startTime: Date.now(),
                        initialTimeLeft: stateRef.current.timeLeft
                    }));
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

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
        const initial = mode === 'work' ? 25 * 60 : 5 * 60;
        setTimeLeft(initial);

        let currentState = {};
        try {
            currentState = JSON.parse(localStorage.getItem('timerState') || '{}');
        } catch (e) { }

        delete currentState.startTime;
        delete currentState.initialTimeLeft;
        currentState.timeLeft = initial;
        currentState.isActive = false;
        localStorage.setItem('timerState', JSON.stringify(currentState));
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setIsCompleted(false);
        const initial = newMode === 'work' ? 25 * 60 : 5 * 60;
        setTimeLeft(initial);

        localStorage.setItem('timerState', JSON.stringify({
            mode: newMode,
            timeLeft: initial,
            isActive: false,
            taskName
        }));
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
