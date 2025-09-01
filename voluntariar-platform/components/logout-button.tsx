"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default",
  className = "" 
}: LogoutButtonProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      // Fazer logout usando o hook useAuth (que chama a API e limpa o estado)
      await logout()
      
      // Forçar refresh da página para garantir que o estado seja limpo
      window.location.href = '/'
      
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
      // Mesmo com erro, forçar refresh
      window.location.href = '/'
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Sair</span>
    </Button>
  )
}
