import React, {useState} from 'react'
import StateBox from './StateBox';
import Button from './Button';

export default function TODConnect({todConnection, setTodConnection, AIVersion, setSendConnection}) {
    const [connectionTry, setConnectionTry] = useState("연결");

    // 서버에서 binary data (영상, 이미지) 전송과 동시에 연결되었다는 정보를 보내주면 setTodConnection(1)
    // 연결 없음: 빨간색 박스 / 연결 중...: 노란색 박스 / 연결 완료: 초록색 박스 // CSS로 구현하기
    // parameter state 값
    // top-element도 components 객체로 따로 빼서 구현하기
     return (
        <div className="top-element">
            {todConnection === -1 &&
                <StateBox color = "red">연결 없음</StateBox>
            }
            {todConnection === 0 &&
                <StateBox color ="orange">연결 중...</StateBox>
            }
            {todConnection === 1 &&
                <StateBox color ="green">연결 완료</StateBox>
            }
            <Button onClick={(e) => {
                e.preventDefault();
                console.log({AIVersion});
                if (AIVersion==='Select AI ver.') {
                    alert("AI Version을 선택하세요.");

                } else {
                    setConnectionTry("재연결");
                    setTodConnection(0);
                    setSendConnection(true);
                    console.log("-------AI Version 전송 완료--------")
                    
                }
            }} style={{width:"80px"}}>{connectionTry}</Button>
        </div>
     )
}
