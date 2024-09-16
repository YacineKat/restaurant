import React from 'react'
import NavBar from './components/navbar/NavBar'
import SideBar from './components/sidebar/SideBar'
import { Routes, Route } from 'react-router-dom';
import Add from './pages/add/Add';
import List from './pages/list/List';
import Orders from './pages/orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer />
      <NavBar/>
      <hr />
      <div className="App-Content">
        <SideBar/>
        <Routes>
          <Route path='/add' element={<Add url={url}/>} />
          <Route path='/list' element={<List url={url}/>} />
          <Route path='/orders' element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
