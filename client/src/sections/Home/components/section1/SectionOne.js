import React from 'react'
import { useDispatch } from 'react-redux';
import './index.css'

function SectionOne() {
    const dispatch = useDispatch();
  return (
    <div id="section-one" className='section-one'>

        <div className='img-bg'>
            <div className='content-container'>
                <div className='content-right'>
                    <div className='section-video'>
                        <div>
                            <img src="/images/newHome/header-video-frame.svg" />
                            <video
                                src='/images/newHome/video_home.mp4'
                                autoPlay={true}
                                loop={true}
                                playsInline={true}
                                muted={true}
                            />
        
                        </div>
                    </div>
                    <div className='big-bold-text'>
                        <p>PLAY & EARN IN A FUN WAY</p>
                    </div>
                    <div className='big-normal-text'>
                        <p>Get your Citizen NFT and earn tokens in our CASUAL ARCADE GAMES. Win Duels against other players to start earning LUDIO now!</p>
                    </div>
                    <div className='buttons-container'>
                        <div className='button'>
                            <span>GET YOUR CITIZEN HERE</span>
                            <div>
                                <a target="_blank" href='https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&schema_name=citizen&sort=price&symbol=WAX'>
                                    <img src="/images/newHome/atom.svg" />
                                </a>
                                <a target="_blank" href='https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&schema_name=citizen&sort=price&order=asc'>
                                    <img src="/images/newHome/nb.svg" />
                                </a>
                                <a target="_blank" href='https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&schema=citizen'>
                                    <img src="/images/newHome/icon.svg" />
                                </a>
                            </div>
                        </div>
                        <div className='button' onClick={() => {
                            dispatch({
                                type: 'SET_CLAIM_DUMMY_MODAL',
                                payload: null
                            })
                        }}>
                            <span>OR CLAIM A FREE DUMMY</span>
                            <img src="/images/newHome/claim-dummy.svg" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div className='wax-run'>
            <p>
                WE RUN ON
                <img src="/images/wax_logo.png" alt="Logo" />
            </p>
        </div>
    </div>
  )
}

export default SectionOne