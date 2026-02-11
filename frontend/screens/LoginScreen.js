import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erreur', 'Merci de renseigner tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      Alert.alert('Succès', 'Connecté !');
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      let message = 'Une erreur est survenue.';
      if (error.response && error.response.data && typeof error.response.data.error === 'string') {
        message = error.response.data.error;
      }
      Alert.alert('Erreur', message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Connexion à MealBooking</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Button
        title={loading ? 'Connexion en cours...' : 'Se connecter'}
        onPress={handleLogin}
        color="#4CAF50"
        disabled={loading}
      />

      <View style={{ marginTop: 10 }}>
        <Button
          title="S'inscrire"
          onPress={() => navigation.navigate('Register')}
          color="#2196F3"
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});
