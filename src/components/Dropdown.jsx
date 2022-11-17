import React, {useState} from 'react'

// AI Version 선택 dropdown
// 연동 사항: options는 server에서 받아온 AI Version들로 대체하기
// drop down에 아래 화살표 표시 (fas fa-caret-down) 작동 안함. 수정하기
function Dropdown ({ AIVersion, setAIVersion, AIVersionList }) {
    const [isActive, setIsActive] = useState(false);
    const options = AIVersionList;

    return(
        <div className="dropdown">
            <div className="dropdown-btn" onClick={(e) =>
            setIsActive(!isActive)}>
                {AIVersion}
                <span className="fas fa-caret-down"></span>
            </div>
            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div onClick={(e) => {
                            setAIVersion(option);
                            setIsActive(false);
                        }}
                        className="dropdown-item">{option}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;