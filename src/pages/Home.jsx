import React from 'react';
import { useState } from 'react';
import Camera from "../components/Camera.jsx";
import CaptureButton from '../components/CaptureButton';
import PhotoPreview from '../components/PhotoPreview.jsx';

const Home = () => {
  // construct state variables: take photo and preview
  const[photo, setPhoto] = useState(null);

  return (
    // when no photos taken, camera shown. when photos taken, photo previewed.
    <div>
      <h1>we take pictures on this page</h1>
      {!photo && <Camera setPhoto={setPhoto}/>}
      {photo && (
        <PhotoPreview photo={photo} setPhoto={setPhoto}/>
      )}
    </div>
  )
}

export default Home