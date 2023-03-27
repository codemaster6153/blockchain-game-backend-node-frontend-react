import React from 'react'
import './assetShopSidebar.css'

function AssetShopSidebar({ setShowSection, showSection }) {
    const nftCollections = [{
        option: 'ALL NFTS',
        value: 'all-nfts',
        src: '/images/all_nft.png',
    }, {
        option: 'GAMING HUB',
        value: 'gaming-hub',
        src: '/images/minigHub.png',
    }, {
        option: 'APARTMENT DECORATION',
        value: 'apartment-decoration',
        src: '/images/apartment.png',
    }, {
        option: 'RUG POOL HALLS',
        value: 'rug-pool-halls',
        src: '/images/rugPool.png',
    }, {
        option: 'ENDLESS SIEGE LANDS',
        value: 'endless-siege-lands',
        src: '/images/endless.png',
    }];

    const scrollTo = () => {
        const element = document.querySelector(`#mining-hub`);
        const offset = 90;
        const bodyRect = document.body?.getBoundingClientRect()?.top;
        const elementRect = element?.getBoundingClientRect()?.top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    const onNavClicked = (e, nft) => {
        setShowSection(nft?.value);
        scrollTo();
    }

    return (
        <div className='assetshop-sidebar'>
            <h2>NFT COLLECTION</h2>
            <ul>
                {nftCollections && nftCollections.map((nft) => (
                    <li key={nft?.value} onClick={(e) => onNavClicked(e, nft)} className={showSection === nft.value ? 'active-tab' : ''}>
                        <img src={nft.src} height={17} width={17} alt="nfts" />
                        {' -'} {nft.option}
                    </li>
                ))}
                {/* <li onClick={handleHideNav} >- RUG POOL</li>
                <li onClick={handleHideNav} >- MEMORIAL NFTS</li> */}
            </ul>
        </div>
    )
}

export default AssetShopSidebar