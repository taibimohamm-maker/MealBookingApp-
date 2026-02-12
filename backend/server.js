const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/auth");
const reservationRoutes = require("./routes/reservations");
const paymentRoutes = require("./routes/payment");
const mealRoutes = require("./routes/meals"); // Import des routes meals

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser le JSON

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => {
    console.error('Erreur MongoDB:', err);
    process.exit(1); // Arrêter le serveur en cas d'erreur
  });

// Route de test
app.get('/', (req, res) => res.json({ message: 'Backend de MealBookingApp fonctionne !' }));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/meals", mealRoutes); // Ajout des routes meals

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours sur le port ${PORT}`);
  console.log('Routes disponibles : /api/auth, /api/reservations, /api/payment, /api/meals');
});
