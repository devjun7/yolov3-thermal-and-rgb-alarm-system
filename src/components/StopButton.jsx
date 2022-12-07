import React from 'react'
import Button from './Button'

export default function StopButton({warningOn, soundOn, setSoundOn}) {
    function handleClick() {
      setSoundOn(false);
      alert("경고음을 종료합니다.");

    }

  return (
    <div>
    {((warningOn === 1) && (soundOn === true)) &&
        <Button color = "red" fontColor= "font-white" style={{width:"130px"}} onClick={handleClick}>경고음 종료</Button>
    }
    {((warningOn === 0) || (soundOn === false)) &&
        <Button color = "gray" fontColor= "font-white" style={{width:"130px"}}>경고음 종료</Button>
    }

    </div>
  )
  
}
