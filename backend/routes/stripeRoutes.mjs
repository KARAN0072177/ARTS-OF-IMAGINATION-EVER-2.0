import express from 'express';
import Stripe from 'stripe';
import DiscordLogin from '../models/DiscordLogin.mjs';
import DiscordUser from '../models/DiscordUser.mjs'; // ✅ Used for Discord ID lookup
import GitHubLogin from '../models/GitHubLogin.mjs';
import GoogleLogin from '../models/GoogleLogin.mjs';
import EmailUser from '../models/EmailUser.mjs';
import PaymentHistory from '../models/PaymentHistory.mjs';


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    const { userId, authMethod } = req.body;

    try {
        let user;

        switch (authMethod) {
            case 'google':
                user = await GoogleLogin.findOne({ googleId: userId });
                break;
            case 'github':
                user = await GitHubLogin.findOne({ githubId: userId });
                break;
            case 'discord':
                const discordUser = await DiscordUser.findOne({ discordId: userId });

                if (!discordUser) {
                    return res.status(404).send({ message: "Discord user not found" });
                }

                const discordLogin = await DiscordLogin.findOne({ userId: discordUser._id });

                // Construct a custom user object for metadata
                user = {
                    username: discordUser.username,
                    email: discordUser.email || '', // fallback to empty string
                    _id: discordUser._id,           // Optional: if needed elsewhere
                    ...discordLogin?._doc           // Spread login doc if needed
                };
                break;

            case 'manual':
            case 'email':
                user = await EmailUser.findOne({ email: userId });
                break;

            default:
                return res.status(400).send({ message: "Invalid authentication method" });
        }

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Premium Access' },
                    unit_amount: 5000
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,

            // ✅ Add metadata to carry user info forward
            metadata: {
                userId: userId,
                authMethod: authMethod,
                username: user.username,
                email: user.email || '' // optional
            }
        });

        return res.send({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send({ message: "Failed to create checkout session" });
    }
});

// Get Stripe Session Details by ID
router.get('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'payment_intent.charges']
        });

        res.json(session);
    } catch (err) {
        console.error('❌ Stripe session fetch failed:', err.message);
        res.status(500).json({ message: 'Failed to retrieve session details' });
    }
});

router.post("/confirm-payment", async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'payment_intent.charges']
        });

        const paymentIntent = session.payment_intent;
        const charge = paymentIntent.charges.data[0];

        const userId = session.metadata?.userId;
        const authMethod = session.metadata?.authMethod;

        if (!userId || !authMethod) {
            return res.status(400).json({ message: 'Missing user metadata in session.' });
        }

        // Fetch username and email from DB
        let user;
        switch (authMethod) {
            case 'google':
                user = await GoogleLogin.findOne({ googleId: userId });
                break;
            case 'github':
                user = await GitHubLogin.findOne({ githubId: userId });
                break;
            case 'discord':
                const discordUser = await DiscordUser.findOne({ discordId: userId });
                if (!discordUser) return res.status(404).send({ message: "Discord user not found" });
                user = await DiscordLogin.findOne({ userId: discordUser._id });
                break;
            case 'email':
            case 'manual':
                user = await EmailUser.findOne({ email: userId });
                break;
            default:
                return res.status(400).send({ message: "Invalid auth method" });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Save premium status (existing code)
        await PremiumUser.findOneAndUpdate(
            { userId },
            {
                userId,
                authMethod,
                email: charge.billing_details.email || user.email,
                paymentStatus: "success",
                timestamp: new Date()
            },
            { upsert: true, new: true }
        );

        // ✅ Save to PaymentHistory
        const paymentRecord = new PaymentHistory({
            userId,
            authMethod,
            username: user.username,
            email: charge.billing_details.email || user.email,
            amount: charge.amount / 100,
            currency: charge.currency,
            stripeSessionId: session.id,
            receipt_url: charge.receipt_url,
            product: 'Premium Access',
        });

        await paymentRecord.save();

        res.status(200).json({ message: "Payment confirmed and saved." });
    } catch (err) {
        console.error("Error confirming payment:", err);
        res.status(500).json({ error: "Failed to confirm payment." });
    }
});

// Inside stripeRoutes.mjs (or a new route file like premiumRoutes.mjs)
router.get('/check-premium/:authMethod/:userId', async (req, res) => {
    const { authMethod, userId } = req.params;
  
    try {
      const payment = await PaymentHistory.findOne({ authMethod, userId });
  
      if (payment) {
        return res.json({ isPremium: true });
      } else {
        return res.json({ isPremium: false });
      }
    } catch (err) {
      console.error('Failed to check premium status:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  

// Inside stripeRoutes.mjs
router.post('/is-premium', async (req, res) => {
    const { userId, authMethod } = req.body;

    try {
        const premiumUser = await PaymentHistory.findOne({ userId, authMethod });

        res.json({ premium: !!premiumUser }); // ✅ true if found
    } catch (error) {
        console.error("🔥 Error in is-premium:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;