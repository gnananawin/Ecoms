import { useState, useEffect } from 'react';
import axios from 'axios';

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get('/api/address/user', { withCredentials: true });
        if (res.data.success) {
          setAddresses(res.data.addresses);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <h2>Your Addresses</h2>
      {addresses.length > 0 ? (
        <ul>
          {addresses.map((address) => (
            <li key={address._id}>
              <p>{address.firstName} {address.lastName}</p>
              <p>{address.street}, {address.city}, {address.state} - {address.zipcode}</p>
              <p>{address.phone}</p>
              <p>{address.email}</p>
              <p>{address.country}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses found</p>
      )}
    </div>
  );
};

export default MyAddresses;
