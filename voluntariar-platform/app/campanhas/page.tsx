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
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Search, Filter, Heart, TrendingUp, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"

// Interface para as campanhas da API
interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: string; // Vem como string do backend
  currentAmount: string; // Vem como string do backend
  startDate: string;
  endDate: string;
  status: string;
  category: string;
  ngoId: string;
  createdAt: string;
  numberOfDonations?: number; // Número de pessoas que doaram
}

// Interface para as ONGs
interface Ngo {
  id: string;
  organizationName: string;
  description: string;
  city: string;
  state: string;
  causes: string[];
  areas: string[];
}

const categorias = [
  "campaign",
  "opportunity"
]

export default function CampanhasPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [campanhas, setCampanhas] = useState<Campaign[]>([])
  const [ngos, setNgos] = useState<{ [key: string]: Ngo }>({})

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filtros, setFiltros] = useState({
    busca: "",
    categoria: "Todas as categorias",
    status: "Todas",
  })

  // Buscar campanhas da API
  useEffect(() => {
    fetchCampanhas()
  }, [])

  const fetchCampanhas = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      const response = await apiService.getCampaigns()
      
      if (response.error) {
        setError(response.error)
        return
      }

      if (response.data) {
        setCampanhas(response.data)
        
        // Buscar informações das ONGs para cada campanha
        await fetchNgosInfo(response.data)
      }
    } catch (err) {
      setError("Erro ao carregar campanhas. Tente novamente.")
      console.error("Erro ao buscar campanhas:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNgosInfo = async (campanhasData: Campaign[]) => {
    try {
      const ngoIds = [...new Set(campanhasData.map(c => c.ngoId))]
      const ngoData: { [key: string]: Ngo } = {}
      
      for (const ngoId of ngoIds) {
        try {
          const ngoResponse = await apiService.getNgoById(ngoId)
          if (ngoResponse.data) {
            ngoData[ngoId] = ngoResponse.data
          }
        } catch (error) {
          console.error(`Erro ao buscar ONG ${ngoId}:`, error)
        }
      }
      
      setNgos(ngoData)
    } catch (error) {
      console.error("Erro ao buscar informações das ONGs:", error)
    }
  }



  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const campanhasFiltradas = campanhas.filter((campanha) => {
    const matchBusca =
      campanha.title.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      campanha.description.toLowerCase().includes(filtros.busca.toLowerCase())
    const matchCategoria = filtros.categoria === "Todas as categorias" || campanha.category === filtros.categoria
    const matchStatus = filtros.status === "Todas" || campanha.status === filtros.status

    return matchBusca && matchCategoria && matchStatus
  })

  const formatarMoeda = (valor: number) => {
    // Tratar valores undefined, null ou NaN
    if (valor === undefined || valor === null || isNaN(valor)) {
      return "R$ 0,00"
    }
    
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  const calcularProgresso = (arrecadado: number, meta: number) => {
    return Math.min((arrecadado / meta) * 100, 100)
  }

  const calcularDiasRestantes = (endDate: string) => {
    const hoje = new Date()
    const dataFim = new Date(endDate)
    const diffTime = dataFim.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Calcular estatísticas
  const totalArrecadado = campanhas.reduce((total, campanha) => total + parseFloat(campanha.currentAmount), 0)
  const campanhasAtivas = campanhas.filter(c => c.status === 'active').length
  const campanhasConcluidas = campanhas.filter(c => c.status === 'completed').length
  
  // Calcular total de doadores usando o campo numberOfDonations das campanhas
  const totalDoadores = campanhas.reduce((total, campanha) => total + (campanha.numberOfDonations || 0), 0)

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Carregando campanhas...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Erro ao carregar campanhas</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchCampanhas} variant="outline">
              Tentar Novamente
            </Button>
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
          <h1 className="font-playfair font-bold text-3xl md:text-4xl text-foreground mb-4">Campanhas de Doação</h1>
          <p className="text-lg text-muted-foreground">
            Contribua com causas importantes e ajude a transformar vidas na sua comunidade
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Arrecadado</p>
                  <p className="text-2xl font-bold text-foreground">{formatarMoeda(totalArrecadado)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{campanhasAtivas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total de Doadores</p>
                  <p className="text-2xl font-bold text-foreground">{totalDoadores}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-bold text-foreground">{campanhasConcluidas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>Encontre campanhas específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={filtros.categoria} onValueChange={(value) => handleFiltroChange("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas as categorias">Todas as categorias</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
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
                    <SelectItem value="Todas">Todas</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                {campanhasFiltradas.length} campanha{campanhasFiltradas.length !== 1 ? "s" : ""} encontrada
                {campanhasFiltradas.length !== 1 ? "s" : ""}
              </p>
              <Button
                variant="outline"
                onClick={() => setFiltros({ busca: "", categoria: "Todas as categorias", status: "Todas" })}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanhasFiltradas.map((campanha) => {
            const diasRestantes = calcularDiasRestantes(campanha.endDate)
            const isUrgente = diasRestantes <= 7 && campanha.status === 'active'
            
            return (
              <Card key={campanha.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                                     <div className="flex justify-between items-start mb-2">
                     <Badge variant="secondary">{campanha.category}</Badge>
                    <div className="flex gap-2">
                      {isUrgente && (
                        <Badge variant="destructive" className="text-xs">
                          Urgente
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          campanha.status === "active"
                            ? "text-green-600 border-green-600"
                            : campanha.status === "completed"
                            ? "text-blue-600 border-blue-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        {campanha.status === 'active' ? 'Ativa' : 
                         campanha.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{campanha.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Criada em {new Date(campanha.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{campanha.description}</p>

                  <div className="space-y-4">
                    {/* Progresso */}
                    <div>
                                           <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium">Progresso</span>
                       <span className="text-sm text-muted-foreground">
                         {Math.round(calcularProgresso(parseFloat(campanha.currentAmount), parseFloat(campanha.goalAmount)))}%
                       </span>
                     </div>
                     <Progress value={calcularProgresso(parseFloat(campanha.currentAmount), parseFloat(campanha.goalAmount))} className="h-2" />
                    </div>

                    {/* Valores */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <p className="text-muted-foreground">Arrecadado</p>
                         <p className="font-semibold text-primary">{formatarMoeda(parseFloat(campanha.currentAmount))}</p>
                       </div>
                       <div>
                         <p className="text-muted-foreground">Meta</p>
                         <p className="font-semibold">{formatarMoeda(parseFloat(campanha.goalAmount))}</p>
                       </div>
                     </div>

                    {/* Info adicional */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                         <Heart className="h-4 w-4" />
                         <span>{campanha.numberOfDonations || 0} doadores</span>
                       </div>
                      {campanha.status === "active" && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{diasRestantes} dias restantes</span>
                        </div>
                      )}
                    </div>

                                         <div className="text-sm text-muted-foreground">
                       <strong>Organização:</strong> {ngos[campanha.ngoId]?.organizationName || 'ONG não encontrada'}
                     </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link href={`/campanhas/${campanha.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Detalhes
                      </Button>
                    </Link>
                    {campanha.status === "active" && (
                      <Link href={`/campanhas/${campanha.id}`} className="flex-1">
                        <Button className="w-full">Doar Agora</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {campanhasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhuma campanha encontrada</p>
              <p>Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
