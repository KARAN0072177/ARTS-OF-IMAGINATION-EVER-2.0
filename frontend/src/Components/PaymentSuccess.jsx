import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const savePurchaseHistory = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const authMethod = localStorage.getItem('loginMethod');

      // Stripe session ID passed as query param from Stripe redirect
      const stripeSessionId = searchParams.get("session_id");

      if (!user || !authMethod || !stripeSessionId) return;

      try {
        // Fetch session info from Stripe to get amount, currency, and receipt_url
        const { data: sessionDetails } = await axios.get(`http://localhost:5000/api/stripe/session/${stripeSessionId}`);

        const historyPayload = {
          userId:
            authMethod === 'google' ? user.googleId :
              authMethod === 'github' ? user.githubId :
                authMethod === 'discord' ? user.discordId :
                  authMethod === 'email' || authMethod === 'manual' ? user._id :
                    null,
          username: user.username,
          email: user.email,
          authMethod,
          amount: sessionDetails.amount_total / 100, // Stripe sends in cents
          currency: sessionDetails.currency,
          stripeSessionId: sessionDetails.id,
          product: 'Premium Access', // ✅ <-- ADD THIS
          receipt_url: sessionDetails.charges?.data[0]?.receipt_url || ''
        };

        await axios.post('http://localhost:5000/api/payments/save', historyPayload);
        console.log("🧾 Purchase history saved!");
      } catch (error) {
        console.error("❌ Failed to save purchase history:", error);
      }
    };

    savePurchaseHistory();
  }, [searchParams]);

  return (

    <>
      <Helmet>
        <title>Payment Success | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Your payment was successful! Thank you for your purchase on ARTS OF IMAGINATION EVER. Enjoy your premium content." />
        <meta property="og:title" content="Payment Success | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Your payment was successful! Thank you for your purchase on ARTS OF IMAGINATION EVER. Enjoy your premium content." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="payment-success-container mx-auto my-24 px-8 py-12 max-w-4xl  shadow-blue-900/60 bg-[#121E3A] shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-xl text-center text-[#D1D5DB] mb-6">
          Thank you for your purchase. Your payment was processed successfully.
        </p>

        <div className="flex justify-center space-x-6 mt-6">
          <Link
            to="/pgallery"
            className="px-6 py-3 text-black bg-gradient-to-r from-blue-500 to-teal-400 rounded-full text-lg font-semibold hover:scale-105 transition duration-300"
          >
            Back to Premium Gallery
          </Link>

          <Link
            to="/phistory"
            className="px-6 py-3 text-black bg-gradient-to-r from-blue-500 to-teal-400  rounded-full text-lg font-semibold hover:scale-105 transition duration-300"
          >
            View Purchase History
          </Link>
        </div>
      </div>

    </>
  );
};

export default PaymentSuccess;