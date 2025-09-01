"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Eye, EyeOff, Loader2, Building, Users } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginNgo } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState<"volunteer" | "ngo" | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validação básica
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos.")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, insira um email válido.")
      setIsLoading(false)
      return
    }

    try {
      console.log("🚀 Tentando fazer login...")
      console.log("📤 Dados enviados:", { email: formData.email, password: "***" })
      
      let loginResult;
      
      // Primeiro, tentar login como voluntário
      try {
        loginResult = await login(formData);
        if (loginResult.success) {
          setUserType("volunteer");
          setSuccess("Login como voluntário realizado com sucesso! Redirecionando para o dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
          return;
        }
      } catch (volunteerError) {
        console.log("❌ Login como voluntário falhou, tentando como ONG...");
      }
      
      // Se falhou como voluntário, tentar como ONG
      try {
        loginResult = await loginNgo(formData);
        if (loginResult.success) {
          setUserType("ngo");
          setSuccess("Login como ONG realizado com sucesso! Redirecionando para o painel admin...");
          setTimeout(() => {
            router.push("/admin");
          }, 1500);
          return;
        }
      } catch (ngoError) {
        console.log("❌ Login como ONG falhou");
      }
      
      // Se ambos falharam, mostrar erro
      setError("Email ou senha incorretos. Verifique suas credenciais.");
      
    } catch (err) {
      console.error("💥 Erro na requisição:", err)
      setError("Erro ao conectar com o servidor. Verifique se o backend está rodando.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Heart className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 font-playfair font-bold text-3xl text-foreground">Entrar na sua conta</h2>
            <p className="mt-2 text-muted-foreground">Acesse sua conta para continuar fazendo a diferença</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link href="/esqueci-senha" className="text-sm text-primary hover:text-primary/80">
                    Esqueceu sua senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-muted-foreground">Não tem uma conta? </span>
                  <Link href="/cadastro" className="text-primary hover:text-primary/80 font-medium">
                    Cadastre-se
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
