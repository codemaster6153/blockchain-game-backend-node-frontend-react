import React, { useState, useEffect } from 'react'

function commafy(num, char) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join(char);
}

const StatsTable = () => {
    const [stats, setStats] = useState(null)

    const getStats = async () => {
        try {
            const res = await fetch("/api/stats/get-stats", {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const parsedRes = await res.json();
            setStats(parsedRes);
        } catch (error) {
            console.error(error)
        }
    }

    const calcPercent = (first, second, decimal) => {
        const percent = (first / second) * 100;
        return percent.toFixed(decimal)
    }

    useEffect(() => {
        getStats();
    }, [])

    if (!stats) return null;

    return (
        <div className='chart-column statsWrapper'>
            <div className='chart-container statsContainer'>
                <div className='chart-container-header wax'>
                    <div className='title'>
                        <p>MISC. STATS</p>
                    </div>
                </div>
                <div className='statsTextWrapper'>
                    {stats?.killedOrcs && <div>
                        -Killed orcs (yesterday): {commafy(stats?.killedOrcs, ",")}
                    </div>}

                    {stats?.pocketedBalls && <div>
                        -Pocketed balls (yesterday): {commafy(stats?.pocketedBalls, ",")}
                    </div>}

                    {stats?.privateDuels && stats?.freeDuels && <div>
                        -Private / Free duels (30 last days): {calcPercent(stats?.privateDuels, stats?.freeDuels, 1)} %
                    </div>}
                </div>

            </div>
        </div>
    )
}

export default StatsTable