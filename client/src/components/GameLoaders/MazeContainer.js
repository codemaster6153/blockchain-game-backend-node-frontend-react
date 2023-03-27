import React, { useEffect, useRef, useState } from 'react';
import Maze from '../../components/GameLoaders/Maze';
import './MazeContainer.css';

const MazeContainer = (props) => {

    const [wax, setWax] = useState(props.wax);

    useEffect(() => {
        // 
    }, [])


    return (
        
        <div className="section maze">
            <Maze wax={props.wax} loginFromGame={props.loginFromGame} serverType={process.env.REACT_APP_SERVER_TYPE}/>;
        </div>
    );
}

export default MazeContainer;
