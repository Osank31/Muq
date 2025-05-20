import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import MusquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';
import Logo from '/mosquito_game_transparent (1).png';
import BgMusic from '/jazzyfrenchy.mp3';
import { useNavigate } from 'react-router-dom';

function IntroPage() {
    const boxRef = useRef(null);
    const navigate = useNavigate();
    const audioRef = useRef(null);

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                if (audioRef.current) {
                    audioRef.current.play();
                }
            } catch (error) {
                console.error('Camera permission denied', error);
                navigate('/cam-denied');
            }
        };
        getCameraPermission();

        // Mosquito animation (same as Loading.jsx, but for one mosquito)
        let angle = 0;
        const radius = 200;
        const duration = 4;
        let frameId;

        const animate = () => {
            angle += 360 / (60 * duration);
            if (angle >= 360) angle -= 360;

            if (boxRef.current) {
                const rad = (angle * Math.PI) / 180;
                const x = radius * Math.sin(rad);
                const y = -radius * Math.cos(rad);
                gsap.set(boxRef.current, {
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    rotation: 0,
                    transform: 'translate(-50%, -50%)',
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
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-200 grid place-items-center">
            {/* Background music */}
            <audio src={BgMusic} autoPlay loop controls={false} hidden ref={audioRef} />
            <div
                className="relative flex flex-col items-center justify-center"
                style={{ width: 500, height: 500 }}
            >
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
                {/* Game Rules Section */}
                <div
                    className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 mb-8 mt-4 w-full max-w-md text-gray-800"
                    style={{ zIndex: 5 }}
                >
                    <h2 className="text-xl font-bold mb-2">Game Rules</h2>
                    <ul className="list-disc list-inside text-base space-y-1">
                        <li>Raise your hand and close your fist to kill the mosquitoes</li>
                        <li>Allow camera permission for better experience</li>
                        <li>
                            Make sure to have proper lighting so that our model can detect your
                            hands clearly.
                        </li>
                        <li>Test your environment to make sure it works</li>
                    </ul>
                </div>
                {/* End Game Rules Section */}
                <div style={{ height: '32px' }} /> {/* Add a gap of 32px */}
                <div className="flex flex-row gap-4" style={{ zIndex: 10 }}>
                    <button
                        className="px-10 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 active:from-indigo-700 active:via-purple-700 active:to-pink-700 text-white text-lg font-bold shadow-xl transition-all duration-200 ease-in-out ring-4 ring-indigo-200 hover:ring-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 transform hover:scale-105"
                        onClick={() => {
                            navigate('/game');
                        }}
                    >
                        <span className="drop-shadow-lg tracking-wide">🎮 Start Game</span>
                    </button>
                    <button
                        className="px-10 py-3 rounded-lg bg-gradient-to-r from-gray-400 via-blue-400 to-green-400 hover:from-gray-500 hover:via-blue-500 hover:to-green-500 active:from-gray-600 active:via-blue-600 active:to-green-600 text-white text-lg font-bold shadow-xl transition-all duration-200 ease-in-out ring-4 ring-blue-200 hover:ring-green-300 focus:outline-none focus:ring-4 focus:ring-green-400 transform hover:scale-105"
                        onClick={() => {
                            navigate('/test');
                        }}
                    >
                        <span className="drop-shadow-lg tracking-wide">🧪 Test Environment</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IntroPage;
