"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Users, ArrowLeft, CheckCircle, Building, Calendar, Target, Heart, Loader2, AlertCircle } from "lucide-react"
import { apiService } from "@/lib/api"

// Interfaces para os dados do backend
interface Ngo {
  id: string;
  organizationName: string;
  cnpj: string;
  description: string;
  email: string;
  city: string;
  state: string;
  causes: string[];
  areas: string[];
  skills: string[];
  preferredCauses: string[];
  projects: string[];
  campaigns: Array<{
    id: string;
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    startDate: string;
    endDate: string;
    status: string;
    ngo: string;
    ngoId: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface Enrollment {
  id: string;
  volunteer: {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    userType: string;
    skills: string[];
    experience: string;
    preferredCauses: string[];
    projects: string[];
    campaigns: string[];
    enrollments: string[];
    ratingsGiven: string[];
    donations: string[];
    createdAt: string;
  };
  volunteerId: string;
  project: string;
  projectId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  cause: string;
  startDate: string;
  endDate: string;
  maxVolunteers: number;
  status: string;
  ngo: Ngo;
  ngoId: string;
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

// Array vazio - será preenchido pela API
const projetos: ProjectDetail[] = []

export default function ProjetoDetalhePage() {
  const params = useParams()
  const [projeto, setProjeto] = useState<ProjectDetail | null>(null)
  const [ngoData, setNgoData] = useState<Ngo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")
  const [inscrito, setInscrito] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)
  const [success, setSuccess] = useState("")

  // Carregar usuário autenticado
  useEffect(() => {
    const loadAuthenticatedUser = () => {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('auth_user')
      
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não')
      console.log('👤 Dados do usuário encontrados:', userData ? 'Sim' : 'Não')
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          console.log('✅ Usuário carregado:', user)
          setAuthenticatedUser(user)
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error)
        }
      }
    }
    
    loadAuthenticatedUser()
  }, [])

  // Buscar detalhes do projeto da API
  useEffect(() => {
    if (params.id) {
      fetchProjetoDetalhes(params.id as string)
    }
  }, [params.id])

  // Verificar se o usuário já está inscrito neste projeto
  useEffect(() => {
    if (projeto?.id && authenticatedUser) {
      // Verificar se o projeto tem enrollments e se o usuário está inscrito
      if (projeto.enrollments && projeto.enrollments.length > 0) {
        const isEnrolled = projeto.enrollments.some((enrollment: Enrollment) => 
          enrollment.volunteerId === authenticatedUser.id
        )
        setInscrito(isEnrolled)
        
        // Atualizar localStorage se estiver inscrito
        if (isEnrolled) {
          const savedJoinedProjects = localStorage.getItem('joined_projects')
          let joinedProjects = savedJoinedProjects ? JSON.parse(savedJoinedProjects) : []
          if (!joinedProjects.includes(projeto.id)) {
            joinedProjects.push(projeto.id)
            localStorage.setItem('joined_projects', JSON.stringify(joinedProjects))
          }
        }
      } else {
        // Fallback para localStorage
        const savedJoinedProjects = localStorage.getItem('joined_projects')
        if (savedJoinedProjects) {
          try {
            const projectIds = JSON.parse(savedJoinedProjects)
            if (projectIds.includes(projeto.id)) {
              setInscrito(true)
            }
          } catch (error) {
            console.error('Erro ao verificar projetos inscritos:', error)
          }
        }
      }
    }
  }, [projeto?.id, authenticatedUser])

  const fetchProjetoDetalhes = async (projectId: string) => {
    try {
      setIsLoading(true)
      setError("")
      
      // Pegar token do localStorage se disponível
      const token = localStorage.getItem('auth_token')
      
      const response = await apiService.getProjectById(projectId, token || undefined)
      
      if (response.error) {
        setError(response.error)
        return
      }

      if (response.data) {
        console.log('📊 Dados brutos do projeto:', response.data)
        
        // Processar os dados do projeto
        let projectData = response.data
        
        // Se os dados vierem no formato { project: {...}, users: [...] }
        if (response.data.project && response.data.users) {
          console.log('🔄 Convertendo formato de dados do projeto...')
          projectData = {
            ...response.data.project,
            enrollments: response.data.users.map((user: any) => ({
              id: user.id,
              volunteerId: user.id,
              projectId: response.data.project.id,
              status: 'pending',
              notes: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              volunteer: {
                id: user.id,
                name: user.name,
                email: user.email,
                city: user.city,
                state: user.state,
                userType: user.userType,
                skills: user.skills || [],
                experience: user.experience || '',
                preferredCauses: user.preferredCauses || [],
                projects: user.projects || [],
                campaigns: user.campaigns || [],
                enrollments: user.enrollments || [],
                ratingsGiven: user.ratingsGiven || [],
                donations: user.donations || [],
                createdAt: user.createdAt
              }
            }))
          }
        }
        
        console.log('✅ Dados processados do projeto:', projectData)
        setProjeto(projectData)
        
        // Verificar se o usuário está inscrito neste projeto
        if (authenticatedUser && authenticatedUser.userType === 'volunteer') {
          const isEnrolled = projectData.enrollments && 
            projectData.enrollments.some((enrollment: Enrollment) => 
              enrollment.volunteerId === authenticatedUser.id
            )
          setInscrito(isEnrolled)
          
          // Atualizar localStorage se estiver inscrito
          if (isEnrolled) {
            const savedJoinedProjects = localStorage.getItem('joined_projects')
            let joinedProjects = savedJoinedProjects ? JSON.parse(savedJoinedProjects) : []
            if (!joinedProjects.includes(projectId)) {
              joinedProjects.push(projectId)
              localStorage.setItem('joined_projects', JSON.stringify(joinedProjects))
            }
          }
        }
        
        // Se o projeto tem ngoId, buscar dados da ONG
        if (projectData.ngoId) {
          await fetchNgoData(projectData.ngoId, token || undefined)
        }
      }
    } catch (err) {
      setError("Erro ao carregar detalhes do projeto. Tente novamente.")
      console.error("Erro ao buscar projeto:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNgoData = async (ngoId: string, token?: string) => {
    try {
      const ngoResponse = await apiService.getNgoById(ngoId, token || undefined)
      
      if (ngoResponse.error) {
        console.warn("Erro ao buscar dados da ONG:", ngoResponse.error)
        return
      }

      if (ngoResponse.data) {
        setNgoData(ngoResponse.data)
      }
    } catch (err) {
      console.warn("Erro ao buscar dados da ONG:", err)
    }
  }

  const handleInscricao = async () => {
    // Verificar se já está inscrito
    if (inscrito) {
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

    if (!projeto) return

    try {
      setIsJoining(true)
      setError("")
      setSuccess("")

      const response = await apiService.joinProject(
        projeto.id, 
        'pending', 
        'Interesse em participar do projeto', 
        token
      )
      
      if (response.error) {
        alert(`Erro ao participar: ${response.error}`)
        return
      }

      // Se chegou aqui, foi sucesso (status 201 ou 200)
      console.log('✅ Inscrição realizada com sucesso para o projeto:', projeto.id)
      
      // Atualizar estado local
      setInscrito(true)
      
      // Atualizar localStorage para sincronizar com a página de listagem
      const savedJoinedProjects = localStorage.getItem('joined_projects')
      let projectIds = []
      if (savedJoinedProjects) {
        try {
          projectIds = JSON.parse(savedJoinedProjects)
        } catch (error) {
          projectIds = []
        }
      }
      
      if (!projectIds.includes(projeto.id)) {
        projectIds.push(projeto.id)
        localStorage.setItem('joined_projects', JSON.stringify(projectIds))
        console.log('💾 Projeto inscrito salvo no localStorage:', projeto.id)
      }
      
      setSuccess("🎉 Parabéns! Você foi inscrito no projeto com sucesso!")
      
      // Limpar mensagem de sucesso após 8 segundos
      setTimeout(() => {
        setSuccess("")
      }, 8000)
      
    } catch (error) {
      console.error("Erro ao participar do projeto:", error)
      alert('Erro ao participar do projeto. Tente novamente.')
    } finally {
      setIsJoining(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Carregando detalhes do projeto...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar projeto</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => fetchProjetoDetalhes(params.id as string)}>
                Tentar Novamente
              </Button>
              <Link href="/projetos">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar aos Projetos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!projeto) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Projeto não encontrado</h1>
            <Link href="/projetos">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Projetos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/projetos" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Projetos
          </Link>
        </div>

        {/* Header do Projeto */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {projeto.cause}
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {projeto.status}
              </Badge>
            </div>
          </div>

          <h1 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">{projeto.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{projeto.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{ngoData?.organizationName || projeto.ngo?.organizationName || 'ONG não informada'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {projeto.enrollments?.length || 0}/{projeto.maxVolunteers} voluntários
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(projeto.startDate).toLocaleDateString('pt-BR')} - {new Date(projeto.endDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{projeto.description}</p>
              </CardContent>
            </Card>

            {/* Informações da ONG */}
            {(ngoData || projeto.ngo) && (
              <Card>
                <CardHeader>
                  <CardTitle>Organização Responsável</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Nome:</strong> {ngoData?.organizationName || projeto.ngo?.organizationName}
                    </div>
                    {(ngoData?.description || projeto.ngo?.description) && (
                      <div>
                        <strong className="text-foreground">Descrição:</strong> {ngoData?.description || projeto.ngo?.description}
                      </div>
                    )}
                    <div>
                      <strong className="text-foreground">Localização:</strong> {ngoData?.city || projeto.ngo?.city}, {ngoData?.state || projeto.ngo?.state}
                    </div>
                    <div>
                      <strong className="text-foreground">Email:</strong> {ngoData?.email || projeto.ngo?.email}
                    </div>
                    {ngoData?.cnpj && (
                      <div>
                        <strong className="text-foreground">CNPJ:</strong> {ngoData.cnpj}
                      </div>
                    )}
                    {ngoData?.causes && ngoData.causes.length > 0 && (
                      <div>
                        <strong className="text-foreground">Causas:</strong> {ngoData.causes.join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voluntários Inscritos */}
            {projeto.enrollments && projeto.enrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Voluntários Inscritos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {projeto.enrollments.slice(0, 5).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="font-medium">
                          {enrollment.volunteer?.name || enrollment.volunteerId || 'Voluntário'}
                        </span>
                        <Badge variant="outline">{enrollment.status}</Badge>
                      </div>
                    ))}
                    {projeto.enrollments.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        +{projeto.enrollments.length - 5} outros voluntários
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Inscrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Participar do Projeto
                </CardTitle>
                <CardDescription>Faça parte desta iniciativa transformadora</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso de Voluntários</span>
                    <span>
                      {projeto.enrollments?.length || 0}/{projeto.maxVolunteers}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${((projeto.enrollments?.length || 0) / projeto.maxVolunteers) * 100}%` }}
                    />
                  </div>
                </div>

                {inscrito ? (
                  <Button disabled className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-not-allowed shadow-sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    ✓ Inscrito com Sucesso
                  </Button>
                ) : (
                  <Button onClick={handleInscricao} disabled={isJoining} className="w-full bg-primary hover:bg-primary/90">
                    {isJoining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscrevendo...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Quero Participar
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Período</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(projeto.startDate).toLocaleDateString('pt-BR')} até {new Date(projeto.endDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Localização</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{projeto.location}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Voluntários</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{projeto.enrollments?.length || 0} inscritos</p>
                </div>

                <Separator />

                <div>
                  <span className="font-medium">Contato</span>
                  <p className="text-sm text-muted-foreground mt-1">{ngoData?.email || projeto.ngo?.email || 'Email não informado'}</p>
                  <p className="text-sm text-muted-foreground">{ngoData?.city || projeto.ngo?.city}, {ngoData?.state || projeto.ngo?.state}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">ID:</strong> {projeto.id}
                  </div>
                  <div>
                    <strong className="text-foreground">Criado em:</strong> {new Date(projeto.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div>
                    <strong className="text-foreground">Última atualização:</strong> {new Date(projeto.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

