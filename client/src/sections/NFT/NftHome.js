import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function NftHome() {
    const history = useHistory()
    const wax = useSelector(state => state.wax);

    useEffect(() => {
        // Redirect users to the Hub > Management section, due to this page is no longer available.
        const username = (wax.type || wax.user ) ? wax.userAccount : ''
        const pathToGo = `/token-mining-game/${username}?view=1`
        history.push(pathToGo)
    }, [])

    return (
        <div />
    )
}
