const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence au client
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'hôte
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }, // Nouveau champ pour lier à un repas détaillé
  date: { type: Date, required: true, validate: {
    validator: function(value) {
      return value > new Date(); // La date doit être future
    },
    message: 'La date de réservation doit être dans le futur'
  }},
  meal: { type: String, trim: true }, // Peut être déprécié si mealId est utilisé
  price: { type: Number, required: true, min: 0 }, // Prix positif
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  notes: { type: String, trim: true } // Nouveau champ pour notes spéciales (e.g., adaptations)
}, {
  timestamps: true // Ajout de createdAt et updatedAt
});

// Index pour optimiser les recherches
reservationSchema.index({ clientId: 1 });
reservationSchema.index({ hostId: 1 });
reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
