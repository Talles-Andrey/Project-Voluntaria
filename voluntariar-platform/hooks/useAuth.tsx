"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';
import { apiService, CreateUserRequest, LoginRequest, AuthResponse, NgoAuthResponse } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  loginNgo: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: CreateUserRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const { accessToken, user } = response.data;
        
        setToken(accessToken);
        setUser(user);
        
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return { success: true };
      }
      
      return { success: false, error: 'Resposta inválida do servidor' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData: CreateUserRequest) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const { accessToken, user } = response.data;
        
        setToken(accessToken);
        setUser(user);
        
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return { success: true };
      }
      
      return { success: false, error: 'Resposta inválida do servidor' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar conta' 
      };
    }
  };

  const loginNgo = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.loginNgo(credentials);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        const { accessToken } = response.data;
        
        // Para ONGs, precisamos decodificar o token para obter informações do usuário
        // Em um sistema real, você faria isso no backend ou usaria um endpoint específico
        const user = {
          id: 'ngo-id', // Será substituído pelo ID real do token
          name: 'ONG', // Será substituído pelo nome real da ONG
          email: credentials.email,
          userType: 'ngo'
        };
        
        setToken(accessToken);
        setUser(user);
        
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return { success: true };
      }
      
      return { success: false, error: 'Resposta inválida do servidor' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login da ONG' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // Chamar o endpoint de logout da API
        const response = await fetch('http://localhost:3333/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ Logout realizado com sucesso na API');
        } else {
          console.log('⚠️ Erro na API, mas fazendo logout local');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao fazer logout na API:', error);
    } finally {
      // Sempre fazer logout local, independente do resultado da API
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('joined_projects');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    loginNgo,
    register,
    logout,
  };

  // Não renderizar até o componente estar montado no cliente
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
