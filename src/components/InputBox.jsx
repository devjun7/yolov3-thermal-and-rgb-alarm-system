import React, {useState} from 'react';
import Button from './Button';

export default function InputBox({time, setTime, setSendTime}) {
    const [typing, setTyping] = useState(false);

    function handleChange(e) {
        setTime(e.target.value);
        setTyping(true);
    }

    function handleClick() {
        if (isNaN(time)) {
            alert("시간을 초 단위로 입력하세요. ex> 3");
        } else {
            if (time === '') {
                alert("시간을 입력하지 않아 기본값인 3초로 설정합니다.");
                setTime(3);

            }
            setSendTime(true);
            setTyping(false);

        }
    }

  return (
    <>
        <input className= "input-box" onChange={handleChange} value={time} />
        <Button style={{width:"65px"}} onClick={handleClick}>설정</Button>
    </>
  )
}
