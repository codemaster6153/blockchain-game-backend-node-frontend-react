import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AreaCraftCard from './AreaCraftCard'
import CitizenBuyCard from './CitizenBuyCard'
import CraftCard from './CraftCard'
import './index.css'
import WalletCraftCard from './WalletCraftCard'

const citizensData = [
  {
    title: 'PLEB AMNIO-TANK',
    image: '/images/shop/amnio_pleb.png',
    customizationOption: 'BASIC',
    tokenMiningBonus: 'NONE',
    totalMints: '2,135',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&template_data:text.name=Citizen%20Pleb%20-%20Amnio-Tank',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=336214',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=packs&sort=price&order=asc&match=pleb'
  },
  {
    title: 'UBERNORM AMNIO-TANK',
    image: '/images/shop/amnio_uber.png',
    customizationOption: 'MEDIUM',
    tokenMiningBonus: '+5%',
    totalMints: '1,235',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&template_id=336216',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=336216',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=packs&sort=price&order=asc&match=uber'
  },
  {
    title: 'HI-CLONE AMNIO-TANK',
    image: '/images/shop/amnio_hiclone.png',
    customizationOption: 'ADVANCED',
    tokenMiningBonus: '+10%',
    totalMints: '444',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&template_data:text.name=Citizen%20Hi-Clone%20-%20Amnio-Tank',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=336217',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=packs&sort=price&order=asc&match=hi-clone'
  },
  {
    title: 'PLEB CITIZENS',
    image: '/images/shop/citizen_pleb.png',
    customizationOption: 'BASIC',
    tokenMiningBonus: 'NONE',
    totalMints: '2,135',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&template_data:text.name=Clashdome%20Citizen%20-%20Pleb',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=pleb&schema=citizen',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=citizen&sort=price&order=asc&match=pleb'
  },
  {
    title: 'UBERNORM CITIZENS',
    image: '/images/shop/citizen_uber.png',
    customizationOption: 'MEDIUM',
    tokenMiningBonus: '+5%',
    totalMints: '1,235',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&template_data:text.name=Clashdome%20Citizen%20-%20UberNorm',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=ubernorm&schema=citizen',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=citizen&sort=price&order=asc&match=uber'
  },
  {
    title: 'HI-CLONE CITIZENS',
    image: '/images/shop/citizen_hiclone.png',
    customizationOption: 'ADVANCED',
    tokenMiningBonus: '+10%',
    totalMints: '444',
    buyAtomic: 'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&template_data:text.name=Clashdome%20Citizen%20-%20Hi-Clone',
    buyNfthive: 'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=hi-clone&schema=citizen',
    buyNefty: 'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=citizen&sort=price&order=asc&match=hi-clone'
  }
]

function MiningHub() {

  const [slotes, setSlotes] = useState()
  const [tools, setTools] = useState()
  const [wallet, setWallet] = useState()

  const wax = useSelector(state => state.wax)

  const getCraftData = async () => {
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

    toolsConfigRows = toolsConfigRows.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));

    setTools(toolsConfigRows)

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
    console.log("walletsConfig", walletsConfig)

    setWallet(walletsConfig.rows)

  }

  useEffect(() => {
    if (wax && wax.rpc) {
      getCraftData()
    }
  }, [wax])


  return (
    <section className='assetshop-section mining-hubs' id='mining-hub'>
      <h1 className='head-text'>GAMING HUB</h1>
      <div className='description'>
        <p>
          The typical starting point for ClashDome are its
          Citizen NFTs. Once you have staked your character in the
          Gaming HUB you will have access to the Arcade games’ Free
          Tier. You can get a predefined Citizen or make your own
          customization by getting an Amnio-Tank. As soon as you
          are installed in your apartment you can make it cozy by
          installing additional mining tools or getting all sorts
          of props and decoration. Make yourself at home at the
          Dome!
        </p>
      </div>
      <div className='cards-wrapper'>
        {
          citizensData.map(cardInfo => {
            return <CitizenBuyCard info={cardInfo} key={cardInfo?.title} />
          })
        }
        {
          wallet && wallet.length > 0 && wallet.map((item, index) => {
            return <WalletCraftCard
              key={item?.template_id}
              data={item}
              crafting={item.craft}
              template_id={item.template_id}
              wax={wax}
            />
          })
        }
        {
          slotes && slotes.length > 0 && slotes.map((item, index) => {
            return <AreaCraftCard
              key={item?.slots_name}
              name={item.slots_name}
              image={item.img}
              crafting={item.craft}
              template_id={item.template_id}
              wax={wax}
            />
          })
        }
        {
          tools && tools.length > 0 && tools.map((item, index) => {
            return <CraftCard
              data={item}
              key={item?.tool_name}
              wax={wax}
              crafting={item.craft}
            />
          })
        }


      </div>
    </section>
  )
}

export default MiningHub