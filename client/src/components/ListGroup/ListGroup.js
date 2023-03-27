import React from "react";

const ListGroup = (props) => {
    const {items, textProperty, valueProperty, selectedItem, onItemSelect} = props;
    return (
        <div className="field has-addons">
            {
                items.map(item => (
                    <p className="control" key={item[valueProperty]}>
                        <button className={ item[valueProperty] === selectedItem ? "button is-primary" : "button"} onClick={() => onItemSelect(item[valueProperty])}>
                            <span>{item[textProperty]}</span>
                        </button>
                    </p>
                ))
            }
        </div>
    );
};

export default ListGroup;