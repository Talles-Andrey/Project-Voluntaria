"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Users, Clock, TrendingUp, Calendar, Award, Target, Activity, Gift, User, Settings, Loader2 } from "lucide-react"
import { useAuthCheck } from "@/hooks/useAuthCheck"

// Dados mockados do usuário
const dadosUsuario = {
  nome: "Maria Silva",
  email: "maria.silva@email.com",
  cidade: "São Paulo",
  estado: "SP",
  biografia: "Apaixonada por educação e voluntariado. Acredito que pequenas ações podem gerar grandes transformações.",
  dataIngresso: "Janeiro 2024",
  avatar: "/diverse-female-avatars.png",
}

const estatisticas = {
  horasVoluntariado: 48,
  projetosAtivos: 2,
  projetosConcluidos: 5,
  doacoesRealizadas: 8,
  valorDoado: 1250,
  impactoGerado: 127, // pessoas impactadas
}

const projetosAtivos = [
  {
    id: 1,
    titulo: "Educação para Todos",
    organizacao: "Instituto Educar",
    categoria: "Educação",
    horasContribuidas: 16,
    proximaAtividade: "2024-03-15",
    status: "Em andamento",
    progresso: 65,
  },
  {
    id: 2,
    titulo: "Alimentação Solidária",
    organizacao: "Ação Solidária RJ",
    categoria: "Assistência Social",
    horasContribuidas: 12,
    proximaAtividade: "2024-03-12",
    status: "Em andamento",
    progresso: 40,
  },
]

const projetosConcluidos = [
  {
    id: 3,
    titulo: "Plantio de Árvores",
    organizacao: "Verde Vida BH",
    categoria: "Meio Ambiente",
    horasContribuidas: 8,
    dataConclusao: "2024-02-28",
    impacto: "50 árvores plantadas",
  },
  {
    id: 4,
    titulo: "Apoio a Idosos",
    organizacao: "Cuidar RS",
    categoria: "Assistência Social",
    horasContribuidas: 12,
    dataConclusao: "2024-02-15",
    impacto: "15 idosos atendidos",
  },
]

const doacoesRealizadas = [
  {
    id: 1,
    campanha: "Reforma da Escola Municipal",
    valor: 500,
    data: "2024-03-10",
    status: "Confirmada",
  },
  {
    id: 2,
    campanha: "Tratamento para Maria",
    valor: 200,
    data: "2024-03-05",
    status: "Confirmada",
  },
  {
    id: 3,
    campanha: "Biblioteca Comunitária",
    valor: 300,
    data: "2024-02-28",
    status: "Confirmada",
  },
]

