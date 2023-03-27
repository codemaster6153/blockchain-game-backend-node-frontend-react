import React, { useState } from 'react'
import cn from 'classnames'
import './assetShop.css'
import AssetShopMainArea from './AssetShopMainArea';
import AssetShopSidebar from './AssetShopSidebar'

function AssetShop({ wax }) {
    const [showSection, setShowSection] = useState('all-nfts');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const onMobileMenuClicked = () => {
        setShowMobileMenu(prev => !prev)
    }

    return (
        <div className='assetshop-container'>
            <div className={cn('sidebar-container', { "active": showMobileMenu })}>
                <AssetShopSidebar setShowSection={setShowSection} showSection={showSection} />
            </div>
            <div className='maincontent-container'>
                <div className='wrapper'>
                    <AssetShopMainArea showSection={showSection} wax={wax} />
                </div>
                <div className='mobile-asset-menu' onClick={onMobileMenuClicked}>
                    <div className='hambar' />
                    <div className='hambar' />
                    <div className='hambar' />
                </div>
            </div>
        </div>
    )
}

export default AssetShop