import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CamNotAllowed = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                navigate('/');
            } catch (error) {
                console.error('Camera permission denied', error);
                navigate('/cam-denied');
            }
        };
        getCameraPermission();
    }, []);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                color: '#333',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginBottom: 20 }}
            >
                <circle cx="12" cy="12" r="10" stroke="#ff9800" strokeWidth="2" fill="#fff3e0" />
                <path
                    d="M9 9l6 6M15 9l-6 6"
                    stroke="#ff9800"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <rect x="7" y="7" width="10" height="10" rx="2" stroke="#ff9800" strokeWidth="2" />
            </svg>
            <h2>Camera Access Needed</h2>
            <p style={{ maxWidth: 320, textAlign: 'center' }}>
                To continue, please allow camera permissions in your browser settings.
                <br />
                Refresh the page after granting access.
            </p>
            <button
                style={{
                    marginTop: 24,
                    padding: '10px 28px',
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
                    transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#fb8c00')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ff9800')}
            >
                Reset
            </button>
        </div>
    );
};

export default CamNotAllowed;
