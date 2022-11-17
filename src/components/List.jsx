import React from 'react'

// isChangeState 가 true면 상황로그 리스트에 추가

// 추가로 구현해야할 것
// 상황 로그 리스트의 인덱스를 계산하여 어느 시점이 지나면 앞에 어느 정도 인덱스 삭제

export default function List({messages, setMessages, warningState, isChangeState, setIsChangeState}) {
  // 현재 시간 계산 함수
  function logTimer() {
    var nowTime = new Date();
    var nowYear = nowTime.getFullYear();
    var nowMonth = ('0' + (nowTime.getMonth() + 1)).slice(-2);
    var nowDay = ('0' + nowTime.getDate()).slice(-2);
    var nowHours = ('0' + nowTime.getHours()).slice(-2);
    var nowMinutes = ('0' + nowTime.getMinutes()).slice(-2);
    var nowSeconds = ('0' + nowTime.getSeconds()).slice(-2);
    var logTime = nowYear + '-' + nowMonth + '-'+ nowDay + '_' + nowHours + ':' + nowMinutes + ':' + nowSeconds;

    console.log(logTime);
    return logTime;

  }

  // warningState가 변경되면 상황 목록에 로그 출력
  if(isChangeState === 1) {
    setIsChangeState(0);
    let logTime = logTimer();

    if (warningState === -1) {
      setMessages([...messages, logTime + " 정상 상황"])

    } else if (warningState === 0) {
      setMessages([...messages, logTime + " 이상 상황 ◎"])

    } else if (warningState === 1) {
      setMessages([...messages, logTime + " 경고 발생 ◇◆◇"])

    }
  }

  return (
    <ul>
        {messages.map((item) => (
            <li>{item}</li>
        ))}
    </ul>
  );
}
