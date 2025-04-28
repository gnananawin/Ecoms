import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Something went wrong while loading your orders");
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.length === 0 ? (
        <p className='text-center text-gray-500'>You haven't placed any orders yet.</p>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} className='mb-12 border border-gray-300 rounded-xl p-4'>

            <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col gap-1 mb-6'>
              <span>Order ID: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>Total Amount: {currency}{order.amount}</span>
            </p>

            {order.items.map((item, i) => {
              const product = item.product || {};
              return (
                <div
                  key={i}
                  className={`relative bg-white text-gray-500/70 flex flex-col md:flex-row items-center justify-between py-5 px-2 md:px-6 w-full max-w-5xl mx-auto ${
                    order.items.length !== i + 1 ? 'border-b border-gray-300' : ''
                  }`}
                >
                  <div className='flex items-center w-full md:w-1/3 mb-4 md:mb-0'>
                    <div className='bg-primary/10 p-4 rounded-lg'>
                      <img
                        src={product.image?.[0] || "/fallback.png"}
                        alt={product.name || "Product"}
                        className='w-16 h-16 object-cover rounded'
                      />
                    </div>
                    <div className='ml-4'>
                      <h2 className='text-lg font-medium text-gray-800'>{product.name || "Unnamed Product"}</h2>
                      <p className='text-sm'>Category: {product.category || "N/A"}</p>
                    </div>
                  </div>

                  <div className='w-full md:w-1/3 text-center mb-4 md:mb-0 space-y-1'>
                    <p className='text-base font-medium'>Quantity: {item.quantity || 1}</p>
                    <p className='text-base font-medium'>Status: {order.status}</p>
                    <p className='text-base font-medium'>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className='w-full md:w-1/3 text-right'>
                    <p className='text-primary text-lg font-semibold whitespace-nowrap'>
                      Amount: {currency}{(product.offerPrice || 0) * (item.quantity || 1)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
