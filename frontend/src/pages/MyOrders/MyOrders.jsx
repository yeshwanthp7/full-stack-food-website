import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setData([]);
    }
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {(data || []).map((order,index)=>{
          const itemsList = order.items || [];
          return (
            <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>{itemsList.map((item,idx)=>{
                  if (idx === itemsList.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                })}</p>
                <p>{currency}{order.amount}.00</p>
                <p>Items: {itemsList.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status || "Food Processing"}</b></p>
                <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
