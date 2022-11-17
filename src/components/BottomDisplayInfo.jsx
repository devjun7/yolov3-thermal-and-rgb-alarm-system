import React from 'react'

// state 별로 분리하기
// 컴포넌트 간 간격 조정하기 (css)
export default function BottomDisplayInfo({ fpsInfo, scaleInfo }) {
  return (
    <div className='bottom-display-info'>
        <div>fps: {fpsInfo}</div>
        <div>scale: {scaleInfo} </div>
    </div>
  );
}