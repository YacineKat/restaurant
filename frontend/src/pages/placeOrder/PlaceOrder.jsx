import React , {useContext} from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../storeContext/StoreContext'
import CartTotal from '../../components/cartTotal/CartTotal'
const PlaceOrder = () => {
  const {getTotalCartAmount} = useContext(StoreContext)
  return (
    <form className="Place-Order">
      <div className="Place-Order-Lift">
        <p className="Title">Delivery Information</p>
        <div className="Multi-Fields">
          <input type="text" placeholder='First Name'/>
          <input type="text" placeholder='Last Name'/>
        </div>
        <input type="email" placeholder='Email Address' />
        <input type="text" placeholder='Street' />
        <div className="Multi-Fields">
          <input type="text" placeholder='City'/>
          <input type="text" placeholder='State'/>
        </div>
        <div className="Multi-Fields">
          <input type="text" placeholder='Zip Code'/>
          <input type="text" placeholder='Country'/>
        </div>
        <input type="number" placeholder='Phone'/>
      </div>
      <CartTotal />
      
    </form>
  )
}
export default PlaceOrder
