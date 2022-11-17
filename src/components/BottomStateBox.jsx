import React from 'react'

export default function BottomStateBox({ className = "", color, style, ...rest }) {
  return (
    <div
      className={`bottom-state-box ${ className } ${ color }`}
      sytle={{ ...style }}
      { ...rest }
      />
  );
}