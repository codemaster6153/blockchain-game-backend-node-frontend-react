import React, { useEffect, useState } from 'react'
import CraftCard from './CraftCard'
import './index.css'
import SlotCraftCard from './SlotCraftCard';
import WalletCraftCard from './WalletCraftCard';

function Craft({wax, setNavState}) {

    const [slotes, setSlotes] = useState()
    const [tools, setTools] = useState()
    const [wallet, setWallet] = useState()
    const [loading, setLoading] = useState(true)

    const getCraftData = async () => {
        setLoading(true)
        // TOOLS
        let toolsConfig = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "toolconfig",  
            limit: 100,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,                
            reverse: false,             
            show_payer: false,    
        });

        let toolsConfigRows = toolsConfig.rows;

        toolsConfigRows = toolsConfigRows.sort((a,b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));

        setTools(toolsConfigRows)
        if(loading && toolsConfigRows.length > 0){
            setLoading(false)
        }

        // SLOTS
        let slotsConfig = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "slotsconfig",  
            limit: 100,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,                
            reverse: false,             
            show_payer: false,    
        });

        setSlotes(slotsConfig.rows)
        if(loading && slotsConfig.rows.length > 0){
            setLoading(false)
        }

        // WALLETS
        let walletsConfig = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "walletconfig",  
            limit: 100,
            index_position: 1,
            key_type: "i64",
            lower_bound: 350000,
            upper_bound: null,                
            reverse: false,             
            show_payer: false,    
        });

        setWallet(walletsConfig.rows)
        if(loading && walletsConfig.rows.length > 0){
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if(wax && wax.rpc){
            getCraftData()
        }
    }, [])
    return (
        <div className="craft-container">

            {
                loading ?
                <img className="loading" src="/images/loading_icon.png" />:
                ''
            }
            {
                slotes && slotes.length > 0 && slotes.map((item, index) => {
                    return <SlotCraftCard
                            setNav={setNavState}
                            key={index}
                            name={item.slots_name}
                            image={item.img}
                            crafting={item.craft}
                            template_id={item.template_id}
                            wax={wax}
                    />
                })
            }
            {
                wallet && wallet.length > 0 && wallet.map((item, index) => {
                    return <WalletCraftCard
                            setNav={setNavState}
                            key={index}
                            data={item}
                            wax={wax}
                    />
                })
            }
            {
               tools && tools.length > 0 && tools.map((item, index) => {
                   return <CraftCard
                        setNav={setNavState}
                        data={item}
                        key={index}
                        wax={wax}
                   />
               })
            }
            
        </div>
    )
}

export default Craft
