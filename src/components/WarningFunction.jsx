import React from 'react'

export default function WarningFunction({ className = "", fontColor, style, ...rest }) {
  return (
    <div
      className={`warning-function ${ className } ${ fontColor }`}
      sytle={{ ...style }}
      { ...rest }
      />
  );
}