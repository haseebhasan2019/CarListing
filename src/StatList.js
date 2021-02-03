import React from 'react'
import Stat from './Stat'

export default function StatList( {stats}) {
    return (
        stats.map(stat =>{
            return <Stat key={stat.id} stat = {stat}/>
        })
    )
}
