"use client"

import { useState, useEffect, useMemo } from "react"
import { apiService } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  FolderOpen,
  Gift,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Building,
  Shield,
  Loader2,
  LogOut,
} from "lucide-react"

// Tipos para os dados da API
interface EstatisticasGerais {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalProjetos: number;
  projetosAtivos: number;
  totalCampanhas: number;
  campanhasAtivas: number;
  valorArrecadado: number;
  horasVoluntariado: number;
}

interface Usuario {
  id: string | number;
  name?: string;
  nome?: string;
  email: string;
  city?: string;
  cidade?: string;
  state?: string;
  estado?: string;
  createdAt?: string;
  dataIngresso?: string;
  status?: string;
  projetos?: number;
  horas?: number;
  doacoes?: number;
}

interface Projeto {
  id: string | number;
  title?: string;
  titulo?: string;
  description?: string;
  organization?: string;
  organizacao?: string;
  category?: string;
  categoria?: string;
  cause?: string;
  city?: string;
  cidade?: string;
  location?: string;
  state?: string;
  estado?: string;
  status: string;
  users?: any[];
  voluntarios?: number;
  maxVolunteers?: number;
  maxVoluntarios?: number;
  enrollments?: any[];
  createdAt?: string;
  dataCriacao?: string;
  startDate?: string;
  dataInicio?: string;
  endDate?: string;
  dataFim?: string;
  ngo?: {
    id: string;
    organizationName: string;
    cnpj: string;
    description: string;
    email: string;
    city: string;
    state: string;
    causes: string[];
    areas: string[];
  };
}

interface Campanha {
  id: string | number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  ngoId: string;
  numberOfDonations: number;
  createdAt: string;
  ngo?: {
    id: string;
    organizationName: string;
    cnpj: string;
    description: string;
    email: string;
    city: string;
    state: string;
    causes: string[];
    areas: string[];
  };
}

export default function AdminPage() {
  // Estados para dados reais da API
  const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasGerais>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalProjetos: 0,
    projetosAtivos: 0,
    totalCampanhas: 0,
    campanhasAtivas: 0,
    valorArrecadado: 0,
    horasVoluntariado: 0,
  });
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  
  // Estados de loading
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  
  // Estados de filtros
  const [filtroUsuarios, setFiltroUsuarios] = useState("")
  const [filtroStatusUsuarios, setFiltroStatusUsuarios] = useState("Todos")
  const [filtroProjetos, setFiltroProjetos] = useState("")
  const [filtroStatusProjetos, setFiltroStatusProjetos] = useState("Todos")
  const [filtroCampanhas, setFiltroCampanhas] = useState("")
  const [filtroStatusCampanhas, setFiltroStatusCampanhas] = useState("Todos")
  const [filtroCategoriaCampanhas, setFiltroCategoriaCampanhas] = useState("Todas")
  
  // Estados para projetos dinâmicos
  const [projetosDinamicos, setProjetosDinamicos] = useState<any[]>([])
  const [isLoadingProjetos, setIsLoadingProjetos] = useState(false)
  const [errorProjetos, setErrorProjetos] = useState("")
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)

  // Estados para campanhas
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [creatingCampaign, setCreatingCampaign] = useState(false)

  // useEffect para carregar dados ao montar o componente
  useEffect(() => {
    fetchAllData();
  }, []);

  // Função para buscar todos os dados
  const fetchAllData = async () => {
    console.log('🔄 Carregando todos os dados...');
    await Promise.all([
      fetchEstatisticas(),
      fetchUsuarios(),
      fetchProjetos(),
      fetchCampanhas()
    ]);
  };

  // Buscar estatísticas gerais
  const fetchEstatisticas = async () => {
    try {
      setLoadingStats(true);
      
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fazer requisições em paralelo
      const [usersResponse, projectsResponse, campaignsResponse] = await Promise.all([
        fetch('http://localhost:3333/api/users/all', { headers }),
        fetch('http://localhost:3333/api/projects', { headers }),
        fetch('http://localhost:3333/api/campaigns', { headers })
      ]);

      const [usersData, projectsData, campaignsData] = await Promise.all([
        usersResponse.json(),
        projectsResponse.json(),
        campaignsResponse.json()
      ]);

      // Calcular estatísticas
      const totalUsuarios = Array.isArray(usersData) ? usersData.length : 0;
      const usuariosAtivos = Array.isArray(usersData) ? usersData.filter(u => u.status === 'active' || u.ativo).length : 0;
      
      const totalProjetos = Array.isArray(projectsData) ? projectsData.length : 0;
      const projetosAtivos = Array.isArray(projectsData) ? projectsData.filter(p => {
        const project = p.project || p;
        return project.status === 'open' || project.status === 'ativo';
      }).length : 0;

      const totalCampanhas = Array.isArray(campaignsData) ? campaignsData.length : 0;
      const campanhasAtivas = Array.isArray(campaignsData) ? campaignsData.filter(c => c.status === 'active').length : 0;

      console.log('📊 Dados das campanhas para cálculo:', campaignsData);
      let valorArrecadado = 0;
      
      if (Array.isArray(campaignsData)) {
        valorArrecadado = campaignsData.reduce((total, campaign) => {
          console.log(`💰 Processando campanha: ${campaign.title}`);
          console.log(`💰 currentAmount original: ${campaign.currentAmount} (tipo: ${typeof campaign.currentAmount})`);
          
          let currentValue = 0;
          if (campaign.currentAmount !== null && campaign.currentAmount !== undefined) {
            currentValue = parseFloat(String(campaign.currentAmount)) || 0;
          }
          
          console.log(`💰 Valor convertido: ${currentValue}`);
          console.log(`💰 Total anterior: ${total}, Novo total: ${total + currentValue}`);
          
          return total + currentValue;
        }, 0);
      }

      // Estimar horas de voluntariado
      const totalVolunteers = Array.isArray(projectsData) ? projectsData.reduce((total, item) => {
        const project = item.project || item;
        return total + (project.users?.length || 0);
      }, 0) : 0;
      const horasVoluntariado = totalVolunteers * 4 * 12; // 4h/semana * 12 semanas

      setEstatisticasGerais({
        totalUsuarios,
        usuariosAtivos,
        totalProjetos,
        projetosAtivos,
        totalCampanhas,
        campanhasAtivas,
        valorArrecadado,
        horasVoluntariado
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Buscar usuários
  const fetchUsuarios = async (searchName?: string) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('auth_token');
      
      // Construir URL com query parameter se houver busca por nome
      let url = 'http://localhost:3333/api/users/all';
      if (searchName && searchName.trim()) {
        url += `?name=${encodeURIComponent(searchName.trim())}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dados dos usuários da API (nova rota):', data);
        setUsuarios(Array.isArray(data) ? data : []);
      } else {
        console.error('Erro na resposta da API de usuários:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Buscar projetos
  const fetchProjetos = async () => {
    try {
      setLoadingProjects(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:3333/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📋 Dados dos projetos da API:', data);
        const normalizedProjects = Array.isArray(data) ? data.map(item => {
          const project = item.project || item;
          return {
            ...project,
            voluntarios: project.users?.length || 0
          };
        }) : [];
        console.log('📋 Projetos normalizados:', normalizedProjects);
        setProjetos(normalizedProjects);
      } else {
        console.error('Erro na resposta da API de projetos:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Buscar campanhas
  const fetchCampanhas = async () => {
    try {
      setLoadingCampaigns(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:3333/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Campanhas recebidas da API:', data);
        
        // Log para debug do cálculo
        if (Array.isArray(data)) {
          const valorTotal = data.reduce((total, campaign) => {
            console.log(`💰 Campanha "${campaign.title}": currentAmount = ${campaign.currentAmount}`);
            return total + (campaign.currentAmount || 0);
          }, 0);
          console.log(`💵 Valor total arrecadado calculado: R$ ${valorTotal}`);
        }
        
        setCampanhas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Estados para formulário de criação de projeto
  const [novoProjeto, setNovoProjeto] = useState({
    title: "",
    description: "",
    location: "",
    cause: "Educação", // Valor padrão para facilitar
    startDate: "",
    endDate: "",
    maxVolunteers: 1
  })

  // Estados para formulário de criação de campanha
  const [novaCampanha, setNovaCampanha] = useState({
    title: "",
    description: "",
    goalAmount: 1000,
    startDate: "",
    endDate: "",
    category: "Educação"
  })

  // Função para resetar o formulário
  const resetForm = () => {
    setNovoProjeto({
      title: "",
      description: "",
      location: "",
      cause: "Educação",
      startDate: "",
      endDate: "",
      maxVolunteers: 1
    })
  }

  // Função para resetar o formulário de campanha
  const resetCampaignForm = () => {
    setNovaCampanha({
      title: "",
      description: "",
      goalAmount: 1000,
      startDate: "",
      endDate: "",
      category: "Educação"
    })
  }

  const formatarMoeda = (valor: number | string | undefined | null) => {
    console.log(`🎯 formatarMoeda recebeu: ${valor} (tipo: ${typeof valor})`);
    
    if (valor === undefined || valor === null || valor === '') {
      console.log('🎯 Valor vazio, retornando R$ 0,00');
      return 'R$ 0,00';
    }
    
    let numericValue = 0;
    if (typeof valor === 'string') {
      numericValue = parseFloat(valor) || 0;
    } else if (typeof valor === 'number') {
      numericValue = valor;
    }
    
    if (isNaN(numericValue)) {
      console.log('🎯 Valor é NaN, retornando R$ 0,00');
      return 'R$ 0,00';
    }
    
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
    
    console.log(`🎯 Valor formatado: ${formatted}`);
    return formatted;
  }

  const formatarData = (data: string | undefined) => {
    if (!data) return '-';
    try {
      return new Date(data).toLocaleDateString("pt-BR")
    } catch {
      return '-';
    }
  }

  // Função para buscar projetos da ONG
  const fetchProjetosOng = async () => {
    try {
      setIsLoadingProjetos(true)
      setErrorProjetos("")
      
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setErrorProjetos("Token de autenticação não encontrado")
        return
      }

      const response = await apiService.getProjects(token)
      
      if (response.error) {
        setErrorProjetos(response.error)
        return
      }

      if (response.data) {
        console.log('📊 Dados brutos da API:', response.data)
        
        // Processar os dados da API para o novo formato
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
            })) : []
          }))
        }
        
        console.log('✅ Dados processados:', projectsData)
        
        // Filtrar apenas projetos da ONG logada
        const userData = localStorage.getItem('auth_user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            console.log('👤 Usuário logado:', user)
            
            // Filtrar projetos da ONG logada
            const projetosOng = projectsData.filter((projeto: any) => {
              console.log(`🔍 Verificando projeto ${projeto.id}: ngoId=${projeto.ngoId}, user.id=${user.id}, userType=${user.userType}`)
              return projeto.ngoId === user.id || user.userType === 'ngo'
            })
            
            console.log('🏢 Projetos da ONG:', projetosOng)
            setProjetosDinamicos(projetosOng)
          } catch (error) {
            console.error('Erro ao filtrar projetos da ONG:', error)
            setProjetosDinamicos(projectsData)
          }
        } else {
          setProjetosDinamicos(projectsData)
        }
      }
    } catch (err) {
      setErrorProjetos("Erro ao carregar projetos. Tente novamente.")
      console.error("Erro ao buscar projetos:", err)
    } finally {
      setIsLoadingProjetos(false)
    }
  }

  // Função para criar novo projeto
  const handleCreateProject = async () => {
    try {
      setCreatingProject(true)
      setErrorProjetos("")

      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Token de autenticação não encontrado')
        return
      }

      // Validar campos obrigatórios
      if (!novoProjeto.title?.trim()) {
        alert('Título do projeto é obrigatório')
        return
      }
      if (!novoProjeto.description?.trim()) {
        alert('Descrição do projeto é obrigatória')
        return
      }
      if (!novoProjeto.location?.trim()) {
        alert('Localização do projeto é obrigatória')
        return
      }
      if (!novoProjeto.cause?.trim()) {
        alert('Causa do projeto é obrigatória')
        return
      }
      if (!novoProjeto.startDate) {
        alert('Data de início é obrigatória')
        return
      }
      if (!novoProjeto.endDate) {
        alert('Data de fim é obrigatória')
        return
      }
      
      // Validar se a data de fim é posterior à data de início
      if (new Date(novoProjeto.endDate) <= new Date(novoProjeto.startDate)) {
        alert('A data de fim deve ser posterior à data de início')
        return
      }
      
      if (!novoProjeto.maxVolunteers || novoProjeto.maxVolunteers < 1) {
        alert('Número máximo de voluntários deve ser pelo menos 1')
        return
      }

      const response = await apiService.createProject(novoProjeto, token)
      
      if (response.error) {
        alert(`Erro ao criar projeto: ${response.error}`)
        return
      }

      // Projeto criado com sucesso
      alert('Projeto criado com sucesso!')
      
      // Limpar formulário
      resetForm()
      
      // Fechar modal e recarregar projetos
      setShowCreateProject(false)
      fetchProjetosOng()
      
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      alert('Erro ao criar projeto. Tente novamente.')
    } finally {
      setCreatingProject(false)
    }
  }

  // Função para criar nova campanha
  const handleCreateCampaign = async () => {
    try {
      setCreatingCampaign(true)

      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert('Token de autenticação não encontrado')
        return
      }

      // Validar campos obrigatórios
      if (!novaCampanha.title?.trim()) {
        alert('Título da campanha é obrigatório')
        return
      }
      if (!novaCampanha.description?.trim()) {
        alert('Descrição da campanha é obrigatória')
        return
      }
      if (!novaCampanha.goalAmount || novaCampanha.goalAmount <= 0) {
        alert('Meta de arrecadação deve ser maior que zero')
        return
      }
      if (!novaCampanha.startDate) {
        alert('Data de início é obrigatória')
        return
      }
      if (!novaCampanha.endDate) {
        alert('Data de fim é obrigatória')
        return
      }
      
      // Validar se a data de fim é posterior à data de início
      if (new Date(novaCampanha.endDate) <= new Date(novaCampanha.startDate)) {
        alert('A data de fim deve ser posterior à data de início')
        return
      }

      const response = await fetch('http://localhost:3333/api/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaCampanha)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Campanha criada com sucesso:', data)
        
        // Campanha criada com sucesso
        alert('Campanha criada com sucesso!')
        
        // Limpar formulário
        resetCampaignForm()
        
        // Fechar modal e recarregar campanhas
        setShowCreateCampaign(false)
        fetchCampanhas()
      } else {
        const errorData = await response.json()
        alert(`Erro ao criar campanha: ${errorData.message || 'Erro desconhecido'}`)
      }
      
    } catch (error) {
      console.error("Erro ao criar campanha:", error)
      alert('Erro ao criar campanha. Tente novamente.')
    } finally {
      setCreatingCampaign(false)
    }
  }

  // useEffect para carregar projetos ao montar a página
  useEffect(() => {
    fetchProjetosOng()
  }, [])

  // useEffect para buscar usuários quando o filtro de busca muda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsuarios(filtroUsuarios);
    }, 500); // Debounce de 500ms para evitar muitas requisições

    return () => clearTimeout(timeoutId);
  }, [filtroUsuarios]);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    // Filtrar apenas por status, pois a busca por nome é feita na API
    let matchStatus = true;
    if (filtroStatusUsuarios !== "Todos") {
      if (filtroStatusUsuarios === "Ativo") {
        matchStatus = usuario.status === "Ativo" || usuario.status === "active" || !usuario.status;
      } else if (filtroStatusUsuarios === "Inativo") {
        matchStatus = usuario.status === "Inativo" || usuario.status === "inactive";
      }
    }
    
    return matchStatus
  })

  // Debug: log dos usuários filtrados
  console.log('👥 Total de usuários (da API):', usuarios.length);
  console.log('👥 Usuários filtrados (por status):', usuariosFiltrados.length);
  console.log('🔍 Filtro atual de busca:', filtroUsuarios, 'Status:', filtroStatusUsuarios);

  const projetosFiltrados = projetos.filter((projeto) => {
    const titulo = projeto.title || projeto.titulo || '';
    const causa = projeto.cause || projeto.categoria || '';
    const localizacao = projeto.location || projeto.cidade || '';
    
    const matchTitulo = titulo.toLowerCase().includes(filtroProjetos.toLowerCase())
    const matchCausa = causa.toLowerCase().includes(filtroProjetos.toLowerCase())
    const matchLocalizacao = localizacao.toLowerCase().includes(filtroProjetos.toLowerCase())
    const matchStatus = filtroStatusProjetos === "Todos" || projeto.status === filtroStatusProjetos
    
    const matchBusca = matchTitulo || matchCausa || matchLocalizacao
    return matchBusca && matchStatus
  })

  // Debug: log dos projetos filtrados
  console.log('📋 Total de projetos:', projetos.length);
  console.log('📋 Projetos filtrados:', projetosFiltrados.length);
  console.log('🔍 Filtro atual de projetos:', filtroProjetos, 'Status:', filtroStatusProjetos);

  const campanhasFiltradas = campanhas.filter((campanha) => {
    const titulo = campanha.title || '';
    const matchTitulo = titulo.toLowerCase().includes(filtroCampanhas.toLowerCase())
    const matchStatus = filtroStatusCampanhas === "Todos" || campanha.status === filtroStatusCampanhas
    const matchCategoria = filtroCategoriaCampanhas === "Todas" || campanha.category === filtroCategoriaCampanhas
    return matchTitulo && matchStatus && matchCategoria
  })

  // Extrair categorias únicas das campanhas
  const categoriasCampanhas = useMemo(() => {
    const categorias = campanhas
      .map(campanha => campanha.category)
      .filter((categoria, index, arr) => categoria && arr.indexOf(categoria) === index)
      .sort()
    return categorias
  }, [campanhas])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-playfair font-bold text-3xl md:text-4xl text-foreground">Painel Administrativo</h1>
              <p className="text-lg text-muted-foreground">Gerencie usuários, projetos e campanhas da plataforma</p>
            </div>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      estatisticasGerais.totalUsuarios.toLocaleString()
                    )}
                  </p>
                  <p className="text-xs text-green-600">
                    {loadingStats ? '...' : `${estatisticasGerais.usuariosAtivos} ativos`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Projetos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      estatisticasGerais.totalProjetos
                    )}
                  </p>
                  <p className="text-xs text-green-600">
                    {loadingStats ? '...' : `${estatisticasGerais.projetosAtivos} ativos`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Valor Arrecadado</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      formatarMoeda(estatisticasGerais.valorArrecadado)
                    )}
                  </p>
                  <p className="text-xs text-green-600">
                    {loadingStats ? '...' : `${estatisticasGerais.campanhasAtivas} campanhas ativas`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Horas Voluntárias</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      `${estatisticasGerais.horasVoluntariado.toLocaleString()}h`
                    )}
                  </p>
                  <p className="text-xs text-green-600">Este mês: +1.2k horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Gerenciamento */}
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          </TabsList>

          {/* Tab Usuários */}
          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gerenciar Usuários
                    </CardTitle>
                    <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={filtroUsuarios}
                        onChange={(e) => setFiltroUsuarios(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filtroStatusUsuarios} onValueChange={setFiltroStatusUsuarios}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os Status</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela de Usuários */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Data de Ingresso</TableHead>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingUsers ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted animate-pulse rounded w-32" />
                                <div className="h-3 bg-muted animate-pulse rounded w-24" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-20" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-20" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-3 bg-muted animate-pulse rounded w-16" />
                                <div className="h-3 bg-muted animate-pulse rounded w-20" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 bg-muted animate-pulse rounded w-16" />
                            </TableCell>
                            <TableCell>
                              <div className="h-8 bg-muted animate-pulse rounded w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : usuariosFiltrados.length > 0 ? (
                        usuariosFiltrados.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{usuario.nome || usuario.name || 'Nome não disponível'}</div>
                              <div className="text-sm text-muted-foreground">{usuario.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {usuario.cidade || usuario.city || 'N/A'}, {usuario.estado || usuario.state || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{formatarData(usuario.dataIngresso || usuario.createdAt)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{usuario.projetos || 0} projetos</div>
                              <div className="text-muted-foreground">
                                {usuario.horas || 0}h • {usuario.doacoes || 0} doações
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={(usuario.status === "Ativo" || usuario.status === "active" || !usuario.status) ? "default" : "secondary"}>
                              {usuario.status || "Ativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Estado vazio
                      <TableRow>
                        <TableCell colSpan={6} className="text-center p-8">
                          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Projetos */}
          <TabsContent value="projetos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Gerenciar Projetos
                    </CardTitle>
                    <CardDescription>Aprove, edite e monitore todos os projetos</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateProject(true)}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Novo Projeto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar projetos..."
                        value={filtroProjetos}
                        onChange={(e) => setFiltroProjetos(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filtroStatusProjetos} onValueChange={setFiltroStatusProjetos}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os Status</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela de Projetos */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projeto</TableHead>
                        <TableHead>Organização</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Voluntários</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingProjects ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted animate-pulse rounded w-32" />
                                <div className="h-3 bg-muted animate-pulse rounded w-24" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-20" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-20" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-4 bg-muted animate-pulse rounded w-16" />
                                <div className="h-3 bg-muted animate-pulse rounded w-12" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-3 bg-muted animate-pulse rounded w-20" />
                                <div className="h-3 bg-muted animate-pulse rounded w-16" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 bg-muted animate-pulse rounded w-16" />
                            </TableCell>
                            <TableCell>
                              <div className="h-8 bg-muted animate-pulse rounded w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : projetosFiltrados.length > 0 ? (
                        projetosFiltrados.map((projeto) => (
                        <TableRow key={projeto.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{projeto.title || projeto.titulo}</div>
                              <Badge variant="outline" className="mt-1">
                                {projeto.cause || projeto.categoria || projeto.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {projeto.ngo?.organizationName || projeto.organization || projeto.organizacao || 'Organização'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {projeto.location || projeto.cidade || projeto.city}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {(projeto.enrollments?.length || projeto.users?.length || projeto.voluntarios || 0)}/{projeto.maxVolunteers || projeto.maxVoluntarios}
                              {((projeto.enrollments && projeto.enrollments.length > 0) || (projeto.users && projeto.users.length > 0)) && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {(projeto.enrollments || projeto.users || []).slice(0, 3).map((item: any, index: number) => 
                                    (item.volunteer?.name || item.name || `Voluntário ${index + 1}`)
                                  ).join(', ')}
                                  {(projeto.enrollments?.length || projeto.users?.length || 0) > 3 && ` +${(projeto.enrollments?.length || projeto.users?.length || 0) - 3} mais`}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatarData(projeto.startDate || projeto.dataInicio)}</div>
                              <div className="text-muted-foreground">até {formatarData(projeto.endDate || projeto.dataFim)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                projeto.status === "open"
                                  ? "default"
                                  : projeto.status === "closed"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {projeto.status === "open" ? "Aberto" : 
                               projeto.status === "closed" ? "Fechado" : 
                               projeto.status === "in_progress" ? "Em Andamento" : 
                               projeto.status === "completed" ? "Concluído" : projeto.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Estado vazio
                      <TableRow>
                        <TableCell colSpan={7} className="text-center p-8">
                          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Nenhum projeto encontrado</p>
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Campanhas */}
          <TabsContent value="campanhas" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Gerenciar Campanhas
                    </CardTitle>
                    <CardDescription>Monitore e gerencie campanhas de doação</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateCampaign(true)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Nova Campanha
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 max-w-xs">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar campanhas..."
                        value={filtroCampanhas}
                        onChange={(e) => setFiltroCampanhas(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filtroCategoriaCampanhas} onValueChange={setFiltroCategoriaCampanhas}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todas">Todas as Categorias</SelectItem>
                      {categoriasCampanhas.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatusCampanhas} onValueChange={setFiltroStatusCampanhas}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="closed">Fechada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela de Campanhas */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Organização</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead>Doações</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingCampaigns ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted animate-pulse rounded w-32" />
                                <div className="h-3 bg-muted animate-pulse rounded w-24" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-20" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                                <div className="h-3 bg-muted animate-pulse rounded w-20" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-4 bg-muted animate-pulse rounded w-16" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-3 bg-muted animate-pulse rounded w-20" />
                                <div className="h-3 bg-muted animate-pulse rounded w-16" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 bg-muted animate-pulse rounded w-16" />
                            </TableCell>
                            <TableCell>
                              <div className="h-8 bg-muted animate-pulse rounded w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : campanhasFiltradas.length > 0 ? (
                        campanhasFiltradas.map((campanha) => (
                        <TableRow key={campanha.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{campanha.title}</div>
                              <Badge variant="outline" className="mt-1">
                                {campanha.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{campanha.ngo?.organizationName || 'ONG'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{formatarMoeda(campanha.currentAmount)}</div>
                              <div className="text-muted-foreground">
                                de {formatarMoeda(campanha.goalAmount)} (
                                {Math.round(((campanha.currentAmount || 0) / (campanha.goalAmount || 1)) * 100)}%)
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ 
                                    width: `${Math.min(Math.round(((campanha.currentAmount || 0) / (campanha.goalAmount || 1)) * 100), 100)}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{campanha.numberOfDonations}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{formatarData(campanha.startDate)}</span>
                              </div>
                              <div className="text-muted-foreground">
                                até {formatarData(campanha.endDate)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campanha.status === "active"
                                  ? "default"
                                  : campanha.status === "pending"
                                    ? "secondary"
                                    : campanha.status === "completed"
                                      ? "outline"
                                      : "secondary"
                              }
                            >
                              {campanha.status === "active" ? "Ativa" : 
                               campanha.status === "pending" ? "Pendente" : 
                               campanha.status === "completed" ? "Concluída" : 
                               campanha.status === "closed" ? "Fechada" : campanha.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {campanha.status === "pending" && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Estado vazio
                      <TableRow>
                        <TableCell colSpan={7} className="text-center p-8">
                          <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground">Nenhuma campanha encontrada</p>
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Criação de Campanha */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ zIndex: 9999 }}>
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'white' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Criar Nova Campanha</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">Progresso:</div>
                  <div className="flex gap-1">
                    {[
                      novaCampanha.title?.trim(),
                      novaCampanha.description?.trim(),
                      novaCampanha.goalAmount > 0,
                      novaCampanha.category?.trim(),
                      novaCampanha.startDate,
                      novaCampanha.endDate
                    ].filter(Boolean).length}/6 campos preenchidos
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCampaign(false)}
                className="h-8 w-8 p-0"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título da Campanha
                  {novaCampanha.title?.trim() && <span className="text-green-600 ml-1">✓</span>}
                </label>
                <Input
                  placeholder="Ex: Ajude crianças carentes"
                  value={novaCampanha.title}
                  onChange={(e) => setNovaCampanha(prev => ({ ...prev, title: e.target.value }))}
                  className={novaCampanha.title?.trim() ? 'border-green-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                  {novaCampanha.description?.trim() && <span className="text-green-600 ml-1">✓</span>}
                </label>
                <textarea
                  className={`w-full p-3 border rounded-md resize-none h-24 ${
                    novaCampanha.description?.trim() ? 'border-green-500' : 'border-input'
                  }`}
                  placeholder="Descreva a campanha em detalhes..."
                  value={novaCampanha.description}
                  onChange={(e) => setNovaCampanha(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meta de Arrecadação (R$)
                    {novaCampanha.goalAmount && novaCampanha.goalAmount > 0 && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={novaCampanha.goalAmount}
                    onChange={(e) => setNovaCampanha(prev => ({ ...prev, goalAmount: parseFloat(e.target.value) || 0 }))}
                    className={novaCampanha.goalAmount && novaCampanha.goalAmount > 0 ? 'border-green-500' : ''}
                    placeholder="Ex: 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Categoria
                    {novaCampanha.category?.trim() && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Select value={novaCampanha.category} onValueChange={(value) => setNovaCampanha(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className={novaCampanha.category?.trim() ? 'border-green-500' : ''}>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Meio Ambiente">Meio Ambiente</SelectItem>
                      <SelectItem value="Assistência Social">Assistência Social</SelectItem>
                      <SelectItem value="Cultura">Cultura</SelectItem>
                      <SelectItem value="Esporte">Esporte</SelectItem>
                      <SelectItem value="Direitos Humanos">Direitos Humanos</SelectItem>
                      <SelectItem value="Animais">Animais</SelectItem>
                      <SelectItem value="Combate à Fome">Combate à Fome</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Religião">Religião</SelectItem>
                      <SelectItem value="Emergência">Emergência</SelectItem>
                      <SelectItem value="Idosos">Idosos</SelectItem>
                      <SelectItem value="Crianças">Crianças</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Início
                    {novaCampanha.startDate && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="date"
                    value={novaCampanha.startDate}
                    onChange={(e) => setNovaCampanha(prev => ({ ...prev, startDate: e.target.value }))}
                    className={novaCampanha.startDate ? 'border-green-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Fim
                    {novaCampanha.endDate && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="date"
                    value={novaCampanha.endDate}
                    onChange={(e) => setNovaCampanha(prev => ({ ...prev, endDate: e.target.value }))}
                    className={novaCampanha.endDate ? 'border-green-500' : ''}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={creatingCampaign}
                  className="flex-1"
                >
                  {creatingCampaign ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Campanha'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetCampaignForm}
                  disabled={creatingCampaign}
                >
                  Limpar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCampaign(false)}
                  disabled={creatingCampaign}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Projeto */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ zIndex: 9999 }}>
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'white' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Criar Novo Projeto</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-sm text-muted-foreground">Progresso:</div>
                  <div className="flex gap-1">
                    {[
                      novoProjeto.title?.trim(),
                      novoProjeto.description?.trim(),
                      novoProjeto.location?.trim(),
                      novoProjeto.cause?.trim(),
                      novoProjeto.startDate,
                      novoProjeto.endDate,
                      novoProjeto.maxVolunteers > 0
                    ].filter(Boolean).length}/7 campos preenchidos
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateProject(false)}
                className="h-8 w-8 p-0"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título do Projeto
                  {novoProjeto.title?.trim() && <span className="text-green-600 ml-1">✓</span>}
                </label>
                <Input
                  placeholder="Ex: Educação para Todos"
                  value={novoProjeto.title}
                  onChange={(e) => setNovoProjeto(prev => ({ ...prev, title: e.target.value }))}
                  className={novoProjeto.title?.trim() ? 'border-green-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                  {novoProjeto.description?.trim() && <span className="text-green-600 ml-1">✓</span>}
                </label>
                <textarea
                  className={`w-full p-3 border rounded-md resize-none h-24 ${
                    novoProjeto.description?.trim() ? 'border-green-500' : 'border-input'
                  }`}
                  placeholder="Descreva o projeto em detalhes..."
                  value={novoProjeto.description}
                  onChange={(e) => setNovoProjeto(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Localização
                    {novoProjeto.location?.trim() && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    placeholder="Ex: São Paulo, SP"
                    value={novoProjeto.location}
                    onChange={(e) => setNovoProjeto(prev => ({ ...prev, location: e.target.value }))}
                    className={novoProjeto.location?.trim() ? 'border-green-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Causa
                    {novoProjeto.cause?.trim() && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Select value={novoProjeto.cause} onValueChange={(value) => setNovoProjeto(prev => ({ ...prev, cause: value }))}>
                    <SelectTrigger className={novoProjeto.cause?.trim() ? 'border-green-500' : ''}>
                      <SelectValue placeholder="Selecione uma causa" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Meio ambiente">Meio ambiente</SelectItem>
                      <SelectItem value="Assistência Social">Assistência Social</SelectItem>
                      <SelectItem value="Cultura">Cultura</SelectItem>
                      <SelectItem value="Esporte">Esporte</SelectItem>
                      <SelectItem value="Direitos Humanos">Direitos Humanos</SelectItem>
                      <SelectItem value="Animais">Animais</SelectItem>
                      <SelectItem value="Combate à Fome">Combate à Fome</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Religião">Religião</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Início
                    {novoProjeto.startDate && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="date"
                    value={novoProjeto.startDate}
                    onChange={(e) => setNovoProjeto(prev => ({ ...prev, startDate: e.target.value }))}
                    className={novoProjeto.startDate ? 'border-green-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Fim
                    {novoProjeto.endDate && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="date"
                    value={novoProjeto.endDate}
                    onChange={(e) => setNovoProjeto(prev => ({ ...prev, endDate: e.target.value }))}
                    className={novoProjeto.endDate ? 'border-green-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Máx. Voluntários
                    {novoProjeto.maxVolunteers && novoProjeto.maxVolunteers > 0 && <span className="text-green-600 ml-1">✓</span>}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={novoProjeto.maxVolunteers}
                    onChange={(e) => setNovoProjeto(prev => ({ ...prev, maxVolunteers: parseInt(e.target.value) || 1 }))}
                    className={novoProjeto.maxVolunteers && novoProjeto.maxVolunteers > 0 ? 'border-green-500' : ''}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateProject}
                  disabled={creatingProject}
                  className="flex-1"
                >
                  {creatingProject ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Projeto'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={creatingProject}
                >
                  Limpar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateProject(false)}
                  disabled={creatingProject}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
