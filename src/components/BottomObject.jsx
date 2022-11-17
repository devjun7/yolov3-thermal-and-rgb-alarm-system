import React from 'react'

// state 별로 분리하기
// 컴포넌트 간 간격 조정하기 (css)
export default function BottomObject({ objectHuman, objectAnimal, objectVehicle }) {
  return (
    <div className='bottom-object'>
        <div>Human: {objectHuman}</div>
        <div>Animal: {objectAnimal}</div>
        <div>Vehicle: {objectVehicle}</div>
    </div>
  );
}