const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Stripe = require('stripe');

// Only initialize Stripe if we have a valid key (not placeholder)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && stripeKey.startsWith('sk_test_') && stripeKey.length > 20
  ? Stripe(stripeKey)
  : null;

// @route   POST /api/payment/create-payment-intent
// @desc    Create a payment intent for Stripe
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
