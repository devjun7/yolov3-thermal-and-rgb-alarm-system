import React from 'react'


// 모든 상태에서 background color를 제어 용도

export default function StateBox({ className = "", color, style, ...rest }) {
  return (
    <div
      className={`state-box ${ className } ${ color }`}
      sytle={{ ...style }}
      { ...rest }
      />
  );
}
