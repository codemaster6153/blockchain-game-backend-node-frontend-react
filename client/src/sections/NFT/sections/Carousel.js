import Carousel from "react-multi-carousel";
import React, { useState } from 'react'
import "react-multi-carousel/lib/styles.css";
import CarouselCard from "./CarouselCard";
import {CustomLeftArrow, CustomRightArrow} from "./RightArrow";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30
  }
};


// Because this is an inframe, so the SSR mode doesn't not do well here.
// It will work on real devices.
const Simple = () => {
    const [autoscroll, setAutoscroll] = useState(true)
    return (
        <Carousel
        //   deviceType={deviceType}
        itemClass="image-item"
        responsive={responsive}
        showDots={true}
        customRightArrow={<CustomRightArrow setScroll={setAutoscroll} scroll={autoscroll} />}
        customLeftArrow={<CustomLeftArrow setScroll={setAutoscroll} scroll={autoscroll} />}
        autoPlay={autoscroll}
        autoPlaySpeed={3000}
        infinite={true}
        renderDotsOutside={true}
        >
            <CarouselCard 
              img="1_active" 
              heading="ACTIVE EARNING (playing)" 
              text="Let your character earn a wage playing the Arcades. Whether you are playing Duels for free of in the Wax tiers, you'll earn $LUDIO." />
            <CarouselCard 
              heading="PASSIVE EARNING"
              img="2_passive"
              text="Install additional equipment in your character's appartment that will make you earn $CARBZ or $JIGOWATTS passively."
            />
            <CarouselCard 
              heading="NFT CRAFTING"
              img="5_nft_crafting"
              text="Only Citizens have the ability of crafting NFTs. Use $LUDIO and $JIGOWATTS to craft new equipment, then stake it or sell it."
            />
            <CarouselCard 
              heading="BREEDING"
              img="4_breeding"
              text="Get Breeding Duel passes in Tournaments. Plan a rendezvous Duel with a rival. Play. Win. Earn your child's Amnio-Tank custody."
            />
            <CarouselCard 
              img="6_airdrops"
              heading="TOKEN AIRDROPS"
              text="$CARBZ and  $JIGOWATTS will be airdropped to citizens (not unedited Amnio-Tanks) before the mining metagame begins."
            />
        </Carousel>
    );
};

export default Simple;
