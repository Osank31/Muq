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
    // Calculate incenter of triangle formed by three hand keypoints
    const getIncenter = (x1, y1, x2, y2, x3, y3) => {
        let a = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        let b = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2);
        let c = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2);

        return [
            (a * x1 + b * x2 + c * x3) / (a + b + c),
            (a * y1 + b * y2 + c * y3) / (a + b + c),
        ];
    }

    // Transform coordinates if needed (currently passthrough)
    const transformAxis = (x, y) => {
        return [x, y]
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'm') {
                const newMosquito = {
                    id: Date.now(),
                    x: 0,
                    y: 0,
                    targetX: -640,
                    targetY: -480,
                    speed: 5
                };

                setMosquitoes((prev) => [...prev, newMosquito]);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    // useEffect(() => {
    //     // console.log(...mosquitoes);
    // }, [mosquitoes]);

    useEffect(() => {
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

                        let incenter = getIncenter(
                            predictions[0].keypoints[0].x, predictions[0].keypoints[0].y,
                            predictions[0].keypoints[5].x, predictions[0].keypoints[5].y,
                            predictions[0].keypoints[17].x, predictions[0].keypoints[17].y
                        );

                        let handCoordinates = transformAxis(incenter[0], incenter[1]);

                        if (HandRef.current) {
                            if (predictions[0].handState === 'Open')
                                HandRef.current.src = OpenHandImage;
                            if (predictions[0].handState === 'Closed')
                                HandRef.current.src = ClosedHandImage;
                        }

                        if (HandRef.current && HandRef.current.complete) {
                            if (handCoordinates[0] >= 0 && handCoordinates[0] < 640 &&
                                handCoordinates[1] >= 0 && handCoordinates[1] < 480
                            ) {
                                if (HandRef.current.src.includes(`open_hand-removebg-preview.png`)) {
                                    gameCtx.drawImage(HandRef.current, handCoordinates[0], handCoordinates[1], 190.2435, 229.5)
                                }
                                else {
                                    gameCtx.drawImage(HandRef.current, handCoordinates[0], handCoordinates[1], 170.2435, 170.2435 / 1.26829)
                                }
                            }
                            else {
                                console.warn(`outside`)
                            }
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

                    // setMosquitoes(prevMosquitoes => {
                    //     const updated = prevMosquitoes.map(m => {
                    //         const dx = m.targetX - m.x;
                    //         const dy = m.targetY - m.y;
                    //         const dist = Math.sqrt(dx * dx + dy * dy);
                    //         if (dist < 2) return m;
                    //         return {
                    //             ...m,
                    //             x: m.x + (dx / dist) * m.speed,
                    //             y: m.y + (dy / dist) * m.speed
                    //         };
                    //     });

                    //     updated.forEach(m => {
                    //         gameCtx.drawImage(mosquitoRef.current, m.x, m.y, 50, 50);
                    //     });

                    //     return updated;
                    // });

                    setMosquitoes((mosquitoArray) => {
                        const updatedMosquitoArray = mosquitoArray.map(mosquito => {
                            const dx = mosquito.targetX - mosquito.x;;
                            const dy = mosquito.targetY - mosquito.y;

                            const dist = (dx ** 2 + dy ** 2);

                            if (dist < 1) {
                                // Set new random target when close to current one
                                return {
                                    ...mosquito,
                                };
                            }

                            const dirX = dx === 0 ? 0 : dx / Math.abs(dx);
                            const dirY = dy === 0 ? 0 : dy / Math.abs(dy);

                            return {
                                ...mosquito,
                                x: mosquito.x + dirX * mosquito.speed,
                                y: mosquito.y + dirY * mosquito.speed,
                            };
                        })

                        console.log(...updatedMosquitoArray)
                        updatedMosquitoArray.forEach((mosquito) => {
                            // console.log(mosquitoRef.current)
                            if (mosquitoRef.current && mosquitoRef.current.complete) {
                                gameCtx.drawImage(mosquitoRef.current, mosquito.x, mosquito.y, 500, 500);
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