import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'

export default function WarningModal() {
    const warningData = useSelector(state => state.warningModal)
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.stopPropagation()
        console.log("we are handleing submit in this modal")
        warningData.setAcceptance(true)
        dispatch({type: 'REMOVE_WARNING_MODAL'})
    }

    const handleIgnore = () => {
        console.log("we are ignoring the modal")
        warningData.setAcceptance(false)
        dispatch({type: 'REMOVE_WARNING_MODAL'})
    }

    const handleUpgrade = (e) => {
        e.stopPropagation()
        console.log("here we are handling the upgrade")
        warningData.setAcceptance(true)
        dispatch({type: 'REMOVE_WARNING_MODAL'})
    }

    return (
        <div className="modal-container" id="warningModal" onClick={handleIgnore}>
            <div className="modal-box">
                <p className="modal-red-text">{warningData.body}</p>
                <div className="modal-button" onClick={(warningData.type === "submit" ? handleSubmit : handleUpgrade)}>
                    <p>{warningData.button}</p>
                </div>
            </div>
        </div>
    )
}
