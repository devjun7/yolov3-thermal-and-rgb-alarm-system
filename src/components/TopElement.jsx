import React from 'react'

export default function TopElement({ className="", style, ...rest }) {
  return (
    <div
      className={` top-element ${ className }`}
      style={{ ...style }}
      { ...rest }
      />
  );
}
