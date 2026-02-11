import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, role });
      Alert.alert('Succès', 'Inscrit avec succès !');
      setLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.error || 'Erreur inconnue';
      Alert.alert('Erreur', msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Inscription</Text>

        <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} autoCapitalize="words" />

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

        <TextInput style={styles.input} placeholder="Rôle (client/host)" value={role} onChangeText={setRole} autoCapitalize="none" />

        <Button title={loading ? "Inscription..." : "S'inscrire"} onPress={handleRegister} disabled={loading} color="#4CAF50" />

        <View style={styles.btnRegister}>
          <Button title="Se connecter" onPress={() => navigation.navigate('Login')} disabled={loading} color="#2196F3" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  btnRegister: { marginTop: 10 },
});
