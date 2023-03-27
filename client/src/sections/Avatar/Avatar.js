import React, { useEffect, useRef, useState } from 'react';
import AvatarEditor from '../../components/GameLoaders/AvatarEditor';
import './Avatar.css';


const Avatar = (props) => {

    const [wax, setWax] = useState(props.wax);

    useEffect(() => {

        // 
    }, [])


    return (
        <div className="section avatar">
            <AvatarEditor wax={props.wax}/>;
        </div>
    );
}

export default Avatar;
