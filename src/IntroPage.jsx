import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';
import MusquitoImage from '/pngtree-cartoon-mosquito-png-image_4031335-removebg-preview.png'


function IntroPage() {

    const boxRef = useRef(null);

    useEffect(() => {
        gsap.to(boxRef.current,
            {
                y: -100,
                duration: 1.5,
                // ease: 'bounce.out',
                repeat: -1,
                yoyo: true
            }
        );
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
        <>
            <div className="h-screen w-screen flex justify-center items-center flex-col  bg-blue-700">
                <img src={MusquitoImage} ref={boxRef}
                    style={{ height: '200px' }}
                />
                <h1 className="text-6xl text-white font-bold">Mosquito Game</h1>
                <div class="mx-3 text-gray-100 font-bold" id="Rules">
                    <h1 class="text-3xl">Rules:-</h1>
                    <ul class="text-xl list-disc">
                        <li class="my-6">Give access to your webcam</li>
                        <li class="my-6">Raise your hand for the system to detect hands</li>
                        <li class="my-6">Make sure you have good lighting</li>
                        <li class="my-6">Close your fist to kill musquitos</li>
                        <li class="my-6">Score as many points as you can!!!</li>
                    </ul>
                </div>
                

            </div>
        </>
    );
}

export default IntroPage;