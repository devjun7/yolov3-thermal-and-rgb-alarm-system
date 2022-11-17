import React from 'react'
import BottomStateBox from './BottomStateBox';


export default function BottomState({ warningState }) {
  return (
    <div className='bottom-element'>
        {warningState === -1 &&
            <BottomStateBox color = "green">정상 상황</BottomStateBox>
        }
        {warningState === 0 &&
            <BottomStateBox color = "orange">이상 상황</BottomStateBox>
        }
        {warningState === 1 &&
            <BottomStateBox color = "red">경고 상황</BottomStateBox>
        }
    </div>
  );
}