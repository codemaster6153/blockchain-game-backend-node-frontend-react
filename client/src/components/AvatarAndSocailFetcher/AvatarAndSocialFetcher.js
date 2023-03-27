import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function AvatarAndSocialFetcher() {

    const dispatch = useDispatch()

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const fetchUsername = async () => {
        let payload = {}
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        if(rpc != undefined){
            let result = await rpc.get_table_rows({
                json: true,
                code: "clashdomewld",
                scope: "clashdomewld",
                table: "social",
                limit: 500,
                lower_bound: null,
                upper_bound: null
            });
            let players = result.rows;

            while(result.next_key.length > 0) {

                result = await rpc.get_table_rows({
                    json: true,
                    code: "clashdomewld",
                    scope: "clashdomewld",
                    table: "social",
                    limit: 500,
                    lower_bound: result.next_key,
                    upper_bound: null
                });
                players = players.concat(result.rows);
            }

            players.map((player) => {
                payload[`${player.account}`] = JSON.parse(player.data).cn
            })

            dispatch({
                type: "SET_SOCIAL",
                payload: payload
            })

            const friends = {}
            players.map((player) => {
                friends[`${player.account}`] = JSON.parse(player.data).fr
            })
            dispatch({
                type: 'SET_SOCIAL_FRIENDS',
                payload: friends
            })
        }
    }

    const fetchAvatars = async () => {
        let payload = {}
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        if(rpc != undefined){
            let result = await rpc.get_table_rows({
                json: true,
                code: "clashdomewld",
                scope: "clashdomewld",
                table: "citiz",
                limit: 500,
                lower_bound: null,
                upper_bound: null
            });
            let players = result.rows;

            while(result.next_key.length > 0) {

                result = await rpc.get_table_rows({
                    json: true,
                    code: "clashdomewld",
                    scope: "clashdomewld",
                    table: "citiz",
                    limit: 500,
                    lower_bound: result.next_key,
                    upper_bound: null
                });
                players = players.concat(result.rows);
            }

            players.map((player) => {
                payload[`${player.account}`] = `https://cf-ipfs.com/ipfs/${player.avatar}`
            })

            dispatch({
                type: "SET_CITIZ",
                payload: payload
            })
        }
    }

    const fetchVisitors = async () => {
        let payload = {}
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        if(rpc != undefined){
            let result = await rpc.get_table_rows({
                json: true,
                code: "clashdomewld",
                scope: "clashdomewld",
                table: "apartments",
                limit: 500,
                lower_bound: null,
                upper_bound: null
            });
            let apartments = result.rows;

            while(result.next_key.length > 0) {

                result = await rpc.get_table_rows({
                    json: true,
                    code: "clashdomewld",
                    scope: "clashdomewld",
                    table: "apartments",
                    limit: 500,
                    lower_bound: result.next_key,
                    upper_bound: null
                });
                apartments = apartments.concat(result.rows);
            }

            apartments.map((apartment) => {
                payload[`${apartment.account}`] = JSON.parse(apartment.collection);
            })

            dispatch({
                type: "SET_VISIT",
                payload: payload
            })
        }
    }

    const fetchTrailDummies = async () => {
        let payload = {}
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        if(rpc != undefined){
            let result = await rpc.get_table_rows({
                json: true,
                code: "clashdomewld",
                scope: "clashdomewld",
                table: "trials",
                limit: 500,
                lower_bound: null,
                upper_bound: null
            });
            let players = result.rows;

            while(result.next_key.length > 0) {

                result = await rpc.get_table_rows({
                    json: true,
                    code: "clashdomewld",
                    scope: "clashdomewld",
                    table: "trials",
                    limit: 500,
                    lower_bound: result.next_key,
                    upper_bound: null
                });
                players = players.concat(result.rows);
            }

            players.map((player) => {
                payload[`${player.account}`] = player.asset_id;
            })

            dispatch({
                type: "SET_TRIAL",
                payload: payload
            })
        }
    }


    useEffect(() => {
        (async () => {
            fetchVisitors();
            await sleep(250);
            fetchUsername();
            await sleep(250);
            fetchAvatars();
            await sleep(250);
            fetchTrailDummies()
            })();
    }, [])
    return (
        <div></div>
    )
}

export default AvatarAndSocialFetcher