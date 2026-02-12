const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Trim pour supprimer les espaces
  email: { type: String, required: true, unique: true, lowercase: true }, // Lowercase pour normaliser
  password: { type: String, required: true, minlength: 6 }, // Longueur minimale pour sécurité
  role: { type: String, enum: ['host', 'client'], default: 'client' },
  // Nouveaux champs pour profils avancés
  allergies: [{ type: String, trim: true }], // Liste d'allergies (e.g., ['nuts', 'gluten'])
  dietPreferences: { type: String, enum: ['vegan', 'vegetarian', 'halal', 'kosher', 'none'], default: 'none' },
  location: { type: String, trim: true }, // e.g., 'Paris, France'
  budgetRange: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  favoriteCuisines: [{ type: String, trim: true }], // e.g., ['italian', 'asian']
}, {
  timestamps: true // Ajout de createdAt et updatedAt automatiquement
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
