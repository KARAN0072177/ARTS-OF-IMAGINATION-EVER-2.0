// src/components/PaymentCancel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="payment-cancel-container mx-auto my-24 px-8 py-12 max-w-4xl shadow-lg shadow-blue-900/60 bg-[#121E3A] ">
      <h1 className="text-3xl font-semibold text-center text-red-600">Payment Cancelled</h1>
      <p className="text-lg text-[#D1D5DB] text-center">Unfortunately, your payment was not completed. You can try again later.</p>
      <div className="text-center mt-6">
        <Link to="/" className="text-white bg-[#1E40AF] hover:bg-[#1E3A8A] px-6 py-2 rounded-md">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;