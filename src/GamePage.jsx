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
import Timer from './components/Timer.jsx';

const GamePage = () => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const HandRef = useRef(null);
    const gameRef = useRef(null)
    const roomRef = useRef(null);

    const [loading, setLoading] = useState(true);

    const handleOnComplete = () => {
        // console.log("Time up");
    }

    const getIncenter = (x1, y1, x2, y2, x3, y3) => {
        let a = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        let b = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2);
        let c = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2);

        return [
            (a * x1 + b * x2 + c * x3) / (a + b + c),
            (a * y1 + b * y2 + c * y3) / (a + b + c),
        ];
    }

    const transformAxis = (x, y) => {
        // return [(x - 310), (y - 330)]
        return [(x - 310), (y - 330)]
        // return [x,y]
    }

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
            // console.log('Handpose model loaded.');
            setLoading(false)
        }

        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            });
            // console.log(videoRef)
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                return new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        resolve();
                    };
                });
            }
        }

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
                    // ctx.scale(-1, 1);
                    // ctx.translate(-canvasRef.current.width, 0);
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    gameCtx.drawImage(roomRef.current, 0, 0, gameRef.current.width, gameRef.current.height)
                    if (predictions.length > 0) {
                        HandRef.current.style.visibility = ''
                        predictions[0].handedness = getHandedness(predictions[0].handedness);
                        predictions[0].handState = getHandState(predictions[0].keypoints, predictions[0].handedness);

                        let incenter = getIncenter(predictions[0].keypoints[0].x, predictions[0].keypoints[0].y, predictions[0].keypoints[5].x, predictions[0].keypoints[5].y, predictions[0].keypoints[17].x, predictions[0].keypoints[17].y);

                        let handCoordinates = transformAxis(incenter[0], incenter[1]);
                        console.log(handCoordinates)

                        if (HandRef.current) {
                            if (predictions[0].handState === 'Open')
                                HandRef.current.src = OpenHandImage;
                            if (predictions[0].handState === 'Closed')
                                HandRef.current.src = ClosedHandImage;
                        }

                        // console.log(incenter)
                        // console.log(HandRef.current.src)

                        if (HandRef.current && HandRef.current.complete) {
                            if (handCoordinates[0] >= 0 && handCoordinates[0] < 640 &&
                                handCoordinates[1] >= 0 && handCoordinates[1] < 480
                            ) {
                                gameCtx.drawImage(HandRef.current, handCoordinates[0], handCoordinates[1], 124.2, 150)
                            }
                            else{
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
                                zIndex: 1
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
                                border: '1px solid black',
                                zIndex: 2
                            }}
                        />
                    </div>

                    <Timer initialSeconds={10} onComplete={handleOnComplete} />

                </div>


                <div>
                    <img src={RoomImage} ref={roomRef} alt="" style={{ display: 'none' }} />
                    <canvas ref={gameRef} width={640} height={480} style={{ border: "2px solid black" }} />
                    <img ref={HandRef} />
                </div>
            </>
            )
    )
}

export default GamePage