import React from 'react'
import Car from './Car'

export default function CarList( {cars, toggleComplete}) {
    return (
        cars.map(car =>{
            return <Car key={car.id} car = {car} toggleComplete={toggleComplete}/>
        })
    )
}
