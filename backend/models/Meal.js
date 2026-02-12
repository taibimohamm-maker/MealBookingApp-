const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String }, // Généré par IA
  ingredients: [{ type: String }],
  price: { type: Number, required: true },
  cuisine: { type: String },
  dietaryInfo: { type: String }, // e.g., 'vegan, gluten-free'
  availableDates: [{ type: Date }],
});
module.exports = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
