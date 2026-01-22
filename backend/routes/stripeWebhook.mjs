import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import PaymentHistory from '../models/PaymentHistory.mjs';
import { sendReceiptEmail } from './emailService.mjs'; // import the function

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const metadata = session.metadata || {};
      console.log("📦 Webhook Metadata:", metadata);

      const userId = metadata.userId;
      const authMethod = metadata.authMethod;
      const username = metadata.username;

      // ✅ Validate required fields only
      if (!userId || !authMethod || !username) {
        console.warn("⚠️ Missing required metadata. Skipping save.");
        return res.status(400).send("Missing metadata fields");
      }

      const amount = session.amount_total / 100;
      const currency = session.currency;
      const email = session.customer_details?.email || undefined;

      let receipt_url = null;

      if (session.payment_intent) {
        // Get the payment intent
        const intent = await stripe.paymentIntents.retrieve(session.payment_intent, {
          expand: ['charges.data'] // Expand charges to get charge details
        });

        // Check for latest charge
        if (intent.latest_charge) {
          // Retrieve the charge using latest_charge
          const charge = await stripe.charges.retrieve(intent.latest_charge);

          // If charge data is found, retrieve the receipt_url
          if (charge && charge.receipt_url) {
            receipt_url = charge.receipt_url;
            console.log("💳 Receipt URL from latest charge:", receipt_url);
          } else {
            console.warn('⚠️ No receipt URL found in the charge.');
          }
        } else {
          console.warn('⚠️ No latest_charge found in the payment intent.');
        }
      }

      // Save payment record (including receipt_url)
      const newRecord = new PaymentHistory({
        userId,
        authMethod,
        username,
        email, // 👈 optional
        amount,
        currency,
        stripeSessionId: session.id,
        receipt_url,
        product: 'Premium Access'
      });

      await newRecord.save();
      console.log('✅ Payment history saved successfully.');

      // Send the payment receipt email to the user
      if (email && receipt_url) {
        console.log('Sending receipt email...');
        await sendReceiptEmail(email, username, amount, currency, receipt_url);
      }

    } catch (err) {
      console.error('❌ Error saving payment history from webhook:', err);
    }
  }

  res.status(200).send('Webhook received');
});

export default router;