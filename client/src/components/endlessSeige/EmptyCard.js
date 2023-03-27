import React from 'react'
import './emptyCard.css'

export default function EmptyCard({navValue}) {
    return (
        <div className="empty-card">
            {
                (navValue === 1) ?
                <h1>EMPTY SLOT</h1>:
                <></>
            }
            <div className="image">
                <img src={(navValue === 1) ? "/images/empty_land.jpg" : "/images/empty_pack.png"} alt="fadedcard" />
            </div>
            <a href= {(navValue === 1) ? "https://nfthive.io/market?collection=clashdomenft&order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&category=lands&refresh=true" : "https://nfthive.io/market?collection=clashdomenft&order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&category=packs&refresh=true"} target="_blank" rel="noopener noreferrer">
            <div className="nft-hive-button">
                <p style={{}}>Get them at</p>
                <img src="/images/nfthive-logo-small.png" width="80px" />
            </div>
            </a>
            <p>
                {(navValue === 1) ? "Buy lands:" : "Buy packs:"} 
                <a href= {(navValue === 1) ? "https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=lands&sort=price&symbol=WAX" : "https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=packs&sort=price&symbol=WAX"} target="_blank" rel="noopener noreferrer">
                    <span>Atomic Hub</span>
                </a>
                
            </p>
        </div>
    )
}
