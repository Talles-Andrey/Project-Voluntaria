"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (!token || !savedUser) {
        console.log("❌ Usuário não autenticado, redirecionando para login");
        router.push('/login');
        return;
      }

      try {
        // Verificar se o token ainda é válido
        const response = await fetch('http://localhost:3333/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
          console.log("✅ Usuário autenticado:", userData);
        } else {
          console.log("❌ Token inválido, redirecionando para login");
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          router.push('/login');
        }
      } catch (error) {
        console.error("💥 Erro ao verificar autenticação:", error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading, user };
}

