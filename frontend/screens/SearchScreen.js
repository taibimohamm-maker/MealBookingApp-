import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SearchScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const onChange = (event, selected) => {
    setShowPicker(false);
    if (selected) {
      setDate(selected);
      setSelectedDate(selected.toISOString().split('T')[0]);
    }
  };

  const handleReservation = () => {
    if (!selectedDate) {
      Alert.alert('Erreur', 'Veuillez choisir une date');
      return;
    }
    Alert.alert('Réservation', `Réservation réussie pour le ${selectedDate}`);
    // Implémentez ici l'appel API avec token et réservation réelle
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche de repas</Text>
      <Text style={styles.subTitle}>Date sélectionnée : {selectedDate || 'Aucune'}</Text>
      <Button title="Choisir une date" onPress={() => setShowPicker(true)} color="#2196F3" />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Réserver" onPress={handleReservation} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
});
