import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Define types
interface PasswordRequirements {
    has_digit: boolean;
    has_lower_case: boolean;
    has_symbol: boolean;
    has_upper_case: boolean;
    missing_characters: number;
    missing_complexity: number;
}

interface StrengthResult {
    score: number;
    feedback: {
        suggestions: string[];
        luds_requirements?: PasswordRequirements;
    };
}

const API_URL = 'http://localhost:5000/check-password-strength';

const getStrengthColor = (score: number) => {
    if (score >= 4) return '#34C759'; // Strong - Green
    if (score >= 3) return '#007AFF'; // Good - Blue
    if (score >= 2) return '#FF9500'; // Fair - Orange
    return '#FF3B30'; // Weak - Red
};

const getStrengthLabel = (score: number) => {
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Fair';
    return 'Weak';
};

export default function PasswordStrengthCheck() {
    const [password, setPassword] = useState('');
    const [strengthResult, setStrengthResult] = useState<StrengthResult | null>(null);
    const [loading, setLoading] = useState(false);

    const checkPasswordStrength = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data: StrengthResult = await response.json();

            if (response.ok) {
                setStrengthResult({
                    score: data.score,
                    feedback: {
                        suggestions: data.feedback.suggestions || [],
                        luds_requirements: data.feedback.luds_requirements,
                    },
                });
            } else {
                console.log('API request failed:', data);
                alert('API request failed');
                setStrengthResult(null);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to check password strength');
            setStrengthResult(null);
        } finally {
            setLoading(false);
        }
    };

    const renderRequirements = () => {
        if (!strengthResult?.feedback.luds_requirements) return null;

        const reqs = strengthResult.feedback.luds_requirements;
        return (
            <View style={styles.requirementsContainer}>
                <Text style={styles.feedbackTitle}>Password Requirements:</Text>
                <Text style={[styles.feedbackText, { color: reqs.has_digit ? '#34C759' : '#FF3B30' }]}>
                    • Numbers: {reqs.has_digit ? '✓' : '✗'}
                </Text>
                <Text style={[styles.feedbackText, { color: reqs.has_lower_case ? '#34C759' : '#FF3B30' }]}>
                    • Lowercase letters: {reqs.has_lower_case ? '✓' : '✗'}
                </Text>
                <Text style={[styles.feedbackText, { color: reqs.has_upper_case ? '#34C759' : '#FF3B30' }]}>
                    • Uppercase letters: {reqs.has_upper_case ? '✓' : '✗'}
                </Text>
                <Text style={[styles.feedbackText, { color: reqs.has_symbol ? '#34C759' : '#FF3B30' }]}>
                    • Symbols: {reqs.has_symbol ? '✓' : '✗'}
                </Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Password Strength Checker</Text>

            <TextInput
                placeholder="Enter password to check"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity
                style={[styles.button, { opacity: loading || !password ? 0.7 : 1 }]}
                onPress={checkPasswordStrength}
                disabled={loading || !password}
            >
                <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Check Strength'}</Text>
            </TouchableOpacity>

            {strengthResult && (
                <View style={styles.resultContainer}>
                    <Text style={[styles.strengthText, { color: getStrengthColor(strengthResult.score) }]}>
                        {getStrengthLabel(strengthResult.score)}
                    </Text>

                    {renderRequirements()}

                    {strengthResult.feedback.suggestions.length > 0 && (
                        <View style={styles.feedbackContainer}>
                            <Text style={styles.feedbackTitle}>Suggestions:</Text>
                            {strengthResult.feedback.suggestions.map((feedback, index) => (
                                <Text key={index} style={styles.feedbackText}>
                                    • {feedback}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa', // Light background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Dark text color for title
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d1d1',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff', // White background for input
        marginBottom: 20,
        color: '#333', // Darker text color for input
    },
    button: {
        backgroundColor: '#007AFF', // Light blue color for the button
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0', // Slightly off-white background for result container
        borderRadius: 10,
    },
    strengthText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333', // Darker text color for strength label
        marginBottom: 10,
    },
    feedbackContainer: {
        marginTop: 10,
    },
    requirementsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ffffff', // White background for requirements
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0', // Light border color for separation
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Darker color for feedback title
        marginBottom: 5,
    },
    feedbackText: {
        fontSize: 14,
        color: '#666', // Light gray text color for feedback text
        marginBottom: 5,
    },
});