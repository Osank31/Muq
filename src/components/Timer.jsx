import React, { useState, useEffect } from 'react';

const Timer = ({ initialSeconds, onComplete }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds === 0) {
            if (onComplete) onComplete();
            return;
        }

        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div>
            <h1>{seconds > 0 ? formatTime(seconds) : "Time's up!"}</h1>
        </div>
    );
};

export default Timer;
