import React from 'react'
import TopElement from './TopElement'
import WarningFunction from './WarningFunction'

export default function WarningOnText({warningOn, soundOn}) {
  return (
    <TopElement>
        {(warningOn === 0 || soundOn === false) &&
            <WarningFunction fontColor="font-gray">[경고기능 미작동]</WarningFunction>
        }
        {warningOn === 1 && soundOn === true &&
            <WarningFunction fontColor ="font-red">[경고기능 작동 중...]</WarningFunction>
        }
    </TopElement>
  );
}
