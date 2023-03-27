import * as React from "react";

const CustomLeftArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return(
        <button onClick={handleClick} className="custom-left-arrow" >
            <img src="/images/nft/arrow-left.png" />
        </button>
    )
}
const CustomRightArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return( 
    <button onClick={handleClick} className="custom-right-arrow" >
        <img src="/images/nft/arrow-right.png" />
    </button>
    )
};



export {
  CustomLeftArrow,
  CustomRightArrow,
};