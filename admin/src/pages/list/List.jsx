import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify';

const List = ({url}) => {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove/`, { id: foodId });
      await fetchList();
      if (response.data.success) {
        toast.success("Food deleted successfully");
      } else {
        toast.error("Error deleting food");
      }
    } catch (error) {
      toast.error("Error deleting food");
      console.error(error);
    }
  }

  const calculateTotal = () => {
    const totalItems = list.length;
    const totalPrice = list.reduce((acc, item) => acc + item.price, 0);
    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
    setIsModalOpen(true); 
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='List Add Flex-Col'>
      <p className="List-Title">All Foods List</p>
      <div className="List-Table">
        <div className="List-Table-Format Title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {Array.isArray(list) && list.map((item, index) => (
          <div className="List-Table-Format" key={index}>
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className='Cursor'>X</p>
          </div>
        ))}
      </div>

      <button className="Calculate-Button" onClick={calculateTotal}>Calculate Total</button>

      {isModalOpen && (
        <div className="Modal-Overlay">
          <div className="Modal-Content">
            <h2>Total Summary</h2>
            <p>Total Orders: {totalItems}</p>
            <p>Total Price: ${totalPrice}</p>
            <button onClick={closeModal} className="Close-Button">Close</button>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default List;
