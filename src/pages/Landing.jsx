import React from 'react'

const Landing = ({ onEnter }) => {
  return (
    <div>
      <h1>Welcome to photo booth</h1>
      <button onClick={onEnter}>Enter</button>
    </div>
  );
}

export default Landing