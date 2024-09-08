import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../storeContext/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {
  const {cartItem,addToCart,removeFromCart} = useContext(StoreContext)
  return (
    <div className="Food-Item">
        <div className="Food-Img-Count">
            <img className='Food-Img' src={image} alt=''/>
            {!cartItem[id]
                ? <img className="Add" onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=""  />
                : <div className="Food-Count">
                    <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                    <p>{cartItem[id]}</p>
                    <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
                </div>
            
              }
        </div>
        <div className="Food-Info">
            <div className="Food-Name">
                <p>{name}</p>
                <img src={assets.rating_starts}/>
            </div>
            <p className="Food-Desc">{description}</p>
            <p className="Food-Price">${price}</p>
        </div>
    </div>
  )
}

export default FoodItem
