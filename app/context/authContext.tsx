'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react';
interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => Promise<void>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

import { getCookie } from 'cookies-next';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        // Wrap the cookie retrieval in an async function to await the Promise
        const fetchToken = async () => {
          const tokenFromCookies = await getCookie("token");
        
          // Check if the token from cookies is different from the current state token
          if (tokenFromCookies?.trim() !== token?.trim()) {
            // console.log("token from cookie-next:", tokenFromCookies);
            setToken(tokenFromCookies || null); // Only update if the token is different
          }
        };
    
        // Only call fetchToken once when the component mounts
        fetchToken();
      }, [token]);
    const login = (newToken: string) => {
        document.cookie = `token=${newToken}; path=/`;
        setToken(newToken);
    };

    const logout = () => {
        return new Promise<void>((res,rej)=>{
            // console.log("called logout")
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setToken(null);
        res()
        })
    };

    return (
        <AuthContext.Provider value={{ token, login, logout , setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
