import React from 'react'

// button (tod 연결, 경고발생 대기시간, 경고기능 켜짐시간) 제어 용도

export default function Button({ className="", style, ...rest }) {
  return (
    <button
      className={` input-btn ${ className }`}
      style={{ ...style }}
      { ...rest }
      />
  );
}
