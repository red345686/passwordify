

import * as SecureStore from 'expo-secure-store';

interface PasswordEntry {
    password: string;
    site: string;
    category: string; // Add category to PasswordEntry
    createdAt: string;
}

export const savePasswordSecurely = async (password: string, site: string, category: string) => { // Include category
    try {
        const existingData = await SecureStore.getItemAsync('passwords');
        const passwords: PasswordEntry[] = existingData ? JSON.parse(existingData) : [];

        const newEntry: PasswordEntry = {
            password,
            site,
            category, // Save category
            createdAt: new Date().toISOString(),
        };

        passwords.push(newEntry);
        await SecureStore.setItemAsync('passwords', JSON.stringify(passwords));
        return true;
    } catch (error) {
        console.error('Error saving password:', error);
        return false;
    }
};

export const getAllPasswords = async (): Promise<PasswordEntry[]> => {
    try {
        const data = await SecureStore.getItemAsync('passwords');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting passwords:', error);
        return [];
    }
};

// ... deletePassword remains unchanged ...




export const deletePassword = async (site: string) => {
    try {
        const passwords = await getAllPasswords();
        const updatedPasswords = passwords.filter(entry => entry.site !== site);
        await SecureStore.setItemAsync('passwords', JSON.stringify(updatedPasswords));
        return true;
    } catch (error) {
        console.error('Error deleting password:', error);
        return false;
    }
};