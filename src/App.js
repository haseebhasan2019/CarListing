import React, {useState, useRef } from 'react'
import CarList from './CarList'
import {v4 as uuidv4} from 'uuid'


function App() {
  const [cars, setListings] = useState([])
  const make = useRef()
  const model = useRef()
  const year = useRef()
  const price = useRef()
  const seller = useRef()

  
  function handleAddListing(e) {
    const name = make.current.value
    const name2 = model.current.value
    if (name === '' || name2 === '') return 
    setListings(prevListing => {
      return [...prevListing, {id: uuidv4(), name: name + " " + name2, complete: false}]
    })
    make.current.value = null
    model.current.value = null
  }
  
  return (
    <>
      <CarList cars = {cars}/>
      <input ref={make} type="text" placeholder="make"/>
      <input ref={model} type="text" placeholder="model"/>
      <input ref={year} type="text" placeholder="year"/>
      <input ref={price} type="text" placeholder="price"/>
      <input ref={seller} type="text" placeholder="seller"/>

      <button onClick={handleAddListing}>Add Listing</button>
    </>
  )
}

export default App;
