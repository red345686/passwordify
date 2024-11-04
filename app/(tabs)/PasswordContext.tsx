import React, { createContext, useState, useContext } from 'react';

interface PasswordEntry {
    password: string;
    site: string;
    category: string;  // Added category
    createdAt: string;
}

interface PasswordContextType {
    passwords: PasswordEntry[];
    setPasswords: (passwords: PasswordEntry[]) => void;
    currentPassword: string;
    setCurrentPassword: (password: string) => void;
    currentSite: string;
    setCurrentSite: (site: string) => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentSite, setCurrentSite] = useState('');

    return (
        <PasswordContext.Provider
            value={{
                passwords,
                setPasswords,
                currentPassword,
                setCurrentPassword,
                currentSite,
                setCurrentSite
            }}
        >
            {children}
        </PasswordContext.Provider>
    );
};

export const usePassword = () => {
    const context = useContext(PasswordContext);
    if (context === undefined) {
        throw new Error('usePassword must be used within a PasswordProvider');
    }
    return context;
};