import React from 'react';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-center p-6">
      <div className="bg-[#121E3A] shadow-lg shadow-blue-900/60 p-8 rounded-2xl shadow-xl max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-[#D1D5DB] mb-6">Thank you for upgrading to Premium!</p>
        <a
          href="/"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Success;