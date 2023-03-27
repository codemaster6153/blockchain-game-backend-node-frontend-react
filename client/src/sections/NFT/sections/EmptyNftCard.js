import React from 'react'

function EmptyNftCard() {
    return (
        <div className="empty-card">
            <div className="image">
                <img src="/images/cd_back.png" alt="fadedcard" />
            </div>
            <p>
                Buy packs: 
                <a href="https://nfthive.io/market?collection=clashdomenft&order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&category=packs&refresh=true" rel="noopener noreferrer">
                    <span>NFT Hive</span>
                </a>
            </p>
            <p>
                Buy packs: 
                <a href="https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=packs&sort=price&symbol=WAX" rel="noopener noreferrer">
                    <span>Atomic Hub</span>
                </a>
            </p>
        </div>
    )
}

export default EmptyNftCard
