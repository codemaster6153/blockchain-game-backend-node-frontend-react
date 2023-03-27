import React, { useEffect, useState } from 'react'
import './index.css';
import StakableAssets from './StakableAssets';
import StakedAssets from './StakedAssets';
import UnstakableAssets from './UnstakableAssets';

function Stake({wax, setNavState}) {
    // these states will manage the staked section and if a assest is stakable or not
    const [citizenStaked, setCitizenStaked] = useState()
    const [userAccount, setUserAccount] = useState()
    const [unstakableTreadmill, setUnstakableTreadmill] = useState()
    const [unstakableTreadmillReason, setUnstakableTreadmillReason] = useState()

    const [unstakableVending, setUnstakableVending] = useState()
    const [unstakableVendingReason, setUnstakableVendingReason] = useState()

    const [unstakablePiggy, setUnstakablePiggy] = useState()
    const [unstakablePiggyReason, setUnstakablePiggyReason] = useState()

    const [unstakableSlot, setUnstakableSlot] = useState()
    const [unstakableSlotReason, setUnstakableSlotReason] = useState()

    const [disableCarbzStaking, setDisableCarbzStaking] = useState()
    const [disableJigoStaking, setDisableJigoStaking] = useState()
    

    const getUserData = async () => {

        let account = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "accounts",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });

        if (account.rows[0]) {
            setUserAccount(account.rows[0])

            if(account === undefined || account.rows === undefined || account.rows.length === 0){
                setCitizenStaked(false)
            }
    
            if(account.rows[0].jigowatts_slots === 3 && account.rows[0].jigowatts_free_slots === 0){
                setUnstakableTreadmill(true)
                setUnstakableTreadmillReason("You already have staked 3 Treadmills.")
            }else if(account.rows[0].jigowatts_slots < 3 && account.rows[0].jigowatts_free_slots === 0){
                setUnstakableTreadmill(true)
                setUnstakableTreadmillReason("You need to unlock a new Area Slot in the Blue Area to stake this Treadmill")
            }else{
                setUnstakableTreadmill(false)
                setUnstakableTreadmillReason()
            }
    
            if(account.rows[0].carbz_slots === 3 && account.rows[0].carbz_free_slots === 0){
                setUnstakableVending(true)
                setUnstakableVendingReason("You already have staked 3 Vending Machines.")
            }else if(account.rows[0].carbz_slots < 3 && account.rows[0].carbz_free_slots === 0){
                setUnstakableVending(true)
                setUnstakableVendingReason("You need to unlock a new Area Slot in the Green Area to stake this Carbz Vending Machine")
            }else{
                setUnstakableVending(false)
                setUnstakableVendingReason()
            }
    
            if(
                (parseInt(account.rows[0].carbz_slots) + parseInt(account.rows[0].jigowatts_slots) > 5)
            ){
                setUnstakableSlot(true)
                setUnstakableSlotReason('You have already staked max slots')
            }else if(
                (parseInt(account.rows[0].carbz_slots) + parseInt(account.rows[0].jigowatts_slots) === 6) &&
                (account.rows[0].carbz_free_slots === 0 && account.rows[0].jigowatts_free_slots === 0)
            ){
                setUnstakableSlot(true)
                setUnstakableSlotReason('Please buy more slots')
            }
    
            if(account.rows[0].carbz_free_slots === 0 && account.rows[0].carbz_slots === 3){
                setDisableCarbzStaking(true)
            }
            if(account.rows[0].jigowatts_free_slots === 0 && account.rows[0].jigowatts_slots === 3){
                setDisableJigoStaking(true)
            }
        }
        
    }

    useEffect(() => {
        getUserData()
    }, [])
    
    return (
        <div className="stake-container">
            <div className="section">
                <div className="header">
                    <p>READY TO USE</p>
                </div>
                <div className="cards-container">
                    <StakableAssets 
                        unstakablePiggy={unstakablePiggy}
                        setNav={setNavState}
                        wax={wax}
                        unstakableSlot={unstakableSlot}
                        disableCarbzStaking={disableCarbzStaking}
                        disableJigoStaking={disableJigoStaking}
                        unstakableTreadmill={unstakableTreadmill}
                        unstakableVending={unstakableVending}
                        citizenStaked={citizenStaked}
                    />
                </div>
            </div>
            <div className="section">
                <div className="header">
                    <p>NON EQUIPPABLE</p>
                </div>
                <div className="cards-container">
                    <UnstakableAssets
                        unstakablePiggy={unstakablePiggy}
                        citizenStaked={citizenStaked}
                        unstakableTreadmill={unstakableTreadmill}
                        unstakableVending={unstakableVending}
                        unstakableSlot={unstakableSlot}
                        unstakableSlotReason={unstakableSlotReason}
                        unstakableTreadmillReason={unstakableTreadmillReason}
                        unstakableVendingReason={unstakableVendingReason}
                        wax={wax}
                    />
                </div>
            </div>
            <div className="section">
                <div className="header">
                    <p>EQUIPPED</p>
                </div>
                <div className="cards-container">
                    <StakedAssets setUnstakablePiggy={setUnstakablePiggy} setCitizenStaked={setCitizenStaked} wax={wax} setNav={setNavState}/>
                </div>
            </div>
        </div>
    )
}

export default Stake
