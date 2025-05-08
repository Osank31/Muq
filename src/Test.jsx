import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';

const HandPoseCanvas = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

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
    };

    const loadModelAndDetect = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      modelRef.current = await handpose.load();
      console.log('Handpose model loaded.');
      detectHands();
    };

    const detectHands = () => {
      const ctx = canvasRef.current.getContext('2d');

      const detect = async () => {
        if (modelRef.current && videoRef.current.readyState === 4) {
          const predictions = await modelRef.current.estimateHands(videoRef.current);
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          if (predictions.length > 0) {
            predictions.forEach(prediction => {
              console.log(prediction)
              prediction.landmarks.forEach(point => {
                const [x, y] = point;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'lime';
                ctx.fill();
              });
            });
          }
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    setupCamera().then(loadModelAndDetect);
  }, []);

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={640}
        height={480}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default HandPoseCanvas;
