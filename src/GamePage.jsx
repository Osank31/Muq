import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import {
    handleOnComplete,
    getRandom,
    getRandomFromIntervals,
    getRandomInitial,
    getRandomFinal,
    calculateAngle,
    camHandCoordinatesToGameHandCoordinates,
    getIncenter,
    callFunctionRandomly
} from './components/gameUtils.js';
import OpenHandImage from '/open_hand-removebg-preview.png';
import ClosedHandImage from '/close_hand-removebg-preview.png';
import { getHandedness, getHandState } from './components/handFunctions.js';
import RoomImage from '/ChatGPT Image May 16, 2025, 11_15_35 AM.png';
import mosquitoImage from '/ChatGPT Image May 11, 2025, 09_14_53 AM.png';
import mosquitoAudio from '/662970__ianfsa__mosquito-1-edit.wav'
import Dot from '/red_dot_5x5.png';
import Loading from './components/Loading.jsx';
import Timer from './components/Timer.jsx';

const GamePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const HandRef = useRef(null);
    const gameRef = useRef(null);
    const roomRef = useRef(null);
    const mosquitoRef = useRef(null);
    const DotRef = useRef(null);
    const handPositionRef = useRef({ x: 0, y: 0 });
    const prevHandStateRef = useRef('Open');
    const scoreRef = useRef({ score: 0 });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [mosquitoes, setMosquitoes] = useState([]);

    const mosquitoAudioInstancesRef = useRef([]);
    const prevLengthOfMosquitoArrayRef = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'm') {
                let [intialX, initialY, n] = getRandomInitial(gameRef.current.width, gameRef.current.height, 400, 400 / 1.5);
                let [targetX, targetY, n2] = getRandomFinal(gameRef.current.width, gameRef.current.height, 400, 400 / 1.5, n);
                const theta = calculateAngle(intialX, initialY, targetX, targetY);
                const newMosquito = {
                    id: Date.now(),
                    x: intialX,
                    y: initialY,
                    targetX,
                    targetY,
                    speed: getRandom(5, 15),
                    intialX,
                    initialY,
                    theta
                };

                setMosquitoes((prev) => [...prev, newMosquito]);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        // console.log(prevLengthOfMosquitoArrayRef.current);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    const stopAllMosquitoAudio = () => {
        mosquitoAudioInstancesRef.current.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        mosquitoAudioInstancesRef.current = [];
    };

    useEffect(() => {
        console.log(mosquitoes)
        const newMosquitoes = mosquitoes.length - prevLengthOfMosquitoArrayRef.current;

        if (newMosquitoes === 0) {
            return;
        }
        else if (newMosquitoes > 0) {
            for (let i = 0; i < newMosquitoes; i++) {
                const newAudio = new Audio(mosquitoAudio);
                console.log(newAudio)
                newAudio.play();
                mosquitoAudioInstancesRef.current.push(newAudio);
            }
        }
        else if (newMosquitoes < 0) {
            for (let i = 0; i < Math.abs(newMosquitoes); i++) {
                const audioToStop = mosquitoAudioInstancesRef.current.pop();
                if (audioToStop) {
                    audioToStop.pause();
                    audioToStop.currentTime = 0;
                }
            }
        }
        prevLengthOfMosquitoArrayRef.current = mosquitoes.length;
    }, [mosquitoes])

    useEffect(() => {
        //spawn mosquito randomly
        callFunctionRandomly(() => {
            let [intialX, initialY, n] = getRandomInitial(640, 480, 400, 400 / 1.5);
            let [targetX, targetY] = getRandomFinal(640, 480, 400, 400 / 1.5, n);
            const theta = calculateAngle(intialX, initialY, targetX, targetY);
            const newMosquito = {
                id: Date.now(),
                x: intialX,
                y: initialY,
                targetX: targetX,
                targetY: targetY,
                speed: getRandom(5, 10),
                intialX: intialX,
                initialY: initialY,
                theta,
            };

            setMosquitoes((prev) => [...prev, newMosquito]);
        });

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
            setLoading(false);
        };

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
        };

        // Main hand detection and drawing loop (no comments inside as requested)
        const detectHands = () => {
            const ctx = canvasRef.current.getContext('2d');
            const gameCtx = gameRef.current.getContext('2d');

            const detect = async () => {
                if (modelRef.current && canvasRef.current && videoRef.current && videoRef.current.readyState === 4) {
                    const predictions = await modelRef.current.estimateHands(videoRef.current);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    gameCtx.clearRect(0, 0, gameRef.current.width, gameRef.current.height);
                    ctx.save();
                    gameCtx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvasRef.current.width, 0);
                    ctx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    );
                    ctx.lineWidth = '6';
                    ctx.strokeStyle = 'red';
                    ctx.rect(
                        (canvasRef.current.width - gameRef.current.width) / 2,
                        (canvasRef.current.height - gameRef.current.height) / 2,
                        gameRef.current.width,
                        gameRef.current.height
                    );
                    ctx.stroke();
                    gameCtx.drawImage(
                        roomRef.current,
                        0,
                        0,
                        gameRef.current.width,
                        gameRef.current.height
                    );

                    if (predictions.length > 0) {
                        HandRef.current.style.visibility = '';
                        predictions[0].handedness = getHandedness(predictions[0].handedness);
                        predictions[0].handState = getHandState(
                            predictions[0].keypoints,
                            predictions[0].handedness
                        );

                        if (HandRef.current) {
                            if (predictions[0].handState === 'Open')
                                HandRef.current.src = OpenHandImage;
                            if (predictions[0].handState === 'Closed')
                                HandRef.current.src = ClosedHandImage;
                        }

                        predictions[0].keypoints.forEach((coordinates) => {
                            const [x, y] = [coordinates.x, coordinates.y];
                            ctx.beginPath();
                            ctx.arc(x, y, 10, 0, 2 * Math.PI);
                            ctx.fillStyle = 'red';
                            ctx.fill();
                        });

                        let [incenter_x, incenter_y] = getIncenter(
                            [predictions[0].keypoints[0].x, predictions[0].keypoints[0].y],
                            [predictions[0].keypoints[5].x, predictions[0].keypoints[5].y],
                            [predictions[0].keypoints[17].x, predictions[0].keypoints[17].y]
                        );

                        let [x, y] = camHandCoordinatesToGameHandCoordinates(
                            incenter_x,
                            incenter_y,
                            [canvasRef.current.width, canvasRef.current.height]
                        );
                        let size = 125;
                        let handWidth = size;
                        let handHeight = size / (HandRef.current.width / HandRef.current.height);

                        x = Math.max(0, Math.min(640 - handWidth, 640 - x));
                        y = Math.max(0, Math.min(480 - handHeight, y));

                        if (HandRef.current && HandRef.current.complete) {
                            let size = 125;
                            gameCtx.drawImage(
                                HandRef.current,
                                x,
                                y,
                                size,
                                size / (HandRef.current.width / HandRef.current.height)
                            );
                        };

                        handPositionRef.current = { x: x, y };
                    } else {
                        HandRef.current.style.visibility = 'hidden';
                    }

                    // console.log(predictions[0])
                    let currentHandState;
                    let justClosed;

                    if (predictions.length > 0) {
                        currentHandState = predictions[0].handState;
                        justClosed = prevHandStateRef.current === 'Open' && currentHandState === 'Closed';
                        prevHandStateRef.current = currentHandState;
                    }

                    // console.log(HandRef.current.width, HandRef.current.height)
                    setMosquitoes((mosquitoArray) => {
                        const movedMosquitoes = mosquitoArray
                            .map((mosquito) => {
                                const dx = mosquito.targetX - mosquito.intialX;
                                const dy = mosquito.targetY - mosquito.initialY;
                                const dist = dx ** 2 + dy ** 2;

                                if (dist === 0) return mosquito;

                                return {
                                    ...mosquito,
                                    x: mosquito.x + mosquito.speed * Math.cos(mosquito.theta),
                                    y: mosquito.y + mosquito.speed * Math.sin(mosquito.theta),
                                };
                            })
                            .filter((mosquito) => {
                                const nearTarget =
                                    Math.abs(mosquito.x - mosquito.targetX) > 5 ||
                                    Math.abs(mosquito.y - mosquito.targetY) > 5;
                                return nearTarget;
                            });

                        // Draw all remaining mosquitoes
                        movedMosquitoes.forEach((mosquito) => {
                            if (mosquitoRef.current && mosquitoRef.current.complete) {
                                gameCtx.drawImage(
                                    mosquitoRef.current,
                                    mosquito.x,
                                    mosquito.y,
                                    200,
                                    200 / 1.5
                                );
                            }
                        });

                        // killing logic
                        const filteredMosquitoes = movedMosquitoes.filter((mosquito) => {
                            const dx = mosquito.x - handPositionRef.current.x;
                            const dy = mosquito.y - handPositionRef.current.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (justClosed && distance <= 100) {
                                scoreRef.current.score = scoreRef.current.score + 1;
                                return false;
                            }
                            return true;
                        });

                        return filteredMosquitoes;
                    });
                    ctx.restore();
                }
                requestAnimationFrame(detect);
            };
            detect();
        };

        const init = async () => {
            await loadModelAndDetect();
            await setupCamera();
            detectHands();
        };

        init();
    }, []);
    // setLoading(prev=>prev=true)
    return loading ? (
        <Loading />
    ) : (
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
            <div
                style={{
                    background: '#fff',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(60,60,120,0.15)',
                    padding: '32px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    minWidth: '400px',
                }}
            >
                {/* Timer and Score */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: '12px',
                    }}
                >
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        color: '#6366f1',
                        background: '#eef2ff',
                        borderRadius: '12px',
                        padding: '8px 18px',
                        boxShadow: '0 2px 8px #6366f11a',
                    }}>
                        <Timer initialSeconds={120} onComplete={() => {
                            stopAllMosquitoAudio();
                            handleOnComplete(navigate, scoreRef.current.score)
                        }} />
                    </div>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#fff',
                        background: 'linear-gradient(90deg, #f43f5e 0%, #6366f1 100%)',
                        borderRadius: '12px',
                        padding: '8px 24px',
                        marginLeft: '16px',
                        boxShadow: '0 2px 8px #6366f11a',
                        letterSpacing: '1px',
                    }}>
                        🦟 Score: {scoreRef.current.score}
                    </div>
                </div>

                {/* Game Canvas */}
                <div style={{
                    position: 'relative',
                    width: '640px',
                    height: '480px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px #6366f11a',
                    background: '#f1f5f9',
                    marginBottom: '8px',
                }}>
                    <canvas
                        ref={gameRef}
                        width={640}
                        height={480}
                        style={{
                            width: '640px',
                            height: '480px',
                            border: '2px solid #6366f1',
                            borderRadius: '18px',
                            background: '#fff',
                            display: 'block',
                        }}
                    />
                    <img ref={HandRef} style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        pointerEvents: 'none',
                        zIndex: 3,
                        display: 'none',
                    }} />
                    <img
                        ref={mosquitoRef}
                        src={mosquitoImage}
                        height={50}
                        width={50}
                        style={{ visibility: 'hidden', position: 'absolute' }}
                    />
                    <img src={RoomImage} ref={roomRef} alt="" style={{ display: 'none' }} />
                    <img src={Dot} ref={DotRef} alt="" style={{ display: 'none' }} />

                </div>

                {/* Video Preview */}
                <button onClick={() => {
                    navigate('/test')
                }}>
                    <div
                        style={{
                            position: 'fixed',
                            top: '32px',
                            right: '32px',
                            width: '320px',
                            height: '240px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 12px #6366f11a',
                            background: '#fff',
                            zIndex: 1000,
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            width={1920}
                            height={1080}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '320px',
                                height: '240px',
                                opacity: 0,
                                zIndex: 1,
                            }}
                        />
                        <canvas
                            ref={canvasRef}
                            width={1920}
                            height={1080}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '320px',
                                height: '240px',
                                border: '1px solid #6366f1',
                                borderRadius: '12px',
                                zIndex: 2,
                                background: '#f1f5f9',
                            }}
                        />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default GamePage;
