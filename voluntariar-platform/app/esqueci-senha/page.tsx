"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, Loader2 } from "lucide-react"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!email) {
      setError("Por favor, insira seu email.")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido.")
      setIsLoading(false)
      return
    }

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Instruções para redefinir sua senha foram enviadas para seu email.")
    } catch (err) {
      setError("Erro ao enviar email. Tente novamente.")
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
            <h2 className="mt-6 font-playfair font-bold text-3xl text-foreground">Esqueceu sua senha?</h2>
            <p className="mt-2 text-muted-foreground">Não se preocupe, vamos ajudá-lo a recuperar o acesso</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recuperar Senha</CardTitle>
              <CardDescription>Digite seu email para receber instruções de recuperação</CardDescription>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Instruções"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao login
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
