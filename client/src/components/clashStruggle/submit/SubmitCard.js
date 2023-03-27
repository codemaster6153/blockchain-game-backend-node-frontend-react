import React, { useEffect, useRef, useState } from 'react'
import './submitCard.css'

export default function SubmitCard({mint, isAllSelected, value, setIsAllSelected, handleCardSelect}) {

    const [isSelected, setIsSelected] = useState(false)
    const img = useRef()

    useEffect(() => {
        if(isAllSelected){
            setIsSelected(true)
        }
    }, [isAllSelected])

    useEffect(() => {
        if(isSelected && img.current){
            img.current.classList.add("border")
        } else if(!isSelected && img.current){
            img.current.classList.remove("border")
        }
        if(isSelected && !isAllSelected){
            handleCardSelect(isSelected, value, mint)
        } else if(!isSelected && !isAllSelected){
            handleCardSelect(isSelected, value, mint)
        }
    }, [isSelected, isAllSelected])
    
    const handleSelect = (e) => {
        setIsSelected(e.target.checked)
        if(isAllSelected && !(e.target.checked)){
            setIsAllSelected(false)
        }
    }

    return (
        <div className="card">
            <p>{value}</p>
            <img src="/images/card.png" ref={img} alt="card-image" />
            <div className="card-number">
                <p>#{mint}</p>
            </div>

            <label className="checkbox-label">
                <input type="checkbox" checked={isSelected} onChange={handleSelect} />
                <span className="checkbox-custom rectangular"></span>
            </label>
        </div>
    )
}
