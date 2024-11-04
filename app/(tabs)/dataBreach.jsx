import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

const EmailLeakCheck = () => {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const checkEmailLeak = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/leakcheck?email=${email}`);
            const data = await response.json();

            if (data.success === false) {
                setResult('You have not been breached yet...');
            } else {
                setResult('You have been breached!');
            }

            // Send email with results
            sendEmail(email, 'Email Leak Check Result', result);
        } catch (err) {
            setError("An error occurred");
            console.error(err);
        }
    };

    const sendEmail = async (recipient, subject, body) => {
        try {
            const options = {
                recipients: [recipient],
                subject: subject,
                body: body,
            };

            const result = await MailComposer.composeAsync(options);

            if (result.status === 'sent') {
                console.log('Email sent successfully');
            } else {
                console.log('Email not sent');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Check if your email has been leaked</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Check Email" onPress={checkEmailLeak} />
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Result: {result}</Text>
                </View>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa', // Light background color
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333', // Darker color for title
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 45,
        borderColor: '#d1d1d1',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff', // White background for input
        color: '#333', // Darker text color for input
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0', // Slightly off-white background for result container
        borderRadius: 10,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 16,
        color: '#34C759', // Green for successful result
    },
    errorText: {
        marginTop: 20,
        fontSize: 16,
        color: '#FF3B30', // Red for error messages
        textAlign: 'center',
    },
});


export default EmailLeakCheck;
