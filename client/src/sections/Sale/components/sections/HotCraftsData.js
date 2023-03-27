export const data = [
    {
        template_id: process.env.REACT_APP_SERVER_TYPE === "testnet" ? 352325 : 398063,
        tool_name: "Proto Treadmill Dynamo",
        img: "Qmd1yu9UuHdYSWy1JKgfy4J2ax2pyhDy2eYdDHivSSajC1",
        schema_name: "tool",
        type: "Jigowatts",
        rarity: "Common",
        stamina_consumed: 10,
        battery_consumed: 0,
        integrity_consumed: 8,
        battery: 0,
        integrity: 100,
        cooldown: 7200,
        craft: [
            "3000.0000 LUDIO",
            "5000.0000 CDJIGO"
        ],
        rewards: [
            "6.0000 JIGO"
        ]
    },
    {
        account_limit: 1,
        available_items: 629,
        description: "This pack contains ornaments from 3 theme sets: Modding, Rug Pool and Gamerism. Collect the rarest items and do your best as an interior decorator. Having a nice apartment can help you earn Ludio passively!",
        extra_data: "",
        game: 'ClashDome',
        img: "QmNuvr238arvdmArcxKbTJEU7oBfxBrSuA7NnU8snXJ3Gd",
        item_name: "Pack Rug Pool/Gamerism/Modding",
        max_claimable: 1000,
        craft: ["2100.0000 LUDIO"],
        schema_name: "packs",
        template_id: process.env.REACT_APP_SERVER_TYPE === "testnet" ? 603794 : 643405,
        timestamp_end: 1676912400,
        timestamp_start: 1674493200,
        video: "",
        whitelist: []
    },
    {

        template_id:  process.env.REACT_APP_SERVER_TYPE === "testnet" ? 358834 : 398061,
        wallet_name: "Holo-Piggy Cryo Wallet",
        img: "QmR7bQB9R2wNhZfN9bhGBNPYCyqscJ2QFtiCZCzgSvVJ5W",
        schema_name: "wallet",
        rarity: "Rare",
        extra_capacity: 50,
        battery_consumed: 30,
        stamina_consumed: 45,
        craft: [
            "625.0000 LUDIO",
            "1700.0000 CDJIGO"
        ],
        whitelist: []
    },

] 
