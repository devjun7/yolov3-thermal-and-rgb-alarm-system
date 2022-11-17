import React from 'react'

// myImage를 빠르게 갱신하여 영상처럼 보이게 할 수 있음
// img 태그 css 클래스 하나 만들기

export default function ImageStreaming({myImage}) {
    const name = myImage;
    const imgUrl = "/video/"+name+".png"
  return (
    <div className="mid-video">
        <img src = {imgUrl} alt={name} title={name} />
    </div>
  );
}