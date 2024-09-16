import React ,{useContext} from 'react'
import './Cart.css'  
import { StoreContext } from '../../storeContext/StoreContext'
import CartTotal from '../../components/cartTotal/CartTotal'
const Cart = () => {
  const {cartItem,food_list,removeFromCart, getTotalCartAmount} = useContext(StoreContext)
  return (
    <div className="Cart">
      <div className="Cart-Items">
        <div className="Cart-Title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
      </div>
      <br />
      <hr />
      {food_list.map((item,index)=>{
        if(cartItem[item._id]>0)
          {
            return (
              <div >
               <div className="Cart-Title Cart-Items-Item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p>${item.price*cartItem[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)} className='Cart-Remove'>X</p>
                </div>
                <hr />
              </div>
            )
          }
      })}
      <div className="Cart-Bottom">
        <CartTotal />
        <div className="Cart-PromoCode">
          <div>
            <p>If you have any promo code, Enter it here</p>
            <div className="Cart-PromoCode-Input">
              <input type="text" placeholder="Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
