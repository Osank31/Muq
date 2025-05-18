import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import MusquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';
import BackgroundImage from '/Gemini_Generated_Image_fpo4mufpo4mufpo4.jpg';
import Logo from '/mosquito_game_transparent (1).png';
import { useNavigate } from 'react-router-dom';

function IntroPage() {
    const boxRef = useRef(null);
    const navigate=useNavigate();

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                console.error('Camera permission denied', error);
                navigate('/cam-denied')
            }
        };
        getCameraPermission();

        // Mosquito animation (same as Loading.jsx, but for one mosquito)
        let angle = 0;
        const radius = 200;
        const duration = 4;
        let frameId;

        const animate = () => {
            angle += (360 / (60 * duration));
            if (angle >= 360) angle -= 360;

            if (boxRef.current) {
                const rad = (angle * Math.PI) / 180;
                const x = radius * Math.sin(rad);
                const y = -radius * Math.cos(rad);
                gsap.set(boxRef.current, {
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    rotation: 0,
                    transform: 'translate(-50%, -50%)'
                });
            }

            frameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-200 grid place-items-center"
        >
            <div className="relative flex flex-col items-center justify-center" style={{ width: 500, height: 500 }}>
                <img src={Logo} style={{ height: '350px', zIndex: 1 }} alt="Logo" />
                <img
                    src={MusquitoImage}
                    ref={boxRef}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        height: '150px',
                        zIndex: 2,
                    }}
                    alt="Mosquito"
                />
                <button
                    className="mt-12 px-8 py-3 rounded-sm bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-lg font-semibold shadow-lg transition-all duration-200 ease-in-out ring-2 ring-indigo-300 hover:ring-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                    style={{ zIndex: 10 }}
                    onClick={() => {
                        navigate('/game');
                    }}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}

export default IntroPage;
