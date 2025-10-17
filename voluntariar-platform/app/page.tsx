"use client"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Gift, TrendingUp, MapPin, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

// Tipos para as estatísticas
interface Estatisticas {
  voluntariosAtivos: number;
  projetosAtivos: number;
  totalArrecadado: number;
  horasVoluntarias: number;
}

// Tipo para projetos
interface Projeto {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  hoursPerWeek?: number;
  users?: any[];
}

export default function HomePage() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    voluntariosAtivos: 0,
    projetosAtivos: 0,
    totalArrecadado: 0,
    horasVoluntarias: 0
  });
  const [projetosDestaque, setProjetosDestaque] = useState<Projeto[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    fetchEstatisticas();
    fetchProjetosDestaque();
  }, []);

  const fetchEstatisticas = async () => {
    try {
      setLoadingStats(true);
      
      // Fazer requisições em paralelo para melhor performance
      const [projectsResponse, campaignsResponse] = await Promise.all([
        fetch('http://localhost:3333/api/projects?status=open'),
        fetch('http://localhost:3333/api/campaigns')
      ]);
      
      if (!projectsResponse.ok || !campaignsResponse.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      
      const [projectsData, campaignsData] = await Promise.all([
        projectsResponse.json(),
        campaignsResponse.json()
      ]);
      
      // Calcular estatísticas de forma mais robusta
      const totalProjects = Array.isArray(projectsData) ? projectsData.length : 0;
      
      const totalVolunteers = Array.isArray(projectsData) ? projectsData.reduce((total: number, item: any) => {
        const project = item.project || item;
        const users = project.users || [];
        return total + (Array.isArray(users) ? users.length : 0);
      }, 0) : 0;
      
      const totalRaised = Array.isArray(campaignsData) ? campaignsData.reduce((total: number, campaign: any) => {
        return total + (campaign.currentAmount || campaign.arrecadado || 0);
      }, 0) : 0;
      
      // Calcular horas voluntárias baseado no número de voluntários
      // Estimativa: cada voluntário contribui em média 4h/semana * 12 semanas
      const estimatedHours = totalVolunteers * 4 * 12;
      
      setEstatisticas({
        voluntariosAtivos: totalVolunteers,
        projetosAtivos: totalProjects,
        totalArrecadado: totalRaised,
        horasVoluntarias: estimatedHours
      });
      
      console.log('📊 Estatísticas carregadas:', {
        voluntariosAtivos: totalVolunteers,
        projetosAtivos: totalProjects,
        totalArrecadado: totalRaised,
        horasVoluntarias: estimatedHours
      });
      
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      // Em caso de erro, manter valores zerados ou usar valores padrão
      setEstatisticas({
        voluntariosAtivos: 0,
        projetosAtivos: 0,
        totalArrecadado: 0,
        horasVoluntarias: 0
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProjetosDestaque = async () => {
    try {
      setLoadingProjects(true);
      
      const response = await fetch('http://localhost:3333/api/projects?status=open');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('Resposta da API não é um array:', data);
        setProjetosDestaque([]);
        return;
      }
      
      // Pegar os 3 primeiros projetos para destaque e normalizar dados
      const projects = data.slice(0, 3).map((item: any) => {
        const project = item.project || item;
        return {
          id: project.id || Math.random().toString(),
          title: project.title || project.name || 'Projeto sem título',
          description: project.description || 'Descrição não disponível',
          city: project.city || project.cidade || 'São Paulo',
          state: project.state || project.estado || 'SP',
          hoursPerWeek: project.hoursPerWeek || project.horasPorSemana || 4,
          users: project.users || []
        };
      });
      
      setProjetosDestaque(projects);
      console.log('🎯 Projetos em destaque carregados:', projects);
      
    } catch (error) {
      console.error('❌ Erro ao carregar projetos em destaque:', error);
      setProjetosDestaque([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const formatarMoeda = (valor: number | undefined | null) => {
    // Verificar se o valor é válido e converter para número se necessário
    if (valor === undefined || valor === null || isNaN(valor)) {
      return 'R$ 0';
    }
    
    const numericValue = Number(valor);
    
    if (isNaN(numericValue)) {
      return 'R$ 0';
    }
    
    if (numericValue >= 1000000) {
      return `R$ ${(numericValue / 1000000).toFixed(1)}M`;
    } else if (numericValue >= 1000) {
      return `R$ ${(numericValue / 1000).toFixed(0)}K`;
    } else {
      return `R$ ${numericValue.toFixed(0)}`;
    }
  };

  const formatarNumero = (numero: number | undefined | null) => {
    // Verificar se o valor é válido e converter para número se necessário
    if (numero === undefined || numero === null || isNaN(numero)) {
      return '0';
    }
    
    const numericValue = Number(numero);
    
    if (isNaN(numericValue)) {
      return '0';
    }
    
    if (numericValue >= 1000) {
      return `${(numericValue / 1000).toFixed(1)}K+`;
    } else {
      return `${numericValue}+`;
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-card to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-playfair font-bold text-4xl md:text-6xl text-foreground mb-6 text-balance">
              Transforme Vidas Através do
              <span className="text-primary"> Voluntariado</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Conecte-se com projetos sociais, participe de campanhas de doação e faça a diferença na sua comunidade.
              Juntos, podemos construir um mundo melhor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projetos">
                <Button size="lg" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Encontrar Projetos
                </Button>
              </Link>
              <Link href="/campanhas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <Gift className="mr-2 h-5 w-5" />
                  Ver Campanhas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">Como Funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para começar a fazer a diferença
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Encontre Projetos</CardTitle>
                <CardDescription>
                  Explore projetos de voluntariado na sua região e encontre causas que combinam com você
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Participe</CardTitle>
                <CardDescription>
                  Inscreva-se em projetos, doe para campanhas e contribua com seu tempo e recursos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Acompanhe Impacto</CardTitle>
                <CardDescription>
                  Veja o progresso dos projetos e o impacto das suas contribuições na comunidade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">Nosso Impacto</h2>
            <p className="text-lg text-muted-foreground">Números que mostram a força da nossa comunidade</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {loadingStats ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  formatarNumero(estatisticas.voluntariosAtivos)
                )}
              </div>
              <div className="text-muted-foreground">Voluntários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {loadingStats ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  formatarNumero(estatisticas.projetosAtivos)
                )}
              </div>
              <div className="text-muted-foreground">Projetos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {loadingStats ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  formatarMoeda(estatisticas.totalArrecadado)
                )}
              </div>
              <div className="text-muted-foreground">Arrecadado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {loadingStats ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  formatarNumero(estatisticas.horasVoluntarias)
                )}
              </div>
              <div className="text-muted-foreground">Horas Voluntárias</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">
                Projetos em Destaque
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça alguns dos projetos que estão transformando comunidades
              </p>
            </div>
            <Link href="/projetos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loadingProjects ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted animate-pulse rounded w-20" />
                      <div className="h-8 bg-muted animate-pulse rounded w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : projetosDestaque.length > 0 ? (
              projetosDestaque.map((projeto) => (
                <Card key={projeto.id}>
                  <CardHeader>
                    <CardTitle>{projeto.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {projeto.city}, {projeto.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {projeto.description.length > 150 
                        ? `${projeto.description.substring(0, 150)}...`
                        : projeto.description
                      }
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {projeto.hoursPerWeek}h/semana
                      </div>
                      <Link href={`/projetos/${projeto.id}`}>
                        <Button size="sm">Participar</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Estado vazio
              <div className="col-span-3 text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nenhum projeto em destaque no momento</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl text-primary-foreground mb-6">
            Pronto para Fazer a Diferença?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Junte-se à nossa comunidade de voluntários e comece a transformar vidas hoje mesmo.
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary">
              Cadastre-se Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="font-playfair font-bold text-xl">Voluntariar</span>
              </div>
              <p className="text-muted-foreground">
                Conectando pessoas para transformar comunidades através do voluntariado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/projetos" className="hover:text-primary">
                    Projetos
                  </Link>
                </li>
                <li>
                  <Link href="/campanhas" className="hover:text-primary">
                    Campanhas
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/ajuda" className="hover:text-primary">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:text-primary">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/sobre" className="hover:text-primary">
                    Sobre Nós
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/privacidade" className="hover:text-primary">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="hover:text-primary">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Voluntariar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
