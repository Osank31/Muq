import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';
import MusquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';
import BackgroundImage from '/Gemini_Generated_Image_fpo4mufpo4mufpo4.jpg';

function IntroPage() {
    const boxRef = useRef(null);

    useEffect(() => {
        gsap.to(boxRef.current, {
            y: -100,
            duration: 1.5,
            repeat: -1,
            yoyo: true
        });
    }, []);

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                console.error("Camera permission denied", error);
            }
        };
        getCameraPermission();
    }, []);

    return (
        <div
            className="relative flex flex-col items-center justify-center text-white min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <img
                src={MusquitoImage}
                ref={boxRef}
                className="h-80 w-80 object-contain"
                alt="Mosquito"
            />

            <div className="bg-black bg-opacity-60 p-6 rounded-2xl mt-8 max-w-lg text-left">
                <h1 className="text-3xl font-bold mb-4 text-yellow-400">Rules:</h1>
                <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>Give access to your webcam</li>
                    <li>Raise your hand for the system to detect hands</li>
                    <li>Make sure you have good lighting</li>
                    <li>Close your fist to kill mosquitoes</li>
                    <li>Score as many points as you can!!!</li>
                </ul>
            </div>
        </div>
    );
}

export default IntroPage;
