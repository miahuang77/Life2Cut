import React from 'react'
import {useRef, useEffect, useState} from "react";
const FRAME_WIDTH = 1176;
const FRAME_HEIGHT = 1470;
const HALF = FRAME_HEIGHT / 2;

const Camera = ({ setPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [photostage, setPhotostage] = useState(0);
  const photostageRef = useRef(0);
  const [firstPhoto, setFirstPhoto] = useState(null);

// display the webcam video
  const getVideo = () => {
    navigator.mediaDevices
    .getUserMedia ({
      video: { width: FRAME_WIDTH, height: FRAME_HEIGHT}})
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error(err);
      })
  }
// count down
const startCountdown = () => {
  let count = 3;
  setCountdown(count);
  const intervalId = setInterval(() => {
    count--;

    if (count > 0) {
      setCountdown(count);
    } else {
      clearInterval(intervalId);
      setCountdown(null);
      takePhoto();
    }
  }, 1000);
};
// take photo
  const takePhoto = () => {
    const stage = photostageRef.current;
    let video = videoRef.current;
    let canvas = canvasRef.current;

    if (stage === 0) {
      canvas.width = FRAME_WIDTH;
      canvas.height = FRAME_HEIGHT;
    }

    let ctx = canvas.getContext('2d');

    const yOffset = stage === 0 ? 0 : HALF;

    const width = video.videoWidth;
    const height = video.videoHeight;

    const targetAspect = FRAME_WIDTH / HALF;
    const videoAspect = width / height;

    let sx, sy, sw, sh;

  if (videoAspect > targetAspect) {
    sh = height;
    sw = height * targetAspect;
    sx = (width - sw) / 2;
    sy = 0;
  } else {
    sw = width;
    sh = width / targetAspect;
    sx = 0;
    sy = (height - sh) / 2;
  }

  ctx.save();
  ctx.translate(FRAME_WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, FRAME_WIDTH, HALF);
  ctx.restore();

  if (stage === 0) {
    // Extract the top half as a preview image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = FRAME_WIDTH;
    tempCanvas.height = HALF;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, FRAME_WIDTH, HALF, 0, 0, FRAME_WIDTH, HALF);
    setFirstPhoto(tempCanvas.toDataURL('image/png'));
    photostageRef.current = 1;
    setPhotostage(1);
  } else if (stage === 1) {
    const imageDataUrl = canvas.toDataURL('image/png');
    setPhoto(imageDataUrl);
  }
}

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <div className="camera">
      <div className="camera-frame">
        {firstPhoto && (
          <img src={firstPhoto} alt="First capture" className="camera-first-photo" />
        )}
        <video ref={videoRef} className={`camera-video ${photostage === 0 ? 'camera-video--top' : 'camera-video--bottom'}`} />
        {countdown && (
          <div className={`countdown ${photostage === 0 ? 'countdown--top' : 'countdown--bottom'}`}>{countdown}</div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={startCountdown} className="camera-snap-btn">SNAP!</button>
    </div>
  )
}

export default Camera