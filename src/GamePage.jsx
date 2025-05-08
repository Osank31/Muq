import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import OpenHandImage from '../public/open_hand-removebg-preview.png'
import ClosedHandImage from '../public/close_hand-removebg-preview.png'

const GamePage = () => {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const HandRef = useRef(null);

    function getHandedness(handedness) {
        if (handedness === 'Left')
            return 'Right'
        return 'Left'
    }

    function calculateDistance(coordinates1, coordinates2) {
        let [x1, y1] = [coordinates1.x, coordinates1.y];
        let [x2, y2] = [coordinates2.x, coordinates2.y];

        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    function getHandState(keypoints, handedness) {
        let answer = 'Open';
        let [thumb, indexFinger, ringFinger, middleFinger, littleFinger] = [false, false, false, false, false];

        if (keypoints[8].y > keypoints[5].y) {
            indexFinger = true;
        }
        if (keypoints[12].y > keypoints[9].y) {
            middleFinger = true;
        }
        if (keypoints[16].y > keypoints[13].y) {
            ringFinger = true;
        }
        if (keypoints[20].y > keypoints[17].y) {
            littleFinger = true;
        }

        if (handedness === "Right") {
            if (keypoints[4].x < keypoints[2].x) {
                thumb = true;
            }
        } else if (handedness === "Left") {
            if (keypoints[4].x > keypoints[2].x) {
                thumb = true;
            }
        }

        if (indexFinger && middleFinger && ringFinger && littleFinger && thumb) {
            answer = "Closed";
        }

        return answer;
    }

    useEffect(() => {
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
            console.log('Handpose model loaded.');
            detectHands();
        }

        const detectHands = () => {
            const ctx = canvasRef.current.getContext('2d');

            const detect = async () => {
                if (modelRef.current && videoRef.current && videoRef.current.readyState === 4) {
                    const predictions = await modelRef.current.estimateHands(videoRef.current);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(-canvasRef.current.width, 0);
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    if (predictions.length > 0) {

                        predictions[0].handedness = getHandedness(predictions[0].handedness);
                        predictions[0].handState = getHandState(predictions[0].keypoints, predictions[0].handedness);
                        // console.log((predictions[0]));

                        
                        if (HandRef.current) {
                            if (predictions[0].handState === 'Open')
                                HandRef.current.src = OpenHandImage;
                            if (predictions[0].handState === 'Closed')
                                HandRef.current.src = ClosedHandImage;
                        }
                        
                        console.log(HandRef.current.src)

                        predictions[0].keypoints.forEach(coordinates => {
                            const [x, y] = [coordinates.x, coordinates.y]
                            ctx.beginPath();
                            ctx.arc(x, y, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = 'red';
                            ctx.fill();
                        });
                    }
                    ctx.restore();
                }
                requestAnimationFrame(detect);
            }
            detect()
        }
        setupCamera().then(loadModelAndDetect);
    }, [])
    return (
        <div style={{ position: 'relative', width: 640, height: 480 }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width={640}
                height={480}
                style={{
                    position: 'absolute', top: -100, left: 0, visibility: 'hidden'
                }}
            />
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{visibility: 'hidden'}}
            />
            <img ref={HandRef}/>
        </div>
    )
}

export default GamePage