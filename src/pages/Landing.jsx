import React from 'react'
import logo from '../assets/logo.png'

const Landing = ({ onEnter }) => {
  return (
    <div>
      <img src={logo} className='logo'/>
      <button className='enter-button' onClick={onEnter}>Enter</button>
    </div>
  );
}

export default Landing