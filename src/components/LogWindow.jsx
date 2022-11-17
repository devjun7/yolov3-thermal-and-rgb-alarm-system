import React, {useState, useEffect, useCallback, useRef} from 'react'


const LogWindow = ({isLog, setIsLog, logMessages}) => {
    return (
        <div>
            {logMessages}
        </div>
    )
};