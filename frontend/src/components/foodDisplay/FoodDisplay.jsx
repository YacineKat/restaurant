import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../storeContext/StoreContext'
import FoodItem from '../foodItem/FoodItem'
const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext)
  return (
    <div className='Food-Display' id='Food-Display'>
      <h2>Top Dishes near you</h2>
      <div className="Food-List">
        {food_list.map((item,index)=>{
          if(category==='All' || item.category===category){
            return <FoodItem key={index} id={item._id} name={item.name} price={item.price} description={item.description} image={item.image}/>
          }
        })}
      </div>
    </div>
    
  )
}

export default FoodDisplay
