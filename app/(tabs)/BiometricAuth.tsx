import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricAuth = () => {
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

    useEffect(() => {
        checkBiometricAvailability();
    }, []);

    const checkBiometricAvailability = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        setIsBiometricAvailable(compatible && enrolled && types.length > 0);
    };

    const handleBiometricAuth = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity',
                fallbackLabel: 'Enter password',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
            });

            if (biometricAuth.success) {
                Alert.alert('Success', 'Authentication successful!');
                // Add your logic here for what happens after successful authentication
            } else {
                Alert.alert('Error', 'Authentication failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during authentication.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            {isBiometricAvailable ? (
                <>
                    <Text style={styles.title}>Biometric Authentication</Text>
                    <TouchableOpacity
                        style={styles.authButton}
                        onPress={handleBiometricAuth}
                    >
                        <Text style={styles.buttonText}>Authenticate</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.warningText}>
                    Biometric authentication is not available on this device.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    authButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    warningText: {
        color: '#FF3B30',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default BiometricAuth;