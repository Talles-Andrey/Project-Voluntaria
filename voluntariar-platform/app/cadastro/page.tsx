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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Eye, EyeOff, Loader2, Plus, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

const causas = [
  "Educação",
  "Saúde",
  "Meio Ambiente",
  "Direitos Humanos",
  "Combate à Fome",
  "Assistência Social",
  "Cultura",
  "Esporte",
  "Tecnologia",
  "Outras"
]

const habilidades = [
  "Organização",
  "Comunicação",
  "Trabalho em Equipe",
  "Liderança",
  "Gestão de Projetos",
  "Marketing Digital",
  "Design",
  "Programação",
  "Idiomas",
  "Primeiros Socorros",
  "Outras"
]

export default function CadastroPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cidade: "",
    estado: "",
    userType: "volunteer" as "volunteer" | "ngo",
    skills: [] as string[],
    experience: "",
    preferredCauses: [] as string[],
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [customCause, setCustomCause] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[name as keyof typeof prev] as string[]
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] }
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) }
      }
    })
    setError("")
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }))
      setCustomSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addCustomCause = () => {
    if (customCause.trim() && !formData.preferredCauses.includes(customCause.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredCauses: [...prev.preferredCauses, customCause.trim()]
      }))
      setCustomCause("")
    }
  }

  const removeCause = (cause: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCauses: prev.preferredCauses.filter(c => c !== cause)
    }))
  }

  const validateForm = () => {
    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmarSenha ||
      !formData.cidade ||
      !formData.estado
    ) {
      return "Por favor, preencha todos os campos obrigatórios."
    }

    if (!formData.email.includes("@")) {
      return "Por favor, insira um email válido."
    }

    if (formData.senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres."
    }

    if (formData.senha !== formData.confirmarSenha) {
      return "As senhas não coincidem."
    }

    if (formData.nome.length < 2) {
      return "O nome deve ter pelo menos 2 caracteres."
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Formulário submetido!")
    
    setIsLoading(true)
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      console.log("❌ Erro de validação:", validationError)
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        city: formData.cidade,
        state: formData.estado,
        userType: formData.userType,
        skills: formData.skills,
        experience: formData.experience,
        preferredCauses: formData.preferredCauses,
      }

      console.log("📤 Dados a serem enviados:", userData)
      console.log("🌐 URL do endpoint:", 'http://localhost:3333/api/auth/register')

      // 1. Primeiro criar a conta
      const registerResponse = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(userData),
      })

      console.log("📥 Resposta do registro:", registerResponse.status, registerResponse.statusText)

      if (!registerResponse.ok) {
        const errorResult = await registerResponse.json()
        setError(errorResult.message || `Erro ${registerResponse.status}: ${registerResponse.statusText}`)
        return
      }

      // 2. Se conta criada com sucesso, fazer login automático
      console.log("🔄 Fazendo login automático...")
      const loginResponse = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        }),
      })

      console.log("📥 Resposta do login:", loginResponse.status, loginResponse.statusText)

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json()
        console.log("🔑 Token recebido:", loginResult.accessToken)
        
        // 3. Salvar token e dados do usuário
        localStorage.setItem('auth_token', loginResult.accessToken)
        localStorage.setItem('auth_user', JSON.stringify(loginResult.user))
        
        setSuccess("Conta criada e login realizado com sucesso! Redirecionando para o dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        const loginError = await loginResponse.json()
        setError(`Conta criada, mas erro no login: ${loginError.message}`)
      }
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
            <h2 className="mt-6 font-playfair font-bold text-3xl text-foreground">Criar sua conta</h2>
            <p className="mt-2 text-muted-foreground">Junte-se à nossa comunidade de voluntários</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>Preencha seus dados para criar sua conta</CardDescription>
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
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleSelectChange("estado", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType">Tipo de Usuário</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => handleSelectChange("userType", value as "volunteer" | "ngo")}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volunteer">Voluntário</SelectItem>
                      <SelectItem value="ngo">ONG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Habilidades (opcional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {habilidades.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("skills", skill, checked as boolean)
                          }
                          disabled={isLoading}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Adicionar habilidade personalizada"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomSkill}
                      disabled={isLoading || !customSkill.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                        >
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-primary/20"
                            onClick={() => removeSkill(skill)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experiência (opcional)</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Conte um pouco sobre sua experiência em voluntariado ou projetos sociais..."
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Causas Preferidas (opcional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {causas.map((cause) => (
                      <div key={cause} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cause-${cause}`}
                          checked={formData.preferredCauses.includes(cause)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("preferredCauses", cause, checked as boolean)
                          }
                          disabled={isLoading}
                        />
                        <Label htmlFor={`cause-${cause}`} className="text-sm">
                          {cause}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Adicionar causa personalizada"
                      value={customCause}
                      onChange={(e) => setCustomCause(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomCause}
                      disabled={isLoading || !customCause.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.preferredCauses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.preferredCauses.map((cause) => (
                        <div
                          key={cause}
                          className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                        >
                          {cause}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-primary/20"
                            onClick={() => removeCause(cause)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={formData.senha}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Confirme sua senha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-muted-foreground">Já tem uma conta? </span>
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                    Faça login
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
