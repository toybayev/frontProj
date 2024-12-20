import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://209.38.245.158:8001/api/v1/courses/get-orders/', {
          headers: {
            Authorization: `JWT ${localStorage.getItem('accessToken')}`,
          },
        });
        console.log('Orders Response:', response.data);
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to fetch your purchases.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your purchases...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Purchases</h1>
      {orders.length === 0 ? (
        <p className="text-center">You have no purchases yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="font-bold text-xl mb-2">Order #{order.id}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Total Cost: <span className="font-bold">{order.total_cost} KZT</span>
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Created At: {new Date(order.created_at).toLocaleString()}
              </p>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-bold mb-2">Shipping Details:</h4>
                <p className="text-sm text-gray-500">City: {order.shipping.city}</p>
                <p className="text-sm text-gray-500">Address: {order.shipping.address}</p>
                <p className="text-sm text-gray-500">Delivery Cost: {order.shipping.cost} KZT</p>
                <p className="text-sm text-gray-500">
                  Delivery Time: {order.shipping.delivery_time} days
                </p>
              </div>

              {order.shipping.certificates.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold mb-2">Certificates:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.shipping.certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="border p-4 rounded-lg shadow-md flex items-center space-x-4"
                      >
                        <div>
                          <p className="text-sm font-bold">
                            Certificate Number: {certificate.certificate_number}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {certificate.is_shipping ? 'Delivered' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.courses && Array.isArray(order.courses) && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold mb-2">Courses:</h4>
                  <ul className="list-disc pl-6">
                    {order.courses.map((course, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {course.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
