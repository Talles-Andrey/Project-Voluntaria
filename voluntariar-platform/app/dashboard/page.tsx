"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Users, Clock, TrendingUp, Calendar, Award, Target, Activity, Gift, User, Settings, Loader2 } from "lucide-react"
import { useAuthCheck } from "@/hooks/useAuthCheck"

// Definição de tipos
interface Doacao {
  id: number;
  campanha?: string;
  campanhaId?: string;
  campaignId?: string;
  campaign_id?: string;
  campaign?: string;
  campaignTitle?: string;
  title?: string;
  valor?: number;
  amount?: number;
  data?: string;
  createdAt?: string;
  status?: string;
  message?: string;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuthCheck();
  const [doacoesRealizadas, setDoacoesRealizadas] = useState<Doacao[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    horasVoluntariado: 0,
    projetosAtivos: 0,
    projetosConcluidos: 0,
    doacoesRealizadas: 0,
    valorDoado: 0,
    impactoGerado: 0
  });

  // Estados adicionais para nomes das campanhas
  const [campanhasInfo, setCampanhasInfo] = useState<{[key: string]: string}>({})

  // Projetos (serão carregados do backend)
  const [projetosAtivos, setProjetosAtivos] = useState<any[]>([])
  const [projetosConcluidos, setProjetosConcluidos] = useState<any[]>([])
  const [loadingProjetosAtivos, setLoadingProjetosAtivos] = useState<boolean>(false)
  const [loadingProjetosConcluidos, setLoadingProjetosConcluidos] = useState<boolean>(false)
  const [loadingDoacoes, setLoadingDoacoes] = useState<boolean>(false)
  const [erroProjetosAtivos, setErroProjetosAtivos] = useState<string | null>(null)
  const [erroProjetosConcluidos, setErroProjetosConcluidos] = useState<string | null>(null)
  const [participandoProjeto, setParticipandoProjeto] = useState<{[key: string]: boolean}>({})
  const [processandoParticipacao, setProcessandoParticipacao] = useState<{[key: string]: boolean}>({})

  // Estados para modal de doação
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [creatingDonation, setCreatingDonation] = useState(false)
  const [novaDoacaoForm, setNovaDoacaoForm] = useState({
    campaignId: '',
    amount: 0,
    message: '',
    anonymous: false
  })
  const [campanhasDisponiveis, setCampanhasDisponiveis] = useState<any[]>([])
  const [loadingCampanhas, setLoadingCampanhas] = useState(false)
  const verificarParticipacao = (projeto: any) => {
    if (!user?.id) return false;
    
    // Verificar se o usuário está na lista de users/enrollments do projeto
    const enrollments = projeto.enrollments || projeto.users || [];
    return enrollments.some((enrollment: any) => {
      const userId = enrollment.volunteer?.id || enrollment.volunteerId || enrollment.id;
      return userId === user.id;
    });
  };

  // Função para participar do projeto
  const participarDoProjeto = async (projeto: any) => {
    const projetoId = projeto.id || projeto.project?.id;
    if (!projetoId || !user?.id) return;

    setProcessandoParticipacao(prev => ({ ...prev, [projetoId]: true }));

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3333/api/projects/${projetoId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Atualizar estado local
        setParticipandoProjeto(prev => ({ ...prev, [projetoId]: true }));
        
        // Recarregar dados para refletir a mudança
        fetchDashboardData();
        
        alert('Você agora está participando deste projeto!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao participar do projeto: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao participar do projeto:', error);
      alert('Erro ao participar do projeto. Tente novamente.');
    } finally {
      setProcessandoParticipacao(prev => ({ ...prev, [projetoId]: false }));
    }
  };

  // Função para criar nova doação
  // Função para buscar nomes das campanhas
  const buscarInfoCampanhas = async (campanhaIds: string[]) => {
    const token = localStorage.getItem('auth_token');
    const novasInfo: {[key: string]: string} = {};
    
    console.log("🔍 Buscando informações para campanhas:", campanhaIds);
    console.log("🔍 Cache atual campanhasInfo:", campanhasInfo);
    
    await Promise.all(
      campanhaIds.map(async (id) => {
        if (id && !campanhasInfo[id] && !novasInfo[id]) {
          try {
            console.log(`🔍 Fazendo request para campanha ${id}`);
            const url = `http://localhost:3333/api/campaigns/${id}`;
            console.log(`📞 URL da requisição: ${url}`);
            
            const response = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log(`📡 Response status para ${id}:`, response.status);
            
            if (response.ok) {
              const campanha = await response.json();
              console.log(`✅ Dados da campanha ${id}:`, campanha);
              
              const nomeCampanha = campanha.titulo || 
                                 campanha.title || 
                                 campanha.name || 
                                 campanha.nome || 
                                 `Campanha ${id}`;
              
              novasInfo[id] = nomeCampanha;
              console.log(`📝 Nome extraído para ${id}: ${nomeCampanha}`);
            } else {
              const errorText = await response.text();
              console.log(`❌ Erro ao buscar campanha ${id}: Status ${response.status}, Body: ${errorText}`);
              novasInfo[id] = `Campanha ${id}`;
            }
          } catch (error) {
            console.error(`💥 Erro ao buscar campanha ${id}:`, error);
            novasInfo[id] = `Campanha ${id}`;
          }
        } else if (campanhasInfo[id]) {
          console.log(`💾 Campanha ${id} já está no cache: ${campanhasInfo[id]}`);
        }
      })
    );
    
    console.log("📝 Novas informações de campanhas:", novasInfo);
    
    if (Object.keys(novasInfo).length > 0) {
      setCampanhasInfo(prev => {
        const updated = { ...prev, ...novasInfo };
        console.log("🗃️ Estado atualizado campanhasInfo:", updated);
        return updated;
      });
    }
  };

  const carregarCampanhasDisponiveis = async () => {
    setLoadingCampanhas(true);
    try {
      console.log("🔍 Carregando campanhas disponíveis...");
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.error("❌ Token não encontrado para carregar campanhas");
        setCampanhasDisponiveis([]);
        return;
      }

      const response = await fetch('http://localhost:3333/api/campaigns', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("📡 Status da resposta campanhas:", response.status);

      if (response.ok) {
        const campanhas = await response.json();
        console.log("✅ Campanhas carregadas:", campanhas);
        console.log("✅ Quantidade de campanhas:", campanhas.length);
        
        // Filtrar apenas campanhas ativas
        const campanhasAtivas = campanhas.filter((campanha: any) => {
          const isActive = campanha.status === 'active' || campanha.status === 'ativa';
          console.log(`📋 Campanha ${campanha.id}: status=${campanha.status}, ativa=${isActive}`);
          return isActive;
        });
        
        console.log("✅ Campanhas ativas filtradas:", campanhasAtivas);
        console.log("✅ Quantidade de campanhas ativas:", campanhasAtivas.length);
        
        setCampanhasDisponiveis(campanhasAtivas);
      } else {
        const errorText = await response.text();
        console.error("❌ Erro ao carregar campanhas:", {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        setCampanhasDisponiveis([]);
      }
    } catch (error) {
      console.error("💥 Erro ao carregar campanhas:", error);
      setCampanhasDisponiveis([]);
    } finally {
      setLoadingCampanhas(false);
    }
  };

  const abrirModalDoacao = () => {
    setShowDonationModal(true);
    carregarCampanhasDisponiveis();
  };

  const criarDoacao = async () => {
    if (!novaDoacaoForm.campaignId || !novaDoacaoForm.amount || novaDoacaoForm.amount <= 0) {
      alert('Por favor, selecione uma campanha e insira um valor válido.');
      return;
    }

    // Validar se é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(novaDoacaoForm.campaignId)) {
      alert('ID da campanha inválido. Por favor, selecione uma campanha válida.');
      return;
    }

    // Verificar se o usuário está autenticado
    if (!user?.id) {
      alert('Erro: Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    setCreatingDonation(true);

    try {
      console.log("🚀 === INICIANDO CRIAÇÃO DE DOAÇÃO ===");
      console.log("🚀 Campanha ID:", novaDoacaoForm.campaignId);
      console.log("� Valor:", novaDoacaoForm.amount);
      console.log("👤 Dados do usuário:", {
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name
      });
      console.log("📝 Form completo:", novaDoacaoForm);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const requestBody = {
        amount: Number(novaDoacaoForm.amount),
        donorName: user?.name || 'Usuário',
        donorEmail: user?.email || '',
        message: novaDoacaoForm.message || '',
        anonymous: Boolean(novaDoacaoForm.anonymous),
        userId: user?.id
      };

      console.log("📦 Body da requisição:", requestBody);
      console.log("🔑 Token:", token ? `${token.substring(0, 20)}...` : "Ausente");

      const url = `http://localhost:3333/api/campaigns/${novaDoacaoForm.campaignId}/donate`;
      console.log("🌐 URL da requisição:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Headers da resposta:", response.headers);

      if (response.ok) {
        const doacaoResponse = await response.json();
        console.log("✅ Resposta de sucesso:", doacaoResponse);
        console.log("✅ ID da doação criada:", doacaoResponse.id || doacaoResponse.donation?.id);
        
        alert('Doação realizada com sucesso!');
        setShowDonationModal(false);
        setNovaDoacaoForm({
          campaignId: '',
          amount: 0,
          message: '',
          anonymous: false
        });
        
        // Aguardar um pouco antes de recarregar para garantir que o banco foi atualizado
        console.log("⏳ Aguardando 2 segundos antes de recarregar dados...");
        setTimeout(() => {
          console.log("🔄 Recarregando dados após doação...");
          fetchDashboardData();
        }, 2000);
      } else {
        // Tentar ler a resposta de erro
        let errorMessage = 'Erro desconhecido';
        let errorDetails = '';
        
        try {
          const errorData = await response.json();
          console.error("❌ Erro da API (JSON):", errorData);
          errorMessage = errorData.message || errorData.error || 'Erro desconhecido';
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch (parseError) {
          // Se não conseguir fazer parse como JSON, tentar como texto
          try {
            const errorText = await response.text();
            console.error("❌ Erro da API (Texto):", errorText);
            errorMessage = errorText || 'Erro desconhecido';
            errorDetails = errorText;
          } catch (textError) {
            console.error("❌ Erro ao ler resposta:", textError);
            errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        console.error("❌ Detalhes completos do erro:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          errorDetails
        });
        
        alert(`Erro ao realizar doação (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error('💥 Erro na requisição:', error);
      
      let errorMessage = 'Erro ao conectar com o servidor.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Erro ao realizar doação: ${errorMessage}`);
    } finally {
      setCreatingDonation(false);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect - Auth status:", { 
      isAuthenticated, 
      userId: user?.id, 
      isLoading,
      userObject: user
    });
    
    // Aguardar carregar completamente e ter user.id
    if (isAuthenticated && user && user.id && !isLoading) {
      console.log("✅ Usuário completamente autenticado, aguardando 100ms antes de carregar dados...");
      // Pequeno delay para garantir que todos os dados do usuário estão disponíveis
      setTimeout(() => {
        fetchDashboardData();
      }, 100);
    } else {
      console.log("❌ Aguardando autenticação completa...", {
        isAuthenticated,
        hasUser: !!user,
        hasUserId: !!user?.id,
        isLoading
      });
    }
  }, [isAuthenticated, user, isLoading]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('auth_token');
    console.log("🚀 Iniciando fetchDashboardData...");
    console.log("👤 Usuário completo:", user);
    console.log("🆔 User ID:", user?.id);
    console.log("🔑 Token:", token ? `Presente (${token.substring(0, 20)}...)` : "Ausente");
    
    if (!user?.id) {
      console.error("❌ ERRO: user.id não está disponível!", {
        user,
        userId: user?.id,
        userKeys: user ? Object.keys(user) : 'user é null'
      });
      return;
    }
    
    console.log("✅ Prosseguindo com user.id:", user.id);
    
    try {
      // Buscar projetos
      // Projetos ativos
      setLoadingProjetosAtivos(true)
      setErroProjetosAtivos(null)
      const projectsAtivosResponse = await fetch('http://localhost:3333/api/projects?status=open', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (projectsAtivosResponse.ok) {
        const projetosAtivosData = await projectsAtivosResponse.json();
        // A API do backend retorna possivelmente [{ project, users }, ...]
        const normalizedAtivos = projetosAtivosData.map((item: any) => item.project ? { ...item.project, users: item.users || [] } : item);
        setProjetosAtivos(normalizedAtivos.slice(0, 3));
        
        // Atualizar estatísticas com total de projetos ativos e voluntários
        setEstatisticas(prev => ({
          ...prev,
          projetosAtivos: normalizedAtivos.length,
          horasVoluntariado: normalizedAtivos.reduce((total: number, p: any) => total + (p.users?.length || 0), 0)
        }));
        
        console.log("📋 Projetos ativos carregados:", normalizedAtivos);
      } else {
        setErroProjetosAtivos(`Erro ao carregar projetos ativos: ${projectsAtivosResponse.status}`)
      }
      setLoadingProjetosAtivos(false)

      // Projetos concluídos/fechados
      setLoadingProjetosConcluidos(true)
      setErroProjetosConcluidos(null)
      const projectsConcluidosResponse = await fetch('http://localhost:3333/api/projects?status=closed', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (projectsConcluidosResponse.ok) {
        const projetosConcluidosData = await projectsConcluidosResponse.json();
        const normalizedConcluidos = projetosConcluidosData.map((item: any) => item.project ? { ...item.project, users: item.users || [] } : item);
        setProjetosConcluidos(normalizedConcluidos.slice(0, 3));
        
        // Atualizar estatísticas de projetos concluídos
        setEstatisticas(prev => ({
          ...prev,
          projetosConcluidos: normalizedConcluidos.length
        }));
        
        console.log("📋 Projetos concluídos carregados:", normalizedConcluidos);
      } else {
        setErroProjetosConcluidos(`Erro ao carregar projetos concluídos: ${projectsConcluidosResponse.status}`)
      }
      setLoadingProjetosConcluidos(false)

      // Buscar doações realizadas pelo usuário
      setLoadingDoacoes(true);
      try {
        console.log("🔍 === INICIANDO BUSCA DE DOAÇÕES ===");
        console.log("🆔 User ID para busca:", user?.id);
        console.log("🆔 Tipo do User ID:", typeof user?.id);
        console.log("� URL completa:", `http://localhost:3333/api/donations/${user?.id}`);
        console.log("🔑 Token:", token ? `${token.substring(0, 20)}...` : "Ausente");
        
        const doacoesResponse = await fetch(`http://localhost:3333/api/donations/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log("📡 Status da resposta:", doacoesResponse.status);
        console.log("📡 Status text:", doacoesResponse.statusText);
        
        if (doacoesResponse.ok) {
          const doacoesData = await doacoesResponse.json();
          console.log("✅ Resposta da API de doações:", doacoesData);
          console.log("✅ Tipo de dados recebido:", typeof doacoesData);
          console.log("✅ É array?", Array.isArray(doacoesData));
          console.log("✅ Quantidade de doações:", Array.isArray(doacoesData) ? doacoesData.length : 'N/A');
          
          setDoacoesRealizadas(doacoesData);
          
          // Buscar informações das campanhas para as doações
          if (Array.isArray(doacoesData) && doacoesData.length > 0) {
            const campanhaIds = doacoesData
              .map((doacao: any) => doacao.campanhaId || doacao.campaignId || doacao.campaign_id)
              .filter((id: string) => id); // Filtrar IDs válidos
            
            console.log("🔍 IDs das campanhas encontrados:", campanhaIds);
            console.log("🔍 Estrutura completa das doações:", doacoesData);
            
            if (campanhaIds.length > 0) {
              await buscarInfoCampanhas(campanhaIds);
            }
          }
          
          // Atualizar estatísticas de doações
          const totalDoacoes = Array.isArray(doacoesData) ? doacoesData.length : 0;
          
          // Debug: verificar estrutura das doações
          console.log("🔍 Estrutura das doações recebidas:", doacoesData);
          
          let valorTotal = 0;
          
          if (Array.isArray(doacoesData) && doacoesData.length > 0) {
            valorTotal = doacoesData.reduce((total: number, doacao: any) => {
              const valor = Number(doacao.amount) || Number(doacao.valor) || 0;
              console.log(`💰 Doação ${doacao.id}: amount=${doacao.amount}, valor=${doacao.valor}, convertido=${valor}`);
              return total + valor;
            }, 0);
          }
          
          console.log(`💵 Valor total calculado: ${valorTotal}`);
          
          setEstatisticas(prev => ({
            ...prev,
            doacoesRealizadas: totalDoacoes,
            valorDoado: valorTotal
          }));
          
          console.log("💰 Doações do usuário carregadas:", doacoesData);
        } else {
          const errorText = await doacoesResponse.text();
          console.log("❌ Erro ao carregar doações:", {
            status: doacoesResponse.status,
            statusText: doacoesResponse.statusText,
            errorText: errorText
          });
          
          // Tentar endpoint alternativo
          console.log("🔄 Tentando endpoint alternativo...");
          try {
            const alternativeResponse = await fetch(`http://localhost:3333/api/users/${user?.id}/donations`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log("📡 Status endpoint alternativo:", alternativeResponse.status);
            
            if (alternativeResponse.ok) {
              const altData = await alternativeResponse.json();
              console.log("✅ Dados do endpoint alternativo:", altData);
              setDoacoesRealizadas(altData);
            } else {
              console.log("❌ Endpoint alternativo também falhou");
              setDoacoesRealizadas([]);
            }
          } catch (altError) {
            console.log("❌ Erro no endpoint alternativo:", altError);
            setDoacoesRealizadas([]);
          }
          
          // Definir valores padrão quando há erro
          setEstatisticas(prev => ({
            ...prev,
            doacoesRealizadas: 0,
            valorDoado: 0
          }));
        }
      } catch (error) {
        console.error("💥 Erro ao carregar doações:", error);
        // Definir valores padrão quando há erro
        setDoacoesRealizadas([]);
        setEstatisticas(prev => ({
          ...prev,
          doacoesRealizadas: 0,
          valorDoado: 0
        }));
      } finally {
        setLoadingDoacoes(false);
      }

    } catch (error) {
      console.error("💥 Erro ao carregar dados:", error);
    }
  };

  const formatarMoeda = (valor: number | undefined | null) => {
    // Verificar se o valor é válido
    if (valor === undefined || valor === null || isNaN(valor)) {
      return 'R$ 0,00';
    }
    
    const numericValue = Number(valor);
    
    if (isNaN(numericValue)) {
      return 'R$ 0,00';
    }
    
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  }

  const formatarData = (dateLike: string | Date | undefined | null) => {
    if (!dateLike) return '-'
    const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike
    if (Number.isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('pt-BR')
  }

  const calcularProgresso = (projeto: any) => {
    // progresso baseado no número de voluntários inscritos vs maxVolunteers
    const inscritos = (projeto.users && projeto.users.length) || 0
    const max = projeto.maxVolunteers || projeto.max_volunteers || 1
    const pct = max > 0 ? Math.round((inscritos / max) * 100) : 0
    return Math.min(Math.max(pct, 0), 100)
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
              Dashboard
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Horas Voluntárias</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">
                    {loadingProjetosAtivos ? (
                      <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                    ) : (
                      `${estatisticas.horasVoluntariado}h`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Projetos Ativos</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">
                    {loadingProjetosAtivos ? (
                      <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                    ) : (
                      estatisticas.projetosAtivos
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Projetos Concluídos</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">
                    {loadingProjetosConcluidos ? (
                      <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                    ) : (
                      estatisticas.projetosConcluidos
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Total Doado</p>
                  <p className="text-lg lg:text-2xl font-bold text-foreground">
                    {loadingDoacoes ? (
                      <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" />
                    ) : (
                      formatarMoeda(estatisticas.valorDoado)
                    )}
                  </p>
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
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="projetos" className="text-xs sm:text-sm">Projetos</TabsTrigger>
            <TabsTrigger value="doacoes" className="text-xs sm:text-sm">Doações</TabsTrigger>
            <TabsTrigger value="atividades" className="text-xs sm:text-sm">Atividades</TabsTrigger>
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
                    {loadingProjetosAtivos ? (
                      <div className="text-center py-6">Carregando projetos ativos...</div>
                    ) : erroProjetosAtivos ? (
                      <div className="text-center py-6 text-red-600">{erroProjetosAtivos}</div>
                    ) : projetosAtivos.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">Não há projetos ativos no momento.</div>
                    ) : (
                      projetosAtivos.map((projeto) => (
                        <div key={projeto.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{projeto.title || projeto.titulo}</h3>
                              <p className="text-muted-foreground">{projeto.ngoName || projeto.organizacao || projeto.ngo?.name}</p>
                            </div>
                            <Badge variant="secondary">{projeto.cause || projeto.categoria}</Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{(projeto.users && projeto.users.length) || projeto.volunteerCount || 0} voluntários</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Próxima: {formatarData(projeto.startDate || projeto.nextActivity || projeto.proximaAtividade)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{calcularProgresso(projeto)}% concluído</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso do Projeto</span>
                              <span>{calcularProgresso(projeto)}%</span>
                            </div>
                            <Progress value={calcularProgresso(projeto)} className="h-2" />
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Link href={`/projetos/${projeto.id || projeto.project?.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </Link>
                            {verificarParticipacao(projeto) ? (
                              <Button size="sm" disabled variant="secondary">
                                Já Participando
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => participarDoProjeto(projeto)}
                                disabled={processandoParticipacao[projeto.id || projeto.project?.id]}
                              >
                                {processandoParticipacao[projeto.id || projeto.project?.id] ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Participando...
                                  </>
                                ) : (
                                  'Participar do Projeto'
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
                  {loadingProjetosConcluidos ? (
                    <div className="text-center py-6">Carregando projetos concluídos...</div>
                  ) : erroProjetosConcluidos ? (
                    <div className="text-center py-6 text-red-600">{erroProjetosConcluidos}</div>
                  ) : projetosConcluidos.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">Não há projetos concluídos no momento.</div>
                  ) : (
                    projetosConcluidos.map((projeto) => (
                      <div key={projeto.id} className="border rounded-lg p-4 bg-green-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{projeto.title || projeto.titulo}</h3>
                            <p className="text-muted-foreground">{projeto.ngoName || projeto.organizacao || projeto.ngo?.name}</p>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Concluído
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{(projeto.users && projeto.users.length) || projeto.volunteerCount || 0} voluntários</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Próxima: {formatarData(projeto.startDate || projeto.nextActivity || projeto.proximaAtividade)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{calcularProgresso(projeto)}% concluído</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso do Projeto</span>
                            <span>{calcularProgresso(projeto)}%</span>
                          </div>
                          <Progress value={calcularProgresso(projeto)} className="h-2" />
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Link href={`/projetos/${projeto.id || projeto.project?.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </Link>
                          {verificarParticipacao(projeto) ? (
                            <Button size="sm" disabled variant="secondary">
                              Já Participando
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => participarDoProjeto(projeto)}
                              disabled={processandoParticipacao[projeto.id || projeto.project?.id]}
                            >
                              {processandoParticipacao[projeto.id || projeto.project?.id] ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Participando...
                                </>
                              ) : (
                                'Participar do Projeto'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Doações */}
          <TabsContent value="doacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Histórico de Doações
                    </CardTitle>
                    <CardDescription>Suas contribuições financeiras para campanhas</CardDescription>
                  </div>
                  <Button onClick={abrirModalDoacao} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    <Gift className="mr-2 h-4 w-4" />
                    Nova Doação
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingDoacoes ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Carregando doações...</span>
                    </div>
                  ) : doacoesRealizadas.length > 0 ? (
                    doacoesRealizadas.map((doacao) => (
                      <div key={doacao.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {(() => {
                              const campanhaId = doacao.campanhaId || doacao.campaignId || doacao.campaign_id;
                              const nomeCampanha = (campanhaId && campanhasInfo[campanhaId]) || 
                                                  doacao.campanha || 
                                                  doacao.title || 
                                                  doacao.campaign || 
                                                  doacao.campaignTitle ||
                                                  'Campanha';
                              console.log(`🏷️ Doação ${doacao.id}: campanhaId=${campanhaId}, nome=${nomeCampanha}`, doacao);
                              return nomeCampanha;
                            })()}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doacao.data ? doacao.data : doacao.createdAt ? new Date(doacao.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </p>
                          {doacao.message && (
                            <p className="text-sm text-muted-foreground italic mt-1 line-clamp-2">"{doacao.message}"</p>
                          )}
                        </div>
                        <div className="text-right sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                          <p className="font-semibold text-primary text-lg">{formatarMoeda(doacao.amount || doacao.valor || 0)}</p>
                          <Badge variant="outline" className="text-green-600 border-green-600 shrink-0">
                            {doacao.status || 'Confirmada'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma doação realizada ainda</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-card rounded-lg border">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-medium text-base sm:text-lg">Total Doado:</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">{formatarMoeda(estatisticas.valorDoado)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Atividades */}
          <TabsContent value="atividades" className="space-y-6">
            {/* Resumo dos Projetos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Resumo dos Projetos
                </CardTitle>
                <CardDescription>
                  Seus projetos ativos e concluídos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projetos Ativos */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Projetos Ativos</h4>
                        <p className="text-xs text-muted-foreground">{projetosAtivos.length} projeto(s)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {loadingProjetosAtivos ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-xs">Carregando...</span>
                        </div>
                      ) : projetosAtivos.length > 0 ? (
                        projetosAtivos.slice(0, 3).map((projeto, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded text-sm">
                            <p className="font-medium truncate">{projeto.title || projeto.nome || 'Projeto sem nome'}</p>
                            <p className="text-muted-foreground truncate text-xs">
                              {projeto.description || projeto.descricao || 'Sem descrição'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Nenhum projeto ativo
                        </p>
                      )}
                      {projetosAtivos.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{projetosAtivos.length - 3} projeto(s) adicional(is)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Projetos Concluídos */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Projetos Concluídos</h4>
                        <p className="text-xs text-muted-foreground">{projetosConcluidos.length} projeto(s)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {loadingProjetosConcluidos ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-xs">Carregando...</span>
                        </div>
                      ) : projetosConcluidos.length > 0 ? (
                        projetosConcluidos.slice(0, 3).map((projeto, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded text-sm">
                            <p className="font-medium truncate">{projeto.title || projeto.nome || 'Projeto sem nome'}</p>
                            <p className="text-muted-foreground truncate text-xs">
                              {projeto.description || projeto.descricao || 'Sem descrição'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Nenhum projeto concluído
                        </p>
                      )}
                      {projetosConcluidos.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{projetosConcluidos.length - 3} projeto(s) adicional(is)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo das Doações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Resumo das Doações
                </CardTitle>
                <CardDescription>
                  Suas contribuições financeiras recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {doacoesRealizadas?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Doações realizadas
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatarMoeda(estatisticas.valorDoado)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total doado
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {new Set(doacoesRealizadas?.map((d: any) => d.campanhaId || d.campaignId || d.campaign_id)).size || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Campanhas apoiadas
                    </div>
                  </div>
                </div>

                {/* Últimas Doações */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-3">Todas as Doações</h4>
                  {doacoesRealizadas.length > 0 ? (
                    doacoesRealizadas.map((doacao) => (
                      <div key={doacao.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {(() => {
                              const campanhaId = doacao.campanhaId || doacao.campaignId || doacao.campaign_id;
                              return (campanhaId && campanhasInfo[campanhaId]) || 
                                     doacao.campanha || 
                                     doacao.title || 
                                     'Campanha';
                            })()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doacao.createdAt ? new Date(doacao.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary text-sm">
                            {formatarMoeda(doacao.amount || doacao.valor || 0)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Nenhuma doação realizada ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline de Atividades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Timeline de Atividades
                </CardTitle>
                <CardDescription>
                  Histórico completo de suas ações na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Atividade de Doação Recente */}
                  {doacoesRealizadas.length > 0 && (
                    <div className="flex items-start gap-3 p-3 border-l-4 border-primary bg-primary/5 rounded">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Doação realizada</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Você doou {formatarMoeda(doacoesRealizadas[0]?.amount || doacoesRealizadas[0]?.valor || 0)} para "
                          {(() => {
                            const ultimaDoacao = doacoesRealizadas[0];
                            const campanhaId = ultimaDoacao?.campanhaId || ultimaDoacao?.campaignId || ultimaDoacao?.campaign_id;
                            return (campanhaId && campanhasInfo[campanhaId]) || 
                                   ultimaDoacao?.campanha || 
                                   ultimaDoacao?.title || 
                                   'Campanha';
                          })()}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doacoesRealizadas[0]?.createdAt ? 
                            new Date(doacoesRealizadas[0].createdAt).toLocaleDateString('pt-BR') : 
                            'Data não disponível'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Atividade de Projeto Ativo */}
                  {projetosAtivos.length > 0 && (
                    <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50/50 rounded">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Participação em projeto ativo</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Você está participando do projeto "{projetosAtivos[0]?.title || projetosAtivos[0]?.nome || 'Projeto'}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Projeto em andamento
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Atividade de Projeto Concluído */}
                  {projetosConcluidos.length > 0 && (
                    <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50/50 rounded">
                      <Award className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Projeto concluído</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Você concluiu o projeto "{projetosConcluidos[0]?.title || projetosConcluidos[0]?.nome || 'Projeto'}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Projeto finalizado com sucesso
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Estado vazio */}
                  {doacoesRealizadas.length === 0 && projetosAtivos.length === 0 && projetosConcluidos.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm font-medium">Nenhuma atividade registrada</p>
                      <p className="text-xs">Comece participando de projetos ou fazendo doações para ver suas atividades aqui!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Doação */}
      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5 text-primary" />
              Nova Doação
            </DialogTitle>
            <DialogDescription className="text-sm">
              Faça uma doação para uma campanha e ajude a fazer a diferença.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign" className="text-sm font-medium">Selecionar Campanha</Label>
              <Select
                value={novaDoacaoForm.campaignId}
                onValueChange={(value) => setNovaDoacaoForm(prev => ({ ...prev, campaignId: value }))}
                disabled={loadingCampanhas}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingCampanhas ? "Carregando campanhas..." : "Escolha uma campanha"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingCampanhas ? (
                    <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando campanhas...</span>
                    </div>
                  ) : campanhasDisponiveis.length > 0 ? (
                    campanhasDisponiveis.map((campanha) => (
                      <SelectItem key={campanha.id} value={campanha.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{campanha.title || campanha.titulo || campanha.nome}</span>
                          {campanha.description && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {campanha.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                      Nenhuma campanha disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-sm font-medium">Valor da Doação (R$)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Ex: 50.00"
                className="w-full"
                value={novaDoacaoForm.amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setNovaDoacaoForm(prev => ({ 
                    ...prev, 
                    amount: value 
                  }));
                }}
              />
              {novaDoacaoForm.amount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Valor: {formatarMoeda(novaDoacaoForm.amount)}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm font-medium">Mensagem (opcional)</Label>
              <Input
                id="message"
                type="text"
                placeholder="Deixe uma mensagem de apoio..."
                className="w-full"
                value={novaDoacaoForm.message}
                onChange={(e) => setNovaDoacaoForm(prev => ({ 
                  ...prev, 
                  message: e.target.value 
                }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={novaDoacaoForm.anonymous}
                onChange={(e) => setNovaDoacaoForm(prev => ({ 
                  ...prev, 
                  anonymous: e.target.checked 
                }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="anonymous" className="text-sm">
                Fazer doação anônima
              </Label>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDonationModal(false)}
              disabled={creatingDonation}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={criarDoacao}
              disabled={
                creatingDonation || 
                !novaDoacaoForm.campaignId || 
                !novaDoacaoForm.amount || 
                novaDoacaoForm.amount <= 0 ||
                !user?.id
              }
              className="w-full sm:w-auto"
            >
              {creatingDonation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Doar {novaDoacaoForm.amount > 0 ? formatarMoeda(novaDoacaoForm.amount) : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
