import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../../App'; // Import useAuth from the main App.js file

// Constants for styling
const PRIMARY_COLOR = '#a78bfa'; // Tailwind violet-400
const BACKGROUND_COLOR = '#0f172a'; // Tailwind slate-900

const LoginScreen = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (isRegistering && !username)) {
      return Alert.alert('Error', 'Please fill in all required fields.');
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(email, password, username);
      } else {
        await login(email, password);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Authentication failed. Please check your credentials.';
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{isRegistering ? 'Join the Galaxy' : 'Login to StormBrainer'}</Text>
        <Text style={styles.subtitle}>Collaborative problem-solving awaits.</Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setIsRegistering(!isRegistering)}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Tailwind slate-400
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    backgroundColor: '#1e293b', // Tailwind slate-800
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155', // Tailwind slate-700
  },
  button: {
    height: 50,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText: {
    color: BACKGROUND_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignSelf: 'center',
  },
  toggleText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;