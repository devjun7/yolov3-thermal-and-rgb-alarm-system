// 경고 기능 관련 시간 입력창 구현하기
// 초기 default 값은 3인데 한 번 입력하면 local에 저장하고 set state 시켜서 default를 최근 입력한 값으로 바꾸기
// react-hook-form 적용하기

import React, {useState} from 'react';
import Button from './Button';

export default function InputBox({time, setTime, setSendTime}) {
    const [typing, setTyping] = useState(false);

    function handleChange(e) {
        setTime(e.target.value);
        setTyping(true);
    }

    // input을 안주고 버튼을 누르면 default 값인 3으로 설정
    // input에 숫자가 아닌 값이 들어오면 알람 발생 후 데이터 전송 X
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
