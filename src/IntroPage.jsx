import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';
import MusquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';
import BackgroundImage from '/Gemini_Generated_Image_fpo4mufpo4mufpo4.jpg';
import Logo from '/mosquito_game_transparent (1).png'

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
            className="min-h-screen w-full bg-cover bg-center grid place-items-center"
            style={{
                backgroundImage: `url(${BackgroundImage})`
            }}
        >
            <div className="relative flex items-center justify-center">
                <img src={Logo} style={{ height: '350px' }} alt="Logo" />
                <img
                    src={MusquitoImage}
                    ref={boxRef}
                    className="h-80 w-80 object-contain absolute left-full ml-8"
                    alt="Mosquito"
                />
            </div>
        </div>
    );
}

export default IntroPage;
