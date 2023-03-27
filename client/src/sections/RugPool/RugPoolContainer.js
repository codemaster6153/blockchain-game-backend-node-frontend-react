import React, { useEffect, useRef, useState } from 'react';
import RugPool from '../../components/GameLoaders/RugPool';
import './RugPoolContainer.css';


const RugPoolContainer = (props) => {

    const [wax, setWax] = useState(props.wax);

    useEffect(() => {

        // 
    }, [])


    return (
        
        <div className="section rug-pool">
            <RugPool wax={props.wax} loginFromGame={props.loginFromGame} serverType={process.env.REACT_APP_SERVER_TYPE}/>;
        </div>
    );
}

export default RugPoolContainer;
