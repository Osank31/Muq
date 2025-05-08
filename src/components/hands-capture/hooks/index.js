import { Ref, useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import {
    drawConnectors,
    drawLandmarks,
    drawRectangle,
} from '@mediapipe/drawing_utils';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
// import useKeyPointClassifier from '../hooks/useKeyPointClassifier';

// const CONFIGS = {
//   keypointClassifierLabels: ['Open', 'Closed', 'Pointing'],
// };


const maxVideoWidth = 960;
const maxVideoHeight = 540;

// interface IHandGestureLogic {
//     videoElement: Ref
//     canvasEl: Ref
// }

function useGestureRecognition({ videoElement, canvasElement }) {
    const hands = useRef();
    const camera = useRef();
    // const handsGesture = useRef([]);

    // const { processLandmark } = useKeyPointClassifier();

    async function onResults(results) {
        if (canvasElement.current) {
            const ctx = canvasElement.current.getContext('2d');

            ctx.save();
            ctx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
            ctx.drawImage(results.image, 0, 0, maxVideoWidth, maxVideoHeight);

            if (results.multiHandLandmarks) {
                for (const [index, landmarks] of results.multiHandLandmarks.entries()) {
                    // processLandmark(landmarks, results.image).then((val) => (handsGesture.current[index] = val));
                    // const landmarksX = landmarks.map((landmark) => landmark.x);
                    // const landmarksY = landmarks.map((landmark) => landmark.y);
                    // ctx.fillStyle = '#ff0000';
                    // ctx.font = '24px serif';
                    // ctx.fillText(
                        // CONFIGS.keypointClassifierLabels[handsGesture.current[index]],
                        // maxVideoWidth * Math.min(...landmarksX),
                        // maxVideoHeight * Math.min(...landmarksY) - 15
                    // );
                    // drawRectangle(ctx, {
                        // xCenter: Math.min(...landmarksX) + (Math.max(...landmarksX) - Math.min(...landmarksX)) / 2,
                        // yCenter: Math.min(...landmarksY) + (Math.max(...landmarksY) - Math.min(...landmarksY)) / 2,
                        // width: Math.max(...landmarksX) - Math.min(...landmarksX),
                        // height: Math.max(...landmarksY) - Math.min(...landmarksY),
                        // rotation: 0,
                    // },
                    //     {
                    //         fillColor: 'transparent',
                    //         color: '#ff0000',
                    //         lineWidth: 1,
                    //     }
                    // );
                    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                        color: '#00ffff',
                        lineWidth: 2,
                    });
                    drawLandmarks(ctx, landmarks, {
                        color: '#ffff29',
                        lineWidth: 1,
                    });
                }
            }
            ctx.restore();
        }
    }

    const loadHands = () => {
        try {
            hands.current = new Hands({ locateFile: (file) => {
                if (file === 'hands_solution_simd.wasm') {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.5.1675469248/hands_solution.wasm`;
                }
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.5.1675469248/${file}`;
            }});
            hands.current.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            hands.current.onResults(onResults);
            console.log("hand initialized")
        } catch (error) {
            console.error('Error initializing Hands:', error);
        }
    };

    useEffect(() => {
        (async function initCamera() {
            try {
                camera.current = new Camera(videoElement.current, {
                    onFrame: async () => {
                        await hands.current.send({ image: videoElement.current });
                    },
                    width: maxVideoWidth,
                    height: maxVideoHeight,
                });
                camera.current.start();
                console.log('Camera started');
            } catch (error) {
                console.error('Error starting camera:', error);
            }
        })()

        loadHands();
    }, []);

    return {maxVideoHeight, maxVideoWidth, canvasElement, videoElement};
}

export default useGestureRecognition;

