import React, { useEffect, useState } from 'react';
import countryList from './countrylist';

function CountrySelector({setCountry, defaultValue}) {
    const [isActive, setIsactive] = useState(false)
    const [selected, setSelected] = useState(defaultValue ? countryList[`${defaultValue}`] : '')
    const handleSelect = (e) => {
        setCountry(e.target.id)
        setIsactive(!isActive)
        setSelected(e.target.innerText)
    }

    function getFlagEmoji(countryCode) {
        if(countryCode === 'none'){
            return '🏳️'
        }
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char =>  127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    useEffect(() => {
        setSelected(defaultValue ? countryList[`${defaultValue}`] : '')
    }, [defaultValue])

    return(
        <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
            <button className="button" aria-haspopup="true" onClick={() => {setIsactive(!isActive)}} aria-controls="dropdown-menu">
                <span>{selected.length > 0 ? selected : 'Select Country'} {defaultValue ? getFlagEmoji(defaultValue) : ''}</span>
                <span className="icon is-small">
                <img src='/images/caret-down.svg' alt='caretddown' width={14} />
                </span>
            </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
                {
                    Object.entries(countryList).map((key, value) => {
                        return(
                            <p id={key['0']} className="dropdown-item" key = {key['0']} onClick={handleSelect} >
                                {key['1']} {getFlagEmoji(key['0'])}
                            </p>
                        );
                    })
                }
            </div>
            </div>
        </div>
    );
}

export default CountrySelector;
