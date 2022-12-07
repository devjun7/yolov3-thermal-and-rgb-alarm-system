import React, { useState, useEffect } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import TODConnect from './components/TODConnect';
import BottomState from './components/BottomState';
import BottomDisplayInfo from './components/BottomDisplayInfo';
import BottomObject from './components/BottomObject';
import TopElement from './components/TopElement';
import WarningOnText from './components/WarningOnText';
import InputBox from './components/InputBox';
import List from './components/List';
import StopButton from './components/StopButton';
import WarningPlayer from './components/WarningPlayer';

// 설정법
// node.js 설치, npm 설치, yarn 설치
// ((npm create-react-app --use-npm) ==> git 에서 App.js, App.css, components 폴더만 copy)
// or 모두 copy (project-ui 폴더)

// 이후 크롬 설정 --> 개인 정보 보호 및 보안 --> 사이트 설정 --> 추가 콘텐츠 설정
// --> 소리 --> 기본 동작: 사이트에서 소리를 재생할 수 있음 체크
// --> 하단에 소리 재생이 허용됨 추가 --> http://localhost:3000 추가

// 메인 화면 (index.js에서 index.html로 App.js를 띄워줌)
const App = () => {

  // 각 구성요소 상태 관리 (새로고침 없이 자동 re-rendering을 위해 state로 저장)
  // 서버에서 받을 데이터
  const [AIVersionList, setAIVersionList] = useState(() => ["Loading..."]);
  const [warningOn, setWarningOn] = useState(() => 0);
  const [myImage, setMyImage] = useState(() => "");
  const [fpsInfo, setFpsInfo] = useState(() => 0);
  const [scaleInfo, setScaleInfo] = useState(() => "320 X 192");
  const [objectHuman, setObjectHuman] = useState(() => 0);
  const [objectAnimal, setObjectAnimal] = useState(() => 0);
  const [objectVehicle, setObjectVehicle] = useState(() => 0);
  const [warningState, setWarningState] = useState(() => -1);
  const [isChangeState, setIsChangeState] = useState(() => 0);


  // 서버로 보낼 데이터
  const [AIVersion, setAIVersion] = useState(() => "Select ver.");
  const [warningWaitTime, setWarningWaitTime] = useState(() => 3);
  const [warningOnTime, setWarningOnTime] = useState(() => 3);

  // Front 자체 가공 데이터
  const [todConnection, setTodConnection] = useState(() => -1);
  const [logMessages, setLogMessages] = useState([]);
  const [soundOn, setSoundOn] = useState(() => true);

  // 서버로 데이터 전송하기 위한 상태 관리
  const [sendConnection, setSendConnection] = useState(() => false);
  const [sendWaitTime, setSendWaitTime] = useState(() => false);
  const [sendOnTime, setSendOnTime] = useState(() => false);

  let socket = null;
  // 소켓 객체 생성 & 서버와 연결되면 마운트와 동시에 AI Version List 수신
  // TOD 연결되면 모든 필요한 데이터 수신 

  useEffect(() => {
    if (socket===null){
      socket = new WebSocket("ws://localhost:5000");

    }
    let result;
    socket.onopen = function (e) {
      const data = "connection Success"
      socket.send(data)
      console.log("-------Server Connected-------");

      // Client --> Server 데이터 전송
      if(sendConnection) {
        setSendConnection(false);
        socket.send(
          "AIVersion"
        );
        socket.send(
          `${AIVersion}`
        );
        console.log("-------------AI Version & TOD 연결 요청 전송 완료--------------")

      }

      if(sendWaitTime) {
        setSendWaitTime(false);
        socket.send(
          "WaitTime"
        );
        socket.send(
          `${warningWaitTime}`
        );
        console.log("-------경고발생 대기시간 전송 완료-------");

      }

      if(sendOnTime) {
        setSendOnTime(false);
        socket.send(
          "onTime"
        );
        socket.send(
          `${warningOnTime}`
        )
        console.log("-------경고기능 켜짐시간 전송 완료-------");
      
      }
    };

    // 서버에서 메시지를 받았을 때 처리
    socket.onmessage = async function(e) {
      try{
        if (e !== null && e !== undefined) {
          result = e.data;
          result = JSON.parse(result);
          console.log("-------Message Received-------");
          console.log(result);

          if (result.hasOwnProperty("AIVersionList")) {
            console.log(result.AIVersionList);
            setAIVersionList(result.AIVersionList);
            socket.send("receive AIVersionList");

          } else if (todConnection === 0 || todConnection === 1) {
            setTodConnection(1);
            setWarningOn(result.warningOn);
            setMyImage("data:image/jpg;base64,"+result.data);
            setFpsInfo(result.fpsInfo);
            setObjectHuman(result.objectHuman);
            setObjectAnimal(result.objectAnimal);
            setObjectVehicle(result.objectVehicle);
            setWarningState(result.warningState);
            setIsChangeState(result.isChangeState);
            socket.send("receive data");

          }
        }
      } catch(error) {
        console.log(error);

      }
    }

    socket.onclose = function (e) {
      console.log("-------conncetion closed--------")
      socket.close()
      setTodConnection(-1);

    };
  },[todConnection, sendConnection, sendOnTime, sendWaitTime])

  return (
    <div className="App">
      <WarningPlayer warningOn = { warningOn } soundOn= { soundOn } setSoundOn={ setSoundOn }></WarningPlayer>

      <div className="top-area">
        <TopElement>TOD 연결 상태</TopElement>
        <TODConnect todConnection={ todConnection } setTodConnection={ setTodConnection } AIVersion={ AIVersion } setSendConnection={ setSendConnection } />

        <TopElement>AI Version</TopElement>
        <Dropdown AIVersion={ AIVersion } setAIVersion={ setAIVersion } AIVersionList={ AIVersionList } />

        <TopElement>경고발생 대기시간 (초)</TopElement>
        <InputBox time={ warningWaitTime } setTime={ setWarningWaitTime } setSendTime={ setSendWaitTime } />

        <WarningOnText warningOn={ warningOn } soundOn={ soundOn } />
        <StopButton warningOn={ warningOn } soundOn={ soundOn } setSoundOn={ setSoundOn } />

      </div>

      
      <div className="mid-area">
        <main className="mid-video">
          <img src={`${myImage}`} alt="TOD Video"/>
        </main>

        <aside className="mid-log">
          <List messages={logMessages} setMessages={setLogMessages} warningState={warningState} isChangeState={isChangeState} setIsChangeState={setIsChangeState}></List>
        </aside>
      </div>


      <div className="bottom-area">
        <BottomDisplayInfo fpsInfo={fpsInfo} scaleInfo={scaleInfo} />
        <BottomObject objectHuman={objectHuman} objectAnimal={objectAnimal} objectVehicle={objectVehicle} />
        <BottomState warningState={ warningState } />
      </div>

    </div>
  );

}

export default App;
