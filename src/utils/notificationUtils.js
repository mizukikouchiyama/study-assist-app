export const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
    }

    if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
};

export const sendNotification = (title, options) => {
    if (Notification.permission === 'granted') {
        new Notification(title, options);
    }
};
