import React from 'react'

export default function BottomObject({ objectHuman, objectAnimal, objectVehicle }) {
  return (
    <div className='bottom-object'>
        <div>Human: {objectHuman}</div>
        <div>Animal: {objectAnimal}</div>
        <div>Vehicle: {objectVehicle}</div>
    </div>
  );
}