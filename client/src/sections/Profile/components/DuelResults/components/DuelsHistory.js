import React, { useEffect, useRef, useState } from 'react'
import './duelsHistory.css'
import SelectGameDropdown from './SelectGameDropdown';
import SelectPriceDropdown from './SelectPriceDropdown';
import {useDebounce} from 'use-debounce'
import DuelCard from './DuelCard';

function DuelsHistory({wax}) {

    let nextDuel = useRef();
    let ary = useRef();
    let limit = 20;
    const [duals, setDuals] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [gameFilter, setGameFilter] = useState()
    const [priceFilter, setPriceFilter] = useState()
    const [searchText, setSearchText] = useState()
    const [showMyDuels, setShowMyDuels] = useState(false)
    const [debouncedSearchText] = useDebounce(searchText, 500)

    const gameRef = useRef()
    const priceRef = useRef()
    const searchTextRef = useRef()

    const setSearchTextInput = (e) => {
        if(e.target.value.length === 0){
            setSearchText(undefined)
        }else{
            setSearchText(e.target.value)
        }
    }

    const getDuals = async () => {

        // let res = await fetch('/api/clashdome-game/get-duels/' + nextDuel + '/' + limit);
        let res = await fetch(
            !showMyDuels? 
                `/api/clashdome-game/get-duels-filter/${nextDuel.current}/${limit}/${gameRef.current}/${priceRef.current}/${searchTextRef.current}`
            :   '/api/clashdome-game/get-player-duels/' + wax.userAccount + '/50');
        let result = await res.json();

        setLoading(false)

        // value.rows = value.rows.filter((row) => {return  row.fee.includes("CREDITS");});

        if(result.length > 0 && nextDuel.current !== result[result.length - 1].id){
            ary.current = [...ary.current, ...result];
            console.log("setting the duals :", ary.current)
            setDuals([...ary.current]);
            nextDuel.current = result[result.length - 1].id;
        }

        if(result.length === 0 && nextDuel.current === undefined){
            setDuals([])
        }

        if (result.length < limit) {
            nextDuel.current = "END";
        }
    }


    const LoadMore = async () => {
        if (document.documentElement.scrollTop + window.innerHeight + 1 >= document.scrollingElement.scrollHeight && nextDuel.current !== "END") {
            getDuals()
        }
    }

    useEffect(() => {
        if(duals.length === 0){
            setIsEmpty(true)
        }else{
            setIsEmpty(false)
        }
    }, [duals])

    useEffect(() => {
        gameRef.current = gameFilter
        priceRef.current = priceFilter
        nextDuel.current = undefined
        searchTextRef.current = debouncedSearchText
        ary.current=[]
        getDuals()
    }, [gameFilter, priceFilter, debouncedSearchText, showMyDuels])

    useEffect(() => {
        ary.current = []
        getDuals()

        window.addEventListener('scroll', LoadMore)

        return () => {
            window.removeEventListener('scroll', LoadMore)
        }
    }, [])

    return (
        <div className='duels-history'>
            <div className='section-header'>
                <div className='table-title'>
                    <p>DUELS HISTORY</p>
                </div>
                <div className='dropdowns'>
                    <span>My Duels</span> 
                    <input type="checkbox" className='checkbox' value={showMyDuels} onChange={e => setShowMyDuels(e.target.checked)} />
                    <SelectGameDropdown game={gameFilter} setGame={setGameFilter} />
                    <SelectPriceDropdown price={priceFilter} setPrice={setPriceFilter} />
                    <input style={{borderRadius: '6px', border: 'none', padding: '0 5px', height: 30}} type={'text'} placeholder="Account or Duel ID" onChange={setSearchTextInput} value={searchText} />
                </div>
            </div>
            {
                loading ?
                <img className="loading" src="/images/loading_icon.png" />:
                isEmpty ?
                <p className='no-result-text'>There are no results yet !</p>:
                <div className="body">
                    {
                        duals.length > 0 && duals.map((item) => {
                            return <DuelCard item={item} key={item.id} account={wax.userAccount} game={item.game}/>
                        })
                    }
                </div>
            }
        </div>
    )
}

export default DuelsHistory
