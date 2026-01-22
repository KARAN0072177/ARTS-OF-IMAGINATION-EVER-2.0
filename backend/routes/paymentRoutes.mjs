import express from 'express';
import PaymentHistory from '../models/PaymentHistory.mjs';

const router = express.Router();

// 📦 GET user's payment history (authMethod: google, github, discord, manual/email)
router.get('/history/:authMethod/:userId', async (req, res) => {
    const { authMethod, userId } = req.params;

    const methodQuery = authMethod === 'manual' ? ['manual', 'email'] : [authMethod];

    try {
        const history = await PaymentHistory.find({
            authMethod: { $in: methodQuery },
            userId,
        }).sort({ timestamp: -1 }); // use correct date field

        res.json(history);
    } catch (err) {
        console.error('❌ Error fetching payment history:', err);
        res.status(500).json({ message: 'Failed to fetch payment history' });
    }
});

// ✅ Save a new payment history entry
router.post('/save', async (req, res) => {
    try {
        const {
            userId,
            authMethod,
            username,
            email, // optional
            amount,
            currency,
            stripeSessionId,
            receipt_url, // optional
            product
        } = req.body;

        const newRecord = new PaymentHistory({
            userId,
            authMethod,
            username,
            email : email || undefined,
            amount,
            currency,
            stripeSessionId,
            receipt_url,
            product
        });

        await newRecord.save();
        res.status(201).json({ message: 'Payment history saved successfully' });
    } catch (error) {
        console.error('❌ Failed to save payment history:', error);
        res.status(500).json({ message: 'Error saving payment history' });
    }
});

export default router;