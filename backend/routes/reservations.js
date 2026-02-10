const express = require('express');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

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

// Créer une réservation
router.post('/', authenticate, async (req, res) => {
  try {
    const { hostId, date, meal, price } = req.body;
    const reservation = new Reservation({
      hostId,
      clientId: req.user.id,
      date,
      meal,
      price
    });
    await reservation.save();
    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lister les réservations de l'utilisateur
router.get('/', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      $or: [{ clientId: req.user.id }, { hostId: req.user.id }]
    }).populate('hostId clientId', 'name email');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
