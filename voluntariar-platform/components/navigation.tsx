"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Users, Gift, User, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { LogoutButton } from "@/components/logout-button"

export function Navigation() {
  const { user, token } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Não renderizar até o componente estar montado no cliente
  if (!mounted) {
    return (
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="font-playfair font-bold text-2xl text-foreground">Voluntariar</span>
            </Link>
            {/* Placeholder para evitar layout shift */}
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="font-playfair font-bold text-2xl text-foreground">Voluntariar</span>
          </Link>

          {/* Navigation Links - Só mostrar se estiver autenticado */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/projetos"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Projetos</span>
              </Link>
              <Link
                href="/campanhas"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <Gift className="h-4 w-4" />
                <span>Campanhas</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              {user.userType === 'ngo' && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Olá, {user.name || user.email}</span>
                  {user.userType === 'ngo' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      ONG
                    </span>
                  )}
                </div>
                <LogoutButton 
                  variant="outline"
                  size="default"
                />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
