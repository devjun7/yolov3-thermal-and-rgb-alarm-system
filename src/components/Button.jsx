import React from 'react'

export default function Button({ className="", color, fontColor, style, ...rest }) {
  return (
    <button
      className={` input-btn ${ className } ${ color } ${ fontColor }`}
      style={{ ...style }}
      { ...rest }
      />
  );
  
}
