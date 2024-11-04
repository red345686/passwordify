import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    AuthError
} from 'firebase/auth';  // Changed from 'firebase' to 'firebase/auth'
import { auth } from '../../firebaseConfig';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const validateInput = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleAuth = async () => {
        if (!validateInput()) return;

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert('Success', 'Logged in successfully');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert('Success', 'Account created successfully');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                let errorMessage = 'An unexpected error occurred';

                if ('code' in error) {
                    switch ((error as AuthError).code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'This email is already registered';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address';
                            break;
                        case 'auth/user-not-found':
                            errorMessage = 'Email not found';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Incorrect password';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                }
                Alert.alert('Error', errorMessage);
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.logo}>🔐</Text>
                <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                <Text style={styles.subtitle}>
                    {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
                </Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Min 6 characters"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAuth}  // Corrected this line
                    >
                        <Text style={styles.buttonText}>
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin
                                ? "Don't have an account? Sign Up"
                                : 'Already have an account? Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        marginTop: 20,
        padding: 10,
    },
    switchText: {
        color: '#007AFF',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default AuthScreen;