import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { callSoapAction } from '../utils/soapClient'; // Adjust path as needed
import { type User } from '../types/User'; // Define this based on your Java User model
// Define your User structure based on your Java models


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Starts true to block rendering during hydration

    useEffect(() => {
        const hydrateAuth = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                // No token found, finish loading immediately
                setIsLoading(false);
                return;
            }

            try {
                // Hydration call: Ask the Java backend if this token is still good
                // We don't pass the token in params because our updated soapClient handles it in the HTTP headers!
                const backendUser = await callSoapAction<User[]>(
                    '/api/user-service', // Adjust to your actual endpoint
                    'getProfile'
                );

                if (backendUser) {
                    console.log("Hydration successful, user data:", backendUser[0]);
                    setUser(backendUser[0]);
                    setIsAuthenticated(true);
                } else {
                    throw new Error("Invalid token response");
                }
            } catch (error) {
                console.error("Hydration failed, clearing invalid session:", error);
                sessionStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        hydrateAuth();
    }, []);

    const login = (token: string, userData: User) => {
        sessionStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

