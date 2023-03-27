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
                <img src={(navValue === 1) ? "/images/newRugPool/empty_hall.jpeg" : "/images/empty_pack_rug_pool.png"} alt="fadedcard" />
            </div>
            {/* <a href= {(navValue === 1) ? "https://nfthive.io/market?collection=clashdomenft&order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&category=lands&refresh=true" : "https://nfthive.io/market?collection=clashdomenft&order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&category=packs&refresh=true"} target="_blank" rel="noopener noreferrer">
            <div className="nft-hive-button">
                <p style={{}}>Get them at</p>
                <img src="/images/nfthive-logo-small.png" width="80px" />
            </div>
            </a>
            <p>
                {(navValue === 1) ? "Buy halls:" : "Buy packs:"} 
                <a href= {(navValue === 1) ? "https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=poolhalls&sort=price&symbol=WAX" : "https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=packs&sort=price&symbol=WAX"} target="_blank" rel="noopener noreferrer">
                    <span>Atomic Hub</span>
                </a>
                
            </p> */}
            <hr />
            <div className='buy-wrapper' style={(navValue === 1) ? {marginTop: '92px'} : {}}>
                <p>BUY</p>
                <div className='buttons-container'>
                    <a href={'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=packs&search=hall&sort=price&symbol=WAX'} target='_blank' rel="noopener">
                        <img src='/images/shop/btn_buy_atomic.svg' alt='buy atomic' />
                    </a>
                    <a href={'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=packs&sort=price&order=asc&match=hall'} target='_blank' rel="noopener">
                        <img src='/images/shop/btn_buy_nefty.svg' alt='buy nefty' />
                    </a>
                    <a href={'https://nfthive.io/market?order_by=offer&order_dir=ASC&search_type=sales&offer_type=sales&collection=clashdomenft&schema=packs&term=hall'} target='_blank' rel="noopener">
                        <img src='/images/shop/btn_buy_nfthive.svg' alt='buy atomic' />
                    </a>
                </div>
            </div>
        </div>
    )
}
