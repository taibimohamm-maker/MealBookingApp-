const express = require('express');
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());  // Permet les requêtes du frontend
app.use(express.json());  // Parse les données JSON

// Connexion à MongoDB (options supprimées car dépréciées)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Endpoint de test
app.get('/', (req, res) => res.json({ message: 'Backend de MealBookingApp fonctionne !' }));

// Port d'écoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en cours sur le port ${PORT}`));
