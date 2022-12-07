import React, {useState, useEffect} from 'react'
import warningSound from '../music/warningSound.mp3'
// import muteSound from '../music/muteSound.mp3'

// warningOn ? audio.play() : audio.pause();
export default function WarningPlayer({warningOn, soundOn, setSoundOn}) {
    const [audio] = useState(new Audio(warningSound));
    audio.loop = true;

    useEffect(() => {
        if (warningOn === 0) {
          setSoundOn(true);
        }

        if (warningOn === 1 && soundOn === true) {
            console.log("warning sound playing");
            audio.volume = 0.1;
            audio.play();

        } else if (soundOn === false){
            console.log("warning sound paused");
            audio.volume = 0;
            // audio.pause();

        } else if (warningOn === 0) {
            console.log("warning sound paused");
            audio.volume = 0;
            // audio.pause();
        }

    }, [warningOn, soundOn, audio]); 

  return (
    <audio loop></audio>
  )
  
}
