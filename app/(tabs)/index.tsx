

import { StyleSheet, View, TextInput, Text, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { usePassword } from './PasswordContext';
import { savePasswordSecurely, getAllPasswords } from '../../utils/secureStorage';
import { Stack } from 'expo-router';

interface PasswordRequirements {
  hasDigit: boolean;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasSymbol: boolean;
}

export default function HomeScreen() {
  const [localPassword, setLocalPassword] = useState('');
  const [localSiteName, setLocalSiteName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentPassword, setCurrentSite, setPasswords } = usePassword();
  const [localCategory, setLocalCategory] = useState(''); // New state for category
  const checkPasswordStrength = (password: string): PasswordRequirements => {
    return {
      hasDigit: /\d/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password),
    };
  };

  const generatePassword = useCallback((length = 12) => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    // Start with one of each required character type
    let password =
      lowercase[Math.floor(Math.random() * lowercase.length)] +
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    const charset = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }, []);

  const handleGeneratePassword = () => {
    setError(null);
    setIsLoading(true);

    try {
      const newPassword = generatePassword(12);
      setLocalPassword(newPassword);
      setCurrentPassword?.(newPassword);

      const requirements = checkPasswordStrength(newPassword);
      const strengthMessage = formatStrengthMessage(requirements);
      Alert.alert("Password Requirements", strengthMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate password';
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStrengthMessage = (requirements: PasswordRequirements): string => {
    return `
Password contains:
${requirements.hasDigit ? '✓' : '✗'} Numbers
${requirements.hasLowerCase ? '✓' : '✗'} Lowercase letters
${requirements.hasUpperCase ? '✓' : '✗'} Uppercase letters
${requirements.hasSymbol ? '✓' : '✗'} Special characters
    `.trim();
  };

  const handleSavePassword = async () => {
    if (!localPassword?.trim() || !localSiteName?.trim() || !localCategory?.trim()) {
      Alert.alert("Error", "Please enter password, site name, and category");
      return;
    }

    setIsLoading(true);
    try {
      const success = await savePasswordSecurely(localPassword, localSiteName, localCategory);
      if (!success) {
        throw new Error("Failed to save password");
      }

      const storedPasswords = await getAllPasswords();
      setPasswords(storedPasswords); // Update the context with new passwords

      Alert.alert("Success", "Password saved securely!");
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save password';
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

























  const resetForm = useCallback(() => {
    setLocalPassword('');
    setLocalSiteName('');
    setCurrentPassword?.('');
    setCurrentSite?.('');
  }, [setCurrentPassword, setCurrentSite]);

  // ... rest of the component remains the same=
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Password Generator' }} />
      <View style={styles.contentContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>Generated Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Enter password"
          value={localPassword}
          onChangeText={setLocalPassword}
          placeholderTextColor="#666"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter the site name"
          value={localSiteName}
          onChangeText={setLocalSiteName}
          placeholderTextColor="#666"
          editable={!isLoading}
        />

        <TextInput // New input for category
          style={styles.input}
          placeholder="Enter the category"
          value={localCategory}
          onChangeText={setLocalCategory}
          placeholderTextColor="#666"
          editable={!isLoading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Generate Password"
            onPress={handleGeneratePassword}
            disabled={isLoading}
          />
          <Button
            title="Save Password"
            onPress={handleSavePassword}
            disabled={isLoading || !localPassword || !localSiteName || !localCategory}
          />
        </View>

        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0000ff',
  },
});
