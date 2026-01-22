import React from 'react';

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-center p-6">
      <div className=" bg-[#121E3A] shadow-lg shadow-blue-900/60 p-8 rounded-2xl  max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-[#D1D5DB] mb-6">Your payment was not completed.</p>
        <a
          href="/preminum"
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default Cancel;