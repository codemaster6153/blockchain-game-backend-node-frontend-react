import React, { useEffect, useRef, useState } from 'react';
import { HeroComponent, UpgradeSection } from '../../components/clashStruggle/Struggle';
import Submit from '../../components/clashStruggle/submit/Submit';
import './Struggle.css';


const Struggle = (props) => {

    const [wax, setWax] = useState(props.wax);
    const [activeNav, setActiveNav] = useState("SUBMIT")
    const upgrade = useRef()
    const submit = useRef()

    const handleNav = (e) => {
        setActiveNav(e.target.innerText)
    }

    useEffect(() => {
        if(activeNav === "UPGRADE"){
            submit.current.classList.remove("active")
            submit.current.style.paddingLeft = "19px"
            upgrade.current.classList.add("active")
        }else if(activeNav === "SUBMIT"){
            upgrade.current.classList.remove("active")
            submit.current.classList.add("active")
            submit.current.style.paddingLeft = "9px"
            submit.current.style.paddingRight = "43px"
        }
    }, [activeNav])


    return (
        <div className="section struggle">
            <HeroComponent />
            <div className="struggle-nav">
                <div className="middle">
                    <div className="nav-item active" onClick={handleNav} ref={upgrade}>
                        <p>UPGRADE</p>
                        {
                            activeNav === "UPGRADE" ?
                            <div className="active-button">
                                <div className="stick"></div>
                                <div className="stick"></div>
                                <div className="stick"></div>
                            </div>:
                            <></>
                        }
                    </div>
                    <div className="nav-item" onClick={handleNav} ref={submit}>
                        {
                            activeNav === "SUBMIT" ?
                            <div className="active-button">
                                <div className="stick"></div>
                                <div className="stick"></div>
                                <div className="stick"></div>
                            </div>:
                            <></>
                        }
                        <p>SUBMIT</p>
                    </div>
                </div>
            </div>
            {
                (activeNav === "UPGRADE") ?
                <UpgradeSection /> :
                <Submit />
            }
        </div>
    );
}

export default Struggle;
