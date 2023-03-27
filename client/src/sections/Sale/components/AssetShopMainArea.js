import React, { useMemo } from 'react'
import MiningHub from './sections/MiningHub'
import EndlessSiegeLands from './sections/EndlessSiegeLands'
import ApartmentDecoration from './sections/ApartmentDecoration'
import RugPoolHalls from './sections/RugPoolHalls';

function AssetShopMainArea({ showSection, wax }) {

  const allNFTS = <>
    <MiningHub />
    <section id='apartment-decoration'><ApartmentDecoration wax={wax} /></section >
    <section id='rug-pool-halls' ><RugPoolHalls /></section >
    <section id='endless-siege-lands' >
      <EndlessSiegeLands />
    </section>
    <section id='memorial-nfts' ></section >
  </>

  const renderBaseOnSection = useMemo(() => {
    switch (showSection) {
      case 'all-nfts':
        return allNFTS;

      case "gaming-hub":
        return <MiningHub />

      case "rug-pool-halls":
        return <RugPoolHalls />

      case 'apartment-decoration':
        return <section id='apartment-decoration' >
          <ApartmentDecoration wax={wax} />
        </section>

      case "endless-siege-lands":
        return <section id='endless-siege-lands' >
          <EndlessSiegeLands />
        </section>

      default:
        return allNFTS;
    }
  }, [showSection])

  return (
    <div className='assetshop-mainarea'>
      {/* <p style={{textAlign: 'center'}}>hello</p> */}
      {/* <section id='all-nfts' style={{height: '600px', width: '100%', backgroundColor: 'green', margin: '10px auto'}}></section> */}
      {renderBaseOnSection}
    </div>
  )
}

export default AssetShopMainArea