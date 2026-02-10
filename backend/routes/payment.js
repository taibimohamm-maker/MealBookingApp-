const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');

const router = express.Router();

// Middleware pour vérifier le token JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Accès refusé' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Créer un PaymentIntent pour une réservation
router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation || reservation.clientId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Réservation non trouvée ou accès refusé' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: reservation.price * 100,  // Stripe utilise les centimes
      currency: 'eur',
      metadata: { reservationId: reservation._id.toString() }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
