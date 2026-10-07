import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setOrders([...response.data.data].reverse());
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Error fetching orders");
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data && response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  }


  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {(orders || []).map((order, index) => {
          const itemsList = order.items || [];
          const address = order.address || {};
          return (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {itemsList.map((item, idx) => {
                  if (idx === itemsList.length - 1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>{(address.firstName || "") + " " + (address.lastName || "")}</p>
              <div className='order-item-address'>
                <p>{(address.street || "") + ","}</p>
                <p>{(address.city || "") + ", " + (address.state || "") + ", " + (address.country || "") + ", " + (address.zipcode || "")}</p>
              </div>
              <p className='order-item-phone'>{address.phone || ""}</p>
            </div>
            <p>Items : {itemsList.length}</p>
            <p>{currency}{order.amount}</p>
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        )})}
      </div>
    </div>
  )
}

export default Order
