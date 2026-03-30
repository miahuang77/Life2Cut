import React from 'react';
import { useState } from 'react';
import Camera from "../components/Camera.jsx";
import CaptureButton from '../components/CaptureButton';
import PhotoPreview from '../components/PhotoPreview.jsx';
import logo from '../assets/logo.png';

const Home = () => {
  // construct state variables: take photo and preview
  const[photo, setPhoto] = useState(null);

  return (
    // when no photos taken, camera shown. when photos taken, photo previewed.
    <div>
      <img src={logo} className='home-logo' />
      {!photo && <Camera setPhoto={setPhoto}/>}
      {photo && (
        <PhotoPreview photo={photo} setPhoto={setPhoto}/>
      )}
    </div>
  )
}

export default Home