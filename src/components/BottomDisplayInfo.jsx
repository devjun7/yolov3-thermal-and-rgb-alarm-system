import React from 'react'

export default function BottomDisplayInfo({ fpsInfo, scaleInfo }) {
  return (
    <div className='bottom-display-info'>
        <div>fps: {fpsInfo}</div>
        <div>scale: {scaleInfo} </div>
    </div>
  );
}