import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import mosquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';

const NUM_MOSQUITOS = 4;
const ANGLE_OFFSET = 360 / NUM_MOSQUITOS;

const Loading = () => {
    const imgRefs = useRef([...Array(NUM_MOSQUITOS)].map(() => React.createRef()));
    const radius = 200; // px

    useEffect(() => {
        let angle = 0;
        const duration = 4;

        const animate = () => {
            angle += (360 / (60 * duration));
            if (angle >= 360) angle -= 360;

            imgRefs.current.forEach((ref, i) => {
                const img = ref.current;
                if (!img) return;
                const offset = angle + i * ANGLE_OFFSET;
                const rad = (offset * Math.PI) / 180;
                const x = radius * Math.sin(rad);
                const y = -radius * Math.cos(rad);
                gsap.set(img, {
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    rotation: 0,
                    transform: 'translate(-50%, -50%)'
                });
            });

            requestAnimationFrame(animate);
        };
        animate();
        return () => {};
    }, [radius]);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #c7d2fe 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Segoe UI, sans-serif',
            }}
        >
            <div style={{ position: 'relative', width: `${radius * 2 + 100}px`, height: `${radius * 2 + 100}px`, marginBottom: 24 }}>
                {imgRefs.current.map((ref, i) => (
                    <img
                        key={i}
                        ref={ref}
                        src={mosquitoImage}
                        alt="Mosquito"
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '0%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            height: '150px'
                        }}
                    />
                ))}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem',
                        fontWeight: 600,
                        color: '#6366f1',
                        letterSpacing: '1px',
                        zIndex: 1,
                    }}
                >
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default Loading;