import React, { useContext } from 'react'
import { StoreContext } from '../../storeContext/StoreContext'
import { useNavigate } from 'react-router-dom'

const CartTotal = () => {
  const navigate = useNavigate();

    const {getTotalCartAmount} = useContext(StoreContext)
  return (
    <div className="Cart-Total">
          <h2>Cart Total</h2>
          <div>
            <div className="Cart-Total-Details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="Cart-Total-Details">
              <p>Delivery</p>
              <p>${getTotalCartAmount()&&2}</p>
            </div>
            <div className="Cart-Total-Details">
              <p>Total</p>
              <p>${getTotalCartAmount()+(getTotalCartAmount()&&2)}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
  )
}

export default CartTotal
