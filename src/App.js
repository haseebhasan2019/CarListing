import React, {useState, useRef, useEffect} from 'react'
import CarList from './CarList'
import StatList from './StatList'
import {v4 as uuidv4} from 'uuid'
// import Axios from "axios";

function App() {
  
  const [cars, setListings] = useState([])

  const make = useRef()
  const model = useRef()
  const year = useRef()
  const price = useRef()
  const seller = useRef()
  let request;

  useEffect(() => {
    fetch("http://localhost:5000/listings")
    .then(response => 
      response.json().then(data => {
        console.log(data);
        data.listings.forEach((datum) => {
          setListings(prevListing => {
            return [...prevListing, {id: datum._id, name: datum.make + " " + datum.model + " " + datum.year
            + ": $" + datum.price + " -" + datum.seller + "     ", completed: false}]
          })
        })
      })
    );
  }, [request]); 
  
  // function handleAddListing(e) {
  //   const name = make.current.value
  //   const name2 = model.current.value
  //   const name3 = year.current.value
  //   const name4 = price.current.value
  //   const name5 = seller.current.value
  //   //Post to Database

  //   if (name === '' || name2 === '' || name3 === '' || name4 === '' || name5 === '') return 
  //   setListings(prevListing => {
  //     return [...prevListing, {id: uuidv4(), name: name + " " + name2 + " " + name3
  //     + ": " + name4 + " -" + name5 + "     ", completed: false}]
  //   })

  // }

  const handleAddListing = () => {
    const name = make.current.value
    const name2 = model.current.value
    const name3 = year.current.value
    const name4 = price.current.value
    const name5 = seller.current.value
    request = {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          make: name, 
          model: name2, 
          year: name3, 
          price: name4, 
          seller: name5
      })
    }
    fetch("http://localhost:5000/listings", request)
    make.current.value = null
    model.current.value = null
    year.current.value = null
    price.current.value = null
    seller.current.value = null
  }

  const [stats, setStats] = useState([])
  const getStats = () => {
    fetch("http://localhost:5000/listings/stats")
    .then(response => 
      response.json().then(data => {          
        data.stats.forEach((datum) => {
          setStats(prevStat => {
              return [...prevStat, {name: datum.make + " : " 
              + datum.count}]
          })
        })
      })
    )
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
      <button onClick={getStats}>Get Stats</button>
      <div>{stats}</div>
      {/* <StatList stats = {stats}/> */}

      <h2>Our Listings:</h2>
      <CarList cars = {cars} toggleComplete={toggleComplete}/>
    </>
  )
}

export default App;
