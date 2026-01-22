import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.userId : null;

      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/payment/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setPayments(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Error fetching payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <>

      <Helmet>
        <title>Purchase History | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="View your purchase history and track your orders on ARTS OF IMAGINATION EVER. Manage your past transactions and access premium content." />
        <meta property="og:title" content="Purchase History | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="View your purchase history and track your orders on ARTS OF IMAGINATION EVER. Manage your past transactions and access premium content." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-4">Payment History</h1>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <p>No payments found.</p>
            ) : (
              payments.map((payment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h2 className="font-semibold">{payment.status === "succeeded" ? "Payment Successful" : "Payment Failed"}</h2>
                  <p>Amount: ${payment.amount}</p>
                  <p>Payment Method: {payment.method}</p>
                  <p>Date: {new Date(payment.createdAt).toLocaleString()}</p>
                  <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">View Receipt</a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default PaymentHistory;