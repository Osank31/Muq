import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import OpenHandImage from '/open_hand-removebg-preview.png'
import ClosedHandImage from '/close_hand-removebg-preview.png'
import { getHandedness, getHandState } from './components/handFunctions.js';
import Timer from './components/Timer.jsx';

const GamePage = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const HandRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const handleOnComplete = () => {
    console.log("Time up");
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
      console.log('Handpose model loaded.');
      setLoading(false)
    }

    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      console.log(videoRef)
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

      const detect = async () => {
        if (modelRef.current && videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await modelRef.current.estimateHands(videoRef.current);
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvasRef.current.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          if (predictions.length > 0) {
            HandRef.current.style.visibility = ''
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
          position: 'fixed',     // Stick to top-right of the viewport
          top: '10px',
          right: '10px',
          width: '320px',
          height: 'auto',        // allows timer to appear below
          // zIndex: 9999,
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
              width={640}
              height={480}
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
              width={640}
              height={480}
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
          <img ref={HandRef} />
        </div>
      </>
      )
  )
}

export default GamePage