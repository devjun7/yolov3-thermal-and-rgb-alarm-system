import React from 'react'

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
      setMessages([logTime + " 정상 상황", ...messages]);

    } else if (warningState === 0) {
      setMessages([logTime + " 이상 상황 ◎", ...messages]);

    } else if (warningState === 1) {
      setMessages([logTime + " 경고 발생 ◇◆◇", ...messages]);

    }

    if (messages.length > 50) {
      console.log("-----log list cleaning-----")
      try {
        setMessages(messages.splice(1, 40));

      } catch(error) {
        console.log(error + "-----log list not full-----");

      }
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
