import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Gift, TrendingUp, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2.5K+</div>
              <div className="text-muted-foreground">Voluntários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Projetos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">R$ 1.2M</div>
              <div className="text-muted-foreground">Arrecadado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
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
            <Card>
              <CardHeader>
                <CardTitle>Educação para Todos</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  São Paulo, SP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Projeto de alfabetização para adultos em comunidades carentes. Precisamos de professores voluntários.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    4h/semana
                  </div>
                  <Button size="sm">Participar</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alimentação Solidária</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Rio de Janeiro, RJ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Distribuição de refeições para pessoas em situação de rua. Ajude na preparação e distribuição.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    6h/semana
                  </div>
                  <Button size="sm">Participar</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meio Ambiente</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Belo Horizonte, MG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Plantio de árvores e limpeza de parques urbanos. Contribua para um meio ambiente mais saudável.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    3h/semana
                  </div>
                  <Button size="sm">Participar</Button>
                </div>
              </CardContent>
            </Card>
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
