import React, { useEffect, useRef, useState } from 'react';
import RingyDingy from '../../components/GameLoaders/RingyDingy';
import './RingyDingyTest.css';


const RingyDingyTest = (props) => {

    const [wax, setWax] = useState(props.wax);

    useEffect(() => {

        // 
    }, [])


    return (
        
        <div className="section ringy-dingy">
            <RingyDingy wax={props.wax} loginFromGame={props.loginFromGame} serverType={process.env.REACT_APP_SERVER_TYPE}/>;
        </div>
    );
}

export default RingyDingyTest;
