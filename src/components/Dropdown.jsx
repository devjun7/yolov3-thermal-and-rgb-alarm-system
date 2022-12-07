import React, {useState} from 'react'

// AI Version 선택 dropdown
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