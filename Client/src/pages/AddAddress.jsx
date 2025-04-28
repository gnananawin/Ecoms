import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/address/add', { address });

      if (data.success) {
        toast.success("Address saved successfully");
        navigate('/cart');
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='mt-16 pb-16 px-4 md:px-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>
        Add Shipping <span className='font-semibold text-green-600'>Address</span>
      </p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
            <div className='grid grid-cols-2 gap-3'>
              <InputField handleChange={handleChange} address={address} name='firstName' type='text' placeholder='First Name' />
              <InputField handleChange={handleChange} address={address} name='lastName' type='text' placeholder='Last Name' />
            </div>
            <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder='Email address' />
            <InputField handleChange={handleChange} address={address} name='street' type='text' placeholder='Street' />
            <div className='grid grid-cols-2 gap-3'>
              <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder='City' />
              <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder='State' />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <InputField handleChange={handleChange} address={address} name='zipcode' type='text' placeholder='Zip code' />
              <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder='Country' />
            </div>
            <InputField handleChange={handleChange} address={address} name='phone' type='text' placeholder='Phone' />
            <button
              type='submit'
              className='w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition'
            >
              SAVE ADDRESS
            </button>
          </form>
        </div>
        <img
          className='md:mr-16 mb-16 md:mt-0 w-full max-w-xs mx-auto'
          src={assets.add_address_iamge}
          alt='Add Address'
        />
      </div>
    </div>
  );
};

export default AddAddress;
