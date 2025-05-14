import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import OpenHandImage from '/open_hand-removebg-preview.png'
import ClosedHandImage from '/close_hand-removebg-preview.png'
import { getHandedness, getHandState } from './components/handFunctions.js';
import RoomImage from '/how-to-draw-a-room-featured-image-1200.webp'
import mosquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png'
import Timer from './components/Timer.jsx';
import { callFunctionRandomly } from './components/getRandomInterval.js'

const GamePage = () => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const HandRef = useRef(null);
    const gameRef = useRef(null);
    const roomRef = useRef(null);
    const mosquitoRef = useRef(null);
    // const mosquitoPositionRef = useRef({ x: 0, y: 0 });

    const [loading, setLoading] = useState(true);
    const [mosquitoes, setMosquitoes] = useState([]);



    const handleOnComplete = () => {
        // Timer complete handler
    }

    const getRandom = (a, b) => {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    };

    function getRandomFromIntervals(intervals) {
        if (!Array.isArray(intervals) || intervals.length === 0) {
            throw new Error("Intervals must be a non-empty array");
        }
        const intervalIndex = Math.floor(Math.random() * intervals.length);
        const [min, max] = intervals[intervalIndex];

        if (min > max) {
            throw new Error(`Invalid interval: [${min}, ${max}]`);
        }
        return Math.floor(Math.random() * (max - min) + min);
    }


    const getRandomInitial = (canvasWidth, canvasHeight, dx, dy) => {
        let n = Math.floor(Math.random() * (8 - 1 + 1) + 1);
        switch (n) {
            case 1:
                var x = getRandom(-dx, 0);
                var y = getRandom(-dy, 0);
                return [x, y, n];
            case 2:
                var x = getRandom(-dx, 0);
                var y = getRandom(0, canvasHeight);
                return [x, y, n];
            case 3:
                var x = getRandom(-dx, 0);
                var y = getRandom(canvasHeight, canvasHeight + dy);
                return [x, y, n];
            case 4:
                var x = getRandom(0, canvasWidth);
                var y = getRandom(canvasHeight, canvasHeight + dy);
                return [x, y, n];
            case 5:
                var x = getRandom(canvasWidth, canvasWidth + dx);
                var y = getRandom(canvasHeight, canvasHeight + dy);
                return [x, y, n];
            case 6:
                var x = getRandom(canvasWidth, canvasWidth + dx);
                var y = getRandom(0, canvasHeight);
                return [x, y, n];
            case 7:
                var x = getRandom(canvasWidth, canvasWidth + dx);
                var y = getRandom(-dy, 0);
                return [x, y, n];
            case 8:
                var x = getRandom(0, canvasWidth);
                var y = getRandom(-dy, 0);
                return [x, y, n];
        }
    }

    const getRandomFinal = (canvasWidth, canvasHeight, dx, dy, n) => {
        switch (n) {
            case 1:
                var n2 = getRandom(4, 6);
                switch (n2) {
                    case 4:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 5:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 6:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                }
                break;
            case 2:
                var n2 = getRandom(4, 8);
                switch (n2) {
                    case 4:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 5:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 6:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 7:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 8:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                }
                break;
            case 3:
                var n2 = getRandom(6, 8);
                switch (n2) {
                    case 6:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 7:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 8:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                }
                break;
            case 4:
                var n2 = getRandomFromIntervals([[6, 8], [1, 2]])
                switch (n2) {
                    case 1:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 2:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 6:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 7:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 8:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];

                }
                break;
            case 5:
                var n2 = getRandomFromIntervals([[1, 2], [8, 8]]);
                switch (n2) {
                    case 1:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 2:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 8:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                }
                break;
            case 6:
                var n2 = getRandomFromIntervals([[1, 4], [8, 8]]);
                switch (n2) {
                    case 1:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                    case 2:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 3:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 4:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 8:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(-dy, 0);
                        return [x, y, n2];
                }
                break;
            case 7:
                var n2 = getRandom(2, 4);
                switch (n2) {
                    case 2:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 3:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 4:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                }
                break;
            case 8:
                var n2 = getRandom(2, 6);
                switch (n2) {
                    case 2:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                    case 3:
                        var x = getRandom(-dx, 0);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 4:
                        var x = getRandom(0, canvasWidth);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 5:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(canvasHeight, canvasHeight + dy);
                        return [x, y, n2];
                    case 6:
                        var x = getRandom(canvasWidth, canvasWidth + dx);
                        var y = getRandom(0, canvasHeight);
                        return [x, y, n2];
                }
                break;
            default:
                return [640, 480, -1];
        }
    }

    const calculateAngle = (x1, y1, x2, y2) => {
        let theta = Math.atan2(y2 - y1, x2 - x1)
        return theta;
    }

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.key === 'm') {
    //             let [intialX, initialY, n] = getRandomInitial(640, 480, 400, 400 / 1.5);
    //             let [targetX, targetY, n2] = getRandomFinal(640, 480, 400, 400 / 1.5, n)
    //             const theta = calculateAngle(intialX, initialY, targetX, targetY);
    //             // console.log(intialX, initialY)
    //             // console.log(targetX, targetY)
    //             const newMosquito = {
    //                 id: Date.now(),
    //                 x: intialX,
    //                 y: initialY,
    //                 targetX: targetX,
    //                 targetY: targetY,
    //                 speed: getRandom(5, 10),
    //                 intialX: intialX,
    //                 initialY: initialY,
    //                 theta
    //             };

    //             setMosquitoes((prev) => [...prev, newMosquito]);
    //         }
    //     }
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, [])

    useEffect(() => {
        callFunctionRandomly(() => {
            let [intialX, initialY, n] = getRandomInitial(640, 480, 400, 400 / 1.5);
            let [targetX, targetY] = getRandomFinal(640, 480, 400, 400 / 1.5, n)
            const theta = calculateAngle(intialX, initialY, targetX, targetY);
            // console.log(intialX, initialY)
            // console.log(targetX, targetY)
            const newMosquito = {
                id: Date.now(),
                x: intialX,
                y: initialY,
                targetX: targetX,
                targetY: targetY,
                speed: getRandom(5, 10),
                intialX: intialX,
                initialY: initialY,
                theta
            };

            setMosquitoes((prev) => [...prev, newMosquito]);
        })

        const loadModelAndDetect = async () => {
            await tf.setBackend('webgl');
            await tf.ready();
            modelRef.current = await handPoseDetection.createDetector(
                handPoseDetection.SupportedModels.MediaPipeHands,
                {
                    runtime: 'tfjs',
                    modelType: 'full',
                    maxHands: 2,
                }
            );
            setLoading(false)
        }

        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                return new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        resolve();
                    };
                });
            }
        }

        // Main hand detection and drawing loop (no comments inside as requested)
        const detectHands = () => {
            const ctx = canvasRef.current.getContext('2d');
            const gameCtx = gameRef.current.getContext('2d');

            const detect = async () => {
                if (modelRef.current && videoRef.current && videoRef.current.readyState === 4) {
                    const predictions = await modelRef.current.estimateHands(videoRef.current);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    gameCtx.clearRect(0, 0, gameRef.current.width, gameRef.current.height)
                    ctx.save();
                    gameCtx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvasRef.current.width, 0);
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    gameCtx.drawImage(roomRef.current, 0, 0, gameRef.current.width, gameRef.current.height)

                    if (predictions.length > 0) {
                        HandRef.current.style.visibility = ''
                        predictions[0].handedness = getHandedness(predictions[0].handedness);
                        predictions[0].handState = getHandState(predictions[0].keypoints, predictions[0].handedness);

                        if (HandRef.current) {
                            if (predictions[0].handState === 'Open')
                                HandRef.current.src = OpenHandImage;
                            if (predictions[0].handState === 'Closed')
                                HandRef.current.src = ClosedHandImage;
                        }



                        predictions[0].keypoints.forEach(coordinates => {
                            const [x, y] = [coordinates.x, coordinates.y]
                            ctx.beginPath();
                            ctx.arc(x, y, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = 'red';
                            ctx.fill();
                        });
                    }
                    else {
                        HandRef.current.style.visibility = 'hidden';
                    }

                    setMosquitoes((mosquitoArray) => {
                        const updatedMosquitoArray = mosquitoArray.map(mosquito => {

                            const dx = mosquito.targetX - mosquito.intialX;
                            const dy = mosquito.targetY - mosquito.initialY;

                            const dist = (dx ** 2 + dy ** 2);

                            if (dist === 0) {
                                return {
                                    ...mosquito,
                                };
                            }
                            return {
                                ...mosquito,
                                x: mosquito.x + mosquito.speed * Math.cos(mosquito.theta),
                                y: mosquito.y + mosquito.speed * Math.sin(mosquito.theta),
                            };
                        })
                            .filter(mosquito => !(Math.abs(mosquito.x - mosquito.targetX) < 5 && Math.abs(mosquito.y - mosquito.targetY) < 5));
                        if (updatedMosquitoArray.length > 0)
                            // console.log(`x=${updatedMosquitoArray[0].x}, y=${updatedMosquitoArray[0].y}`)
                            updatedMosquitoArray.forEach((mosquito) => {
                                if (mosquitoRef.current && mosquitoRef.current.complete) {
                                    gameCtx.drawImage(mosquitoRef.current, (mosquito.x), (mosquito.y), 200, 200 / 1.5);
                                }
                            })
                        return updatedMosquitoArray;
                    })

                    ctx.restore();
                }
                requestAnimationFrame(detect);
            }
            detect()
        }

        const init = async () => {
            await loadModelAndDetect();
            await setupCamera();
            detectHands();
        };

        init();
    }, [])

    return (
        loading ?
            (<>Loading</>)
            :
            (<>
                {/* Video and overlay canvas (top right) */}
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    width: '320px',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                    <div style={{
                        position: 'relative',
                        width: '320px',
                        height: '240px',
                    }}>
                        {/* Hidden video element for webcam */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width={1280}
                            height={720}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '320px',
                                height: '240px',
                                opacity: 0,
                                zIndex: 1
                            }}
                        />
                        {/* Canvas for drawing video and keypoints */}
                        <canvas
                            ref={canvasRef}
                            width={1280}
                            height={720}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '320px',
                                height: '240px',
                                border: '1px solid black',
                                zIndex: 2
                            }}
                        />
                    </div>

                    {/* Countdown timer */}
                    <Timer initialSeconds={10} onComplete={handleOnComplete} />

                </div>

                {/* Main game canvas and hidden assets */}
                <div>
                    {/* Hidden room background image */}
                    <img src={RoomImage} ref={roomRef} alt="" style={{ display: 'none' }} />
                    {/* Game canvas where hand image is drawn */}
                    <canvas ref={gameRef} width={640} height={480} style={{ border: "2px solid black" }} />
                    {/* Hand image element (used for drawing on canvas) */}
                    <img ref={HandRef} />
                    <img ref={mosquitoRef} src={mosquitoImage} height={50} width={50} />
                </div>
            </>
            )
    )
}

export default GamePage