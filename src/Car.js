import React from 'react'

export default function Car({car, toggleComplete}) {
    
    function handleClick() {
        toggleComplete(car.id);
    }
    
    return (
        <div>
            <li
                style={{
                    textDecoration: car.completed ? "line-through" : null
                }}
            >{car.name}<button onClick={handleClick}>Sell</button></li>
        </div>
    )
}