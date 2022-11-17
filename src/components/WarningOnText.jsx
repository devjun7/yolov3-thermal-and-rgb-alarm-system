import React from 'react'
import TopElement from './TopElement'
import WarningFunction from './WarningFunction'

export default function WarningOnText({warningOn}) {
  return (
    <TopElement>
        {warningOn === 0 &&
            <WarningFunction fontColor="font-gray">[경고기능 미작동]</WarningFunction>
        }
        {warningOn === 1 &&
            <WarningFunction fontColor ="font-red">[경고기능 작동 중...]</WarningFunction>
        }
    </TopElement>
  );
}
