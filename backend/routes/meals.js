const express = require('express');
const jwt = require('jsonwebtoken');
const Meal = require('../models/Meal');
const User = require('../models/User');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};

// Créer un repas (pour hôtes)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'host') return res.status(403).json({ error: 'Accès refusé' });
  try {
    const meal = new Meal({ ...req.body, hostId: req.user.id });
    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Générer une description IA pour un repas
router.post('/generate-description', async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;
    const prompt = `Génère une description appétissante et détaillée pour un repas avec ces ingrédients : ${ingredients.join(', ')}, adapté à ces préférences : ${preferences}. Décris le goût, la texture et pourquoi c'est adapté.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ description: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recommandations IA basées sur profil utilisateur
router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const meals = await Meal.find({
      cuisine: { $in: user.favoriteCuisines },
      dietaryInfo: { $regex: user.dietPreferences, $options: 'i' },
      price: user.budgetRange === 'low' ? { $lt: 15 } : user.budgetRange === 'high' ? { $gt: 25 } : { $gte: 15, $lte: 25 }
    }).populate('hostId', 'name location');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lister tous les repas
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().populate('hostId', 'name location');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
