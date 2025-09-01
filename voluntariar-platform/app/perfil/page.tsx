"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, Edit, Save, X, CheckCircle, Loader2, User, Target, Award, Clock } from "lucide-react"

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

// Dados iniciais vazios (serão preenchidos pela API)
const dadosIniciais = {
  nome: "",
  email: "",
  cidade: "",
  estado: "",
  biografia: "",
  telefone: "",
  dataIngresso: "",
  avatar: "",
  skills: [] as string[],
  experience: "",
  preferredCauses: [] as string[],
  userType: "",
  novaSenha: ""
}

const estatisticasPerfil = {
  horasVoluntariado: 0,
  projetosParticipados: 0,
  doacoesRealizadas: 0,
  pessoasImpactadas: 0,
}

const interessesDisponiveis = [
  "Educação",
  "Saúde",
  "Meio Ambiente",
  "Assistência Social",
  "Cultura",
  "Esporte",
  "Direitos Humanos",
  "Animais",
  "Tecnologia",
  "Arte",
  "Combate à Fome",
  "Religião"
]

export default function PerfilPage() {
  const router = useRouter()
  const [dadosUsuario, setDadosUsuario] = useState(dadosIniciais)
  const [interessesSelecionados, setInteressesSelecionados] = useState<string[]>([])
  const [modoEdicao, setModoEdicao] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      console.log("❌ Token não encontrado, redirecionando para login")
      router.push('/login')
      return
    }

    try {
      console.log("🔄 Carregando perfil do usuário...")
      
      const response = await fetch('http://localhost:3333/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      console.log("📥 Resposta do perfil:", response.status, response.statusText)

      if (response.ok) {
        const userData = await response.json()
        console.log("📋 Dados do usuário carregados:", userData)
        
        // Mapear dados da API para o formato do frontend
        const mappedData = {
          nome: userData.name || "",
          email: userData.email || "",
          cidade: userData.city || "",
          estado: userData.state || "",
          biografia: userData.experience || "",
          telefone: "", // Não existe no backend
          dataIngresso: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long' 
          }) : "",
          avatar: "", // Não existe no backend
          skills: userData.skills || [],
          experience: userData.experience || "",
          preferredCauses: userData.preferredCauses || [],
          userType: userData.userType || "",
          novaSenha: "" // Campo para nova senha
        }

        setDadosUsuario(mappedData)
        setInteressesSelecionados(userData.preferredCauses || [])
        
        console.log("✅ Perfil carregado com sucesso")
      } else {
        const errorData = await response.json()
        console.error("❌ Erro ao carregar perfil:", errorData)
        setError("Erro ao carregar perfil. Tente novamente.")
      }
    } catch (error) {
      console.error("💥 Erro na requisição:", error)
      setError("Erro ao conectar com o servidor.")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDadosUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setDadosUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const toggleInteresse = (interesse: string) => {
    setInteressesSelecionados((prev) =>
      prev.includes(interesse) ? prev.filter((i) => i !== interesse) : [...prev, interesse],
    )
  }

  const toggleSkill = (skill: string) => {
    setDadosUsuario((prev) => ({
      ...prev,
      skills: prev.skills?.includes(skill) 
        ? prev.skills.filter((s) => s !== skill)
        : [...(prev.skills || []), skill]
    }))
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")
    setError("")

    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      setError("Token de autenticação não encontrado. Faça login novamente.")
      setIsLoading(false)
      return
    }

    try {
      console.log("🔄 Salvando perfil...")
      
      // Preparar dados para enviar para a API
      const updateData: any = {
        name: dadosUsuario.nome,
        city: dadosUsuario.cidade,
        state: dadosUsuario.estado,
        userType: dadosUsuario.userType,
        skills: dadosUsuario.skills,
        experience: dadosUsuario.biografia, // Mapear biografia para experience
        preferredCauses: interessesSelecionados
      }

      // Adicionar nova senha apenas se fornecida
      if (dadosUsuario.novaSenha && dadosUsuario.novaSenha.trim().length >= 6) {
        updateData.password = dadosUsuario.novaSenha
        console.log("🔑 Nova senha incluída na atualização")
      }

      console.log("📤 Dados para atualização:", updateData)

      const response = await fetch('http://localhost:3333/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      console.log("📥 Resposta do update:", response.status, response.statusText)

      if (response.ok) {
        const updatedUserData = await response.json()
        console.log("✅ Perfil atualizado:", updatedUserData)
        
                 // Atualizar dados locais com a resposta da API
         const mappedData = {
           nome: updatedUserData.name || dadosUsuario.nome,
           email: updatedUserData.email || dadosUsuario.email,
           cidade: updatedUserData.city || dadosUsuario.cidade,
           estado: updatedUserData.state || dadosUsuario.estado,
           biografia: updatedUserData.experience || dadosUsuario.biografia,
           telefone: dadosUsuario.telefone, // Manter campo não editável
           dataIngresso: updatedUserData.createdAt ? new Date(updatedUserData.createdAt).toLocaleDateString('pt-BR', { 
             year: 'numeric', 
             month: 'long' 
           }) : dadosUsuario.dataIngresso,
           avatar: dadosUsuario.avatar, // Manter campo não editável
           skills: updatedUserData.skills || dadosUsuario.skills,
           experience: updatedUserData.experience || dadosUsuario.experience,
           preferredCauses: updatedUserData.preferredCauses || interessesSelecionados,
           userType: updatedUserData.userType || dadosUsuario.userType,
           novaSenha: "" // Resetar campo de nova senha
         }

        setDadosUsuario(mappedData)
        setInteressesSelecionados(updatedUserData.preferredCauses || interessesSelecionados)
        
        setSuccess("Perfil atualizado com sucesso!")
        setModoEdicao(false)
      } else {
        const errorData = await response.json()
        console.error("❌ Erro ao atualizar perfil:", errorData)
        setError(errorData.message || `Erro ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("💥 Erro na requisição:", error)
      setError("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = () => {
    setDadosUsuario(dadosIniciais)
    setModoEdicao(false)
    setSuccess("")
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {isLoadingProfile && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando perfil...</p>
          </div>
        )}

        {/* Conteúdo principal (só mostra quando não está carregando) */}
        {!isLoadingProfile && (

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Informações Básicas */}
          <div className="space-y-6">
            {/* Card do Perfil */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={dadosUsuario.avatar || "/placeholder.svg"} alt={dadosUsuario.nome} />
                    <AvatarFallback className="text-lg">
                      {dadosUsuario.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-playfair font-bold text-xl text-foreground mb-1">{dadosUsuario.nome}</h2>
                  <p className="text-muted-foreground mb-2">{dadosUsuario.email}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {dadosUsuario.cidade}, {dadosUsuario.estado}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {dadosUsuario.dataIngresso}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Horas Voluntárias</span>
                  <span className="font-semibold">{estatisticasPerfil.horasVoluntariado}h</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Projetos Participados</span>
                  <span className="font-semibold">{estatisticasPerfil.projetosParticipados}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Doações Realizadas</span>
                  <span className="font-semibold">{estatisticasPerfil.doacoesRealizadas}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pessoas Impactadas</span>
                  <span className="font-semibold">{estatisticasPerfil.pessoasImpactadas}</span>
                </div>
              </CardContent>
            </Card>

            {/* Interesses */}
            <Card>
              <CardHeader>
                <CardTitle>Áreas de Interesse</CardTitle>
                <CardDescription>Causas que você tem interesse em apoiar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interessesSelecionados.map((interesse) => (
                    <Badge key={interesse} variant="secondary">
                      {interesse}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Habilidades */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Habilidades</CardTitle>
                <CardDescription>Habilidades que você possui</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dadosUsuario.skills && dadosUsuario.skills.length > 0 ? (
                    dadosUsuario.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-primary border-primary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Nenhuma habilidade cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tipo de Usuário */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Usuário</CardTitle>
                <CardDescription>Sua categoria na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {dadosUsuario.userType === 'ngo' ? (
                    <>
                      <Target className="h-4 w-4 text-blue-600" />
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Organização (ONG)
                      </Badge>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Voluntário
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Gerencie suas informações de perfil</CardDescription>
                  </div>
                  {!modoEdicao ? (
                    <Button onClick={() => setModoEdicao(true)} variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelar} variant="outline" size="sm">
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSalvar} disabled={isLoading} size="sm">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvar} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={dadosUsuario.nome}
                        onChange={handleInputChange}
                        disabled={!modoEdicao}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={dadosUsuario.email}
                        onChange={handleInputChange}
                        disabled={true} // Sempre desabilitado - não pode ser alterado
                        required
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">Tipo de Usuário</Label>
                    <Select
                      value={dadosUsuario.userType}
                      onValueChange={(value) => handleSelectChange("userType", value)}
                      disabled={!modoEdicao}
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

                  {modoEdicao && (
                    <div className="space-y-2">
                      <Label htmlFor="novaSenha">Nova Senha (opcional)</Label>
                      <Input
                        id="novaSenha"
                        name="novaSenha"
                        type="password"
                        placeholder="Deixe em branco para manter a senha atual"
                        onChange={(e) => {
                          // Armazenar nova senha se fornecida
                          if (e.target.value.trim()) {
                            setDadosUsuario(prev => ({ ...prev, novaSenha: e.target.value }))
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Mínimo 6 caracteres. Deixe em branco para não alterar.
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={dadosUsuario.cidade}
                        onChange={handleInputChange}
                        disabled={!modoEdicao}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={dadosUsuario.estado}
                        onValueChange={(value) => handleSelectChange("estado", value)}
                        disabled={!modoEdicao}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
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
                    <Label htmlFor="biografia">Biografia</Label>
                    <Textarea
                      id="biografia"
                      name="biografia"
                      value={dadosUsuario.biografia}
                      onChange={handleInputChange}
                      disabled={!modoEdicao}
                      rows={4}
                      placeholder="Conte um pouco sobre você e suas motivações para o voluntariado..."
                    />
                  </div>

                  {modoEdicao && (
                    <>
                      <div className="space-y-3">
                        <Label>Áreas de Interesse</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {interessesDisponiveis.map((interesse) => (
                            <Button
                              key={interesse}
                              type="button"
                              variant={interessesSelecionados.includes(interesse) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleInteresse(interesse)}
                              className="justify-start"
                            >
                              {interesse}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Habilidades</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {interessesDisponiveis.map((habilidade) => (
                            <Button
                              key={habilidade}
                              type="button"
                              variant={dadosUsuario.skills?.includes(habilidade) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSkill(habilidade)}
                              className="justify-start"
                            >
                              {habilidade}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Configurações de Conta */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Conta</CardTitle>
                <CardDescription>Gerencie suas preferências e segurança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Alterar Senha</h3>
                    <p className="text-sm text-muted-foreground">Atualize sua senha para manter sua conta segura</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setModoEdicao(true)}
                    disabled={modoEdicao}
                  >
                    {modoEdicao ? "Em Edição" : "Alterar"}
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Notificações por Email</h3>
                    <p className="text-sm text-muted-foreground">Receba atualizações sobre projetos e campanhas</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Privacidade</h3>
                    <p className="text-sm text-muted-foreground">Controle quem pode ver suas informações</p>
                  </div>
                  <Button variant="outline">Gerenciar</Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg border-red-200">
                  <div>
                    <h3 className="font-medium text-red-600">Excluir Conta</h3>
                    <p className="text-sm text-muted-foreground">Remover permanentemente sua conta e dados</p>
                  </div>
                  <Button variant="destructive">Excluir</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
