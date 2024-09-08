import React, { useState } from 'react'
import './ExploreMenu.css'
import {menu_list} from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='Explore-Menu' id='Explore-Menu'>
      <h1>Explore Our Menu</h1>
      <p className='Explore-Menu-Text'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.</p>
      <div className="Explore-Menu-List">
        {
          menu_list.map((item,index)=>(
            <div 
              onClick={()=>setCategory(prev=>prev===item.menu_name
              ?'All':item.menu_name)} 
              className="Explore-Menu-Item" key={index}
            >
              <img className={category===item.menu_name?'active':''} src={item.menu_image} alt=''/>
              <p>{item.menu_name}</p >
            </div>
          ))
        }
      </div>
      <hr/>
    </div>
  )
}

export default ExploreMenu
