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
    const name3 = year.current.value
    const name4 = price.current.value
    const name5 = seller.current.value
    if (name === '' || name2 === '' || name3 === '' || name4 === '' || name5 === '') return 
    setListings(prevListing => {
      return [...prevListing, {id: uuidv4(), name: name + " " + name2 + " " + name3
      + ": " + name4 + " -" + name5 + "     ", completed: false}]
    })
    make.current.value = null
    model.current.value = null
    year.current.value = null
    price.current.value = null
    seller.current.value = null
  }

  function toggleComplete(id) {
    setListings(
      cars.map(car => {
        if (car.id === id) {
          return {
            ...car,
            completed: !car.completed
          };
        }
        return car;
      })
    );
  }
  
  return (
    <>
      <h1>Welcome to Haseeb's Automobile Listings!</h1>
      <h2>Add a Listing:</h2>
      <input ref={make} type="text" placeholder="make"/>
      <input ref={model} type="text" placeholder="model"/>
      <input ref={year} type="text" placeholder="year"/>
      <input ref={price} type="text" placeholder="price"/>
      <input ref={seller} type="text" placeholder="seller"/>

      <button onClick={handleAddListing}>Add Listing</button>
      <h2>Our Listings:</h2>
      <CarList cars = {cars} toggleComplete={toggleComplete}/>

    </>
  )
}

export default App;
