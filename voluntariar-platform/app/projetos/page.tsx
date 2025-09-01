"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Search, Filter, Loader2, Calendar, CheckCircle } from "lucide-react"
import { apiService } from "@/lib/api"

// Interface para o projeto do backend
interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  cause: string;
  startDate: string;
  endDate: string;
  maxVolunteers: number;
  status: string;
  ngoId: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: Enrollment[];
}

// Interface para enrollment
interface Enrollment {
  id: string;
  volunteerId: string;
  projectId: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para usuário autenticado
interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  userType: string;
}

const causas = [
  "Educação",
  "Saúde",
  "Meio ambiente",
  "Assistência Social",
  "Cultura",
  "Esporte",
  "Direitos Humanos",
  "Animais",
  "Combate à Fome",
  "Tecnologia",
  "Religião"
]

const statusOptions = [
  "open",
  "closed",
  "in_progress",
  "completed"
]

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Project[]>([])
  const [projetosFiltrados, setProjetosFiltrados] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [joiningProjects, setJoiningProjects] = useState<Set<string>>(new Set())
  const [joinedProjects, setJoinedProjects] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState("")
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null)
  const [filtros, setFiltros] = useState({
    busca: "",
    cidade: "",
    estado: "Todos os estados",
    causa: "Todas as causas",
    status: "Todos os status"
  })

  // Buscar projetos da API
  useEffect(() => {
    fetchProjetos()
  }, [])

  // Recarregar projetos quando o usuário autenticado for carregado
  useEffect(() => {
    if (authenticatedUser && authenticatedUser.userType === 'volunteer') {
      fetchProjetos()
    }
  }, [authenticatedUser])

  // Carregar usuário autenticado e verificar inscrições
  useEffect(() => {
    const loadAuthenticatedUser = () => {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('auth_user')
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          setAuthenticatedUser(user)
          
          // Verificar se o usuário é voluntário
          if (user.userType === 'volunteer') {
            // Carregar projetos inscritos do localStorage
            const savedJoinedProjects = localStorage.getItem('joined_projects')
            if (savedJoinedProjects) {
              try {
                const projectIds = JSON.parse(savedJoinedProjects)
                setJoinedProjects(new Set(projectIds))
              } catch (error) {
                console.error('Erro ao carregar projetos inscritos:', error)
                localStorage.removeItem('joined_projects')
              }
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
        }
      }
    }
    
    loadAuthenticatedUser()
  }, [])

  // Sincronizar com mudanças no localStorage (útil para múltiplas abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'joined_projects') {
        if (e.newValue) {
          try {
            const projectIds = JSON.parse(e.newValue)
            setJoinedProjects(new Set(projectIds))
          } catch (error) {
            console.error('Erro ao sincronizar projetos inscritos:', error)
          }
        } else {
          setJoinedProjects(new Set())
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fetchProjetos = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Pegar token do localStorage se disponível
      const token = localStorage.getItem('auth_token')
      
      const response = await apiService.getProjects(token || undefined)
      
      if (response.error) {
        setError(response.error)
        return
      }

      if (response.data) {
        console.log('📊 Dados brutos da API:', response.data)
        
        // Verificar se os dados estão no formato esperado
        let projectsData = response.data
        
        // Se os dados vierem no formato { project: {...}, users: [...] }
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].project) {
          console.log('🔄 Convertendo formato de dados...')
          projectsData = response.data.map((item: any) => ({
            ...item.project,
            enrollments: item.users ? item.users.map((user: any) => ({
              id: user.id,
              volunteerId: user.id,
              projectId: item.project.id,
              status: 'pending',
              notes: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })) : []
          }))
        }
        
        console.log('✅ Dados processados:', projectsData)
        setProjetos(projectsData)
        setProjetosFiltrados(projectsData)
        
        // Verificar enrollments se o usuário estiver autenticado
        if (authenticatedUser && authenticatedUser.userType === 'volunteer') {
          const enrolledProjectIds = new Set<string>()
          
          projectsData.forEach((project: Project) => {
            if (project.enrollments && project.enrollments.length > 0) {
              const isEnrolled = project.enrollments.some(enrollment => 
                enrollment.volunteerId === authenticatedUser.id
              )
              if (isEnrolled) {
                enrolledProjectIds.add(project.id)
              }
            }
          })
          
          // Atualizar estado de projetos inscritos
          setJoinedProjects(enrolledProjectIds)
          
          // Salvar no localStorage para compatibilidade
          localStorage.setItem('joined_projects', JSON.stringify(Array.from(enrolledProjectIds)))
        }
      }
    } catch (err) {
      setError("Erro ao carregar projetos. Tente novamente.")
      console.error("Erro ao buscar projetos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinProject = async (projectId: string) => {
    // Verificar se já está inscrito
    if (isUserEnrolled({ id: projectId } as Project)) {
      alert("Você já está inscrito neste projeto!")
      return
    }

    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('auth_user')
    
    if (!token) {
      alert('Você precisa estar logado para participar de projetos. Faça login primeiro.')
      return
    }

    if (!userData) {
      alert('Erro ao verificar dados do usuário. Faça login novamente.')
      return
    }

    try {
      const user = JSON.parse(userData)
      
      if (user.userType !== 'volunteer') {
        alert('Apenas voluntários podem se inscrever em projetos. ONGs não podem participar como voluntários.')
        return
      }
    } catch (err) {
      console.error('Erro ao verificar tipo de usuário:', err)
      alert('Erro ao verificar dados do usuário. Faça login novamente.')
      return
    }

    try {
      setJoiningProjects(prev => new Set(prev).add(projectId))
      setError("")
      setSuccessMessage("")

      const response = await apiService.joinProject(
        projectId, 
        'pending', 
        'Interesse em participar do projeto', 
        token
      )
      
      if (response.error) {
        alert(`Erro ao participar: ${response.error}`)
        return
      }

      // Se chegou aqui, foi sucesso (status 201 ou 200)
      console.log('✅ Inscrição realizada com sucesso para o projeto:', projectId)
      
      // Atualizar estado local
      const newJoinedProjects = new Set(joinedProjects).add(projectId)
      setJoinedProjects(newJoinedProjects)
      
      // Salvar no localStorage para persistir entre navegações
      localStorage.setItem('joined_projects', JSON.stringify(Array.from(newJoinedProjects)))
      console.log('💾 Projetos inscritos salvos no localStorage:', Array.from(newJoinedProjects))
      
      setSuccessMessage(`🎉 Parabéns! Você foi inscrito no projeto com sucesso!`)
      
      // Limpar mensagem de sucesso após 8 segundos
      setTimeout(() => {
        setSuccessMessage("")
      }, 8000)
      
    } catch (error) {
      console.error("Erro ao participar do projeto:", error)
      alert('Erro ao participar do projeto. Tente novamente.')
    } finally {
      setJoiningProjects(prev => {
        const newSet = new Set(prev)
        newSet.delete(projectId)
        return newSet
      })
    }
  }

  // Aplicar filtros
  useEffect(() => {
    const projetosFiltrados = projetos.filter((projeto) => {
      const matchBusca =
        projeto.title.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        projeto.description.toLowerCase().includes(filtros.busca.toLowerCase())
      
      const matchCidade = !filtros.cidade || 
        projeto.location.toLowerCase().includes(filtros.cidade.toLowerCase())
      
      const matchEstado = filtros.estado === "Todos os estados" || 
        projeto.location.includes(filtros.estado)
      
      const matchCausa = filtros.causa === "Todas as causas" || 
        projeto.cause === filtros.causa
      
      const matchStatus = filtros.status === "Todos os status" || 
        projeto.status === filtros.status

      return matchBusca && matchCidade && matchEstado && matchCausa && matchStatus
    })

    setProjetosFiltrados(projetosFiltrados)
  }, [projetos, filtros])

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  // Verificar se o usuário está inscrito em um projeto
  const isUserEnrolled = (project: Project): boolean => {
    if (!authenticatedUser || authenticatedUser.userType !== 'volunteer') {
      return false
    }
    
    // Verificar se o projeto tem enrollments e se o usuário está inscrito
    if (project.enrollments && project.enrollments.length > 0) {
      return project.enrollments.some(enrollment => 
        enrollment.volunteerId === authenticatedUser.id
      )
    }
    
    // Fallback para localStorage (para compatibilidade)
    return joinedProjects.has(project.id)
  }

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      cidade: "",
      estado: "Todos os estados",
      causa: "Todas as causas",
      status: "Todos os status"
    })
  }

  // Função para limpar projetos inscritos (útil para logout)
  const limparProjetosInscritos = () => {
    setJoinedProjects(new Set())
    localStorage.removeItem('joined_projects')
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto'
      case 'closed':
        return 'Fechado'
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluído'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Carregando projetos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">
            Projetos de Voluntariado
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre projetos que combinam com você e faça a diferença na sua comunidade
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>Use os filtros para encontrar projetos específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="busca">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="busca"
                    placeholder="Título ou descrição..."
                    value={filtros.busca}
                    onChange={(e) => handleFiltroChange("busca", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  placeholder="Digite a cidade..."
                  value={filtros.cidade}
                  onChange={(e) => handleFiltroChange("cidade", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos os estados">Todos os estados</SelectItem>
                    {estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="causa">Causa</Label>
                <Select value={filtros.causa} onValueChange={(value) => handleFiltroChange("causa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a causa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas as causas">Todas as causas</SelectItem>
                    {causas.map((causa) => (
                      <SelectItem key={causa} value={causa}>
                        {causa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={filtros.status} onValueChange={(value) => handleFiltroChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos os status">Todos os status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusText(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                {projetosFiltrados.length} projeto{projetosFiltrados.length !== 1 ? "s" : ""} encontrado
                {projetosFiltrados.length !== 1 ? "s" : ""}
              </p>
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchProjetos}
              className="mt-2"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Inscrição Realizada!
                </h3>
                <p className="text-green-700">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetosFiltrados.map((projeto, index) => (
            <Card key={projeto.id || `projeto-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{projeto.cause}</Badge>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(projeto.status)}
                  >
                    {getStatusText(projeto.status)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{projeto.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {projeto.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{projeto.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatarData(projeto.startDate)} - {formatarData(projeto.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Máx: {projeto.maxVolunteers} voluntários
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Criado em:</strong> {formatarData(projeto.createdAt)}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/projetos/${projeto.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Detalhes
                    </Button>
                  </Link>
                  {(() => {
                    const isJoining = joiningProjects.has(projeto.id)
                    const hasJoined = isUserEnrolled(projeto)
                    
                    if (hasJoined) {
                      return (
                        <Button disabled className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-not-allowed shadow-sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          ✓ Inscrito
                        </Button>
                      )
                    }
                    
                    return (
                      <Button 
                        onClick={() => handleJoinProject(projeto.id)}
                        disabled={isJoining}
                        className="flex-1"
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Inscrevendo...
                          </>
                        ) : (
                          'Participar'
                        )}
                      </Button>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projetosFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum projeto encontrado</p>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