const conquistas = [
  {
    titulo: "Primeiro Voluntário",
    descricao: "Completou seu primeiro projeto de voluntariado",
    icone: "🌟",
    desbloqueada: true,
  },
  {
    titulo: "Educador Dedicado",
    descricao: "Contribuiu com mais de 20 horas em projetos de educação",
    icone: "📚",
    desbloqueada: true,
  },
  {
    titulo: "Coração Generoso",
    descricao: "Realizou mais de 5 doações",
    icone: "❤️",
    desbloqueada: true,
  },
  {
    titulo: "Impacto 100+",
    descricao: "Impactou mais de 100 pessoas com suas ações",
    icone: "🎯",
    desbloqueada: true,
  },
  {
    titulo: "Voluntário Veterano",
    descricao: "Completou mais de 50 horas de voluntariado",
    icone: "🏆",
    desbloqueada: false,
  },
]

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuthCheck();
  const [projects, setProjects] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [userStats, setUserStats] = useState({
    horasVoluntariado: 0,
    projetosAtivos: 0,
    projetosConcluidos: 0,
    doacoesRealizadas: 0,
    valorDoado: 0,
    impactoGerado: 0
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('auth_token');
    
    try {
      // Buscar projetos
      const projectsResponse = await fetch('http://localhost:3333/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        console.log("📋 Projetos carregados:", projectsData);
      }

      // Buscar campanhas
      const campaignsResponse = await fetch('http://localhost:3333/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setCampaigns(campaignsData);
        console.log("🎯 Campanhas carregadas:", campaignsData);
      }

    } catch (error) {
      console.error("💥 Erro ao carregar dados:", error);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não mostrar nada (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-2">
              Olá, {user?.name || 'Usuário'}!
            </h1>
            <p className="text-lg text-muted-foreground">Acompanhe seu impacto e atividades na comunidade</p>
          </div>
          <div className="flex gap-3">
            <Link href="/perfil">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Ver Perfil
              </Button>
            </Link>
            <Link href="/perfil">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Horas Voluntárias</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.horasVoluntariado}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Projetos Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.projetosAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Projetos Concluídos</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.projetosConcluidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Doado</p>
                  <p className="text-2xl font-bold text-foreground">{formatarMoeda(estatisticas.valorDoado)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso para Próxima Conquista */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Próxima Conquista
            </CardTitle>
            <CardDescription>Você está quase lá!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-2xl">🏆</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Voluntário Veterano</span>
                  <span className="text-sm text-muted-foreground">{estatisticas.horasVoluntariado}/50 horas</span>
                </div>
                <Progress value={(estatisticas.horasVoluntariado / 50) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Faltam apenas {50 - estatisticas.horasVoluntariado} horas para desbloquear esta conquista!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="projetos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="doacoes">Doações</TabsTrigger>
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
          </TabsList>

          {/* Tab Projetos */}
          <TabsContent value="projetos" className="space-y-6">
            {/* Projetos Ativos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Projetos Ativos ({projetosAtivos.length})
                </CardTitle>
                <CardDescription>Projetos em que você está participando atualmente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projetosAtivos.map((projeto) => (
                    <div key={projeto.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{projeto.titulo}</h3>
                          <p className="text-muted-foreground">{projeto.organizacao}</p>
                        </div>
                        <Badge variant="secondary">{projeto.categoria}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{projeto.horasContribuidas}h contribuídas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Próxima: {projeto.proximaAtividade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{projeto.progresso}% concluído</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso do Projeto</span>
                          <span>{projeto.progresso}%</span>
                        </div>
                        <Progress value={projeto.progresso} className="h-2" />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link href={`/projetos/${projeto.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button size="sm">Registrar Atividade</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projetos Concluídos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Projetos Concluídos ({projetosConcluidos.length})
                </CardTitle>
                <CardDescription>Projetos que você completou com sucesso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projetosConcluidos.map((projeto) => (
                    <div key={projeto.id} className="border rounded-lg p-4 bg-green-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{projeto.titulo}</h3>
                          <p className="text-muted-foreground">{projeto.organizacao}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Concluído
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{projeto.horasContribuidas}h contribuídas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Concluído em {projeto.dataConclusao}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{projeto.impacto}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Doações */}
          <TabsContent value="doacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Histórico de Doações
                </CardTitle>
                <CardDescription>Suas contribuições financeiras para campanhas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doacoesRealizadas.map((doacao) => (
                    <div key={doacao.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{doacao.campanha}</h3>
                        <p className="text-sm text-muted-foreground">{doacao.data}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatarMoeda(doacao.valor)}</p>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {doacao.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-card rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Doado:</span>
                    <span className="text-xl font-bold text-primary">{formatarMoeda(estatisticas.valorDoado)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Conquistas */}
          <TabsContent value="conquistas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Suas Conquistas
                </CardTitle>
                <CardDescription>Marcos alcançados em sua jornada de voluntariado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {conquistas.map((conquista, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        conquista.desbloqueada ? "bg-green-50/50 border-green-200" : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{conquista.icone}</div>
                        <div>
                          <h3 className="font-semibold">{conquista.titulo}</h3>
                          <p className="text-sm text-muted-foreground">{conquista.descricao}</p>
                          {conquista.desbloqueada ? (
                            <Badge variant="outline" className="text-green-600 border-green-600 mt-2">
                              Desbloqueada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="mt-2">
                              Bloqueada
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Atividades */}
          <TabsContent value="atividades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>Suas ações mais recentes na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border-l-4 border-primary">
                    <Heart className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Doação realizada</p>
                      <p className="text-sm text-muted-foreground">
                        Você doou R$ 500,00 para "Reforma da Escola Municipal"
                      </p>
                      <p className="text-xs text-muted-foreground">10 de março, 2024</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border-l-4 border-green-500">
                    <Users className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Projeto concluído</p>
                      <p className="text-sm text-muted-foreground">
                        Você completou o projeto "Plantio de Árvores" com 8 horas de contribuição
                      </p>
                      <p className="text-xs text-muted-foreground">28 de fevereiro, 2024</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500">
                    <Award className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Nova conquista</p>
                      <p className="text-sm text-muted-foreground">Você desbloqueou "Coração Generoso"</p>
                      <p className="text-xs text-muted-foreground">25 de fevereiro, 2024</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border-l-4 border-primary">
                    <Users className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Inscrição em projeto</p>
                      <p className="text-sm text-muted-foreground">
                        Você se inscreveu no projeto "Alimentação Solidária"
                      </p>
                      <p className="text-xs text-muted-foreground">20 de fevereiro, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
