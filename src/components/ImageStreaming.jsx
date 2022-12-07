import React from 'react'

export default function ImageStreaming({myImage}) {
    const name = myImage;
    const imgUrl = "/video/"+name+".png"
  return (
    <div className="mid-video">
        <img src = {imgUrl} alt={name} title={name} />
    </div>
  );
}