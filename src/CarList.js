import React from 'react'
import Car from './Car'

export default function CarList( {cars}) {
    return (
        cars.map(todo =>{
            return <Car key={todo.id} todo = {todo} />
        })
    )
}
