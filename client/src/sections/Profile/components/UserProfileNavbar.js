import React, { useEffect } from 'react'
import './userProfileNav.css'
import { useParams, Link } from 'react-router-dom'
import { SubHeaderItem } from '../../../components'

function UserProfileNavbar({navState, setNavState, pendingDuels, wax, frequests}) {

    const { id } = useParams()

    useEffect(() => {
        if(document){
            document.getElementById(`nav_0`).removeAttribute('active')
            if(wax && wax.userAccount === id){
                document.getElementById(`nav_1`).removeAttribute('active')
                document.getElementById(`nav_3`).removeAttribute('active')
                document.getElementById(`nav_4`).removeAttribute('active')
            }
            document.getElementById(`nav_${navState}`).setAttribute('active', "true")
        }
    }, [navState])
    

    return (
        <div className="user-profile-nav">
            <ul>
                {
                    wax && wax.userAccount === id ?
                    <SubHeaderItem id="nav_0" active={"true"} onClick={() => {setNavState(0)}} text="RANKING & STATS" icon="rank" />
                    :
                    <li id="nav_0" className="active apartment-score" onClick={() => {setNavState(0)}}>
                        <span>{id}</span> - <span>APARTMENT AND STATS</span>
                        <div className='close'>
                            <Link to={`/token-mining-game/${wax.userAccount}`}>
                                <img src='/images/btn_close.svg' alt='close'  />
                            </Link>
                        </div>

                    </li>
                }
                {
                    wax && wax.userAccount === id ?
                    <>
                        <SubHeaderItem id="nav_1" onClick={() => {setNavState(1)}} text="MANAGEMENT" icon="management" />
                        <SubHeaderItem id="nav_4" onClick={() => {setNavState(4)}} text="FRIENDOS" icon="friends">
                            {(frequests?.length > 0) && <div className='notif-badge'>{frequests?.length}</div>}
                        </SubHeaderItem>
                        <SubHeaderItem id="nav_3" onClick={() => {setNavState(3)}} text="DUELS" icon="duel">
                            { pendingDuels > 0 && <div className='notif-badge'>{pendingDuels}</div> }
                        </SubHeaderItem>
                    </>:
                    <></>
                }
            </ul>
        </div>
    )
}

export default UserProfileNavbar
