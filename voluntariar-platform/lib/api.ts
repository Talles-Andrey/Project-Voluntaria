const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  userType?: 'volunteer' | 'ngo';
  skills?: string[];
  experience?: string;
  preferredCauses?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType: string;
  };
}

export interface NgoAuthResponse {
  message: string;
  accessToken: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Para respostas vazias (como 204 No Content), verificar se é GET
      if (response.status === 204) {
        // Se for GET, 204 significa sem conteúdo (erro)
        if (options.method === 'GET') {
          return { error: "Nenhum dado encontrado" }
        }
        // Para outros métodos (POST, PUT, DELETE), 204 pode ser sucesso
        return { message: "Operação realizada com sucesso" }
      }

      // Tentar fazer parse do JSON apenas se houver conteúdo
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (jsonError) {
          return {
            error: "Resposta inválida do servidor"
          }
        }
      } else {
        data = null
      }

        if (!response.ok) {
        return {
          error: data?.message || `Erro ${response.status}: ${response.statusText}`,
        };
      }
      
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  // Auth endpoints (necessários para rotas autenticadas)
  async register(userData: CreateUserRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async loginNgo(credentials: LoginRequest): Promise<ApiResponse<NgoAuthResponse>> {
    return this.request<NgoAuthResponse>('/ngos/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Endpoints para exibição (alguns podem precisar de autenticação)
  async getUsers(token?: string): Promise<ApiResponse> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request('/users', {
      method: 'GET',
      headers,
    });
  }

  async getProjects(token?: string): Promise<ApiResponse> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request('/projects', {
      method: 'GET',
      headers,
    });
  }

  async getProjectById(id: string, token?: string): Promise<ApiResponse> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request(`/projects/${id}`, {
      method: 'GET',
      headers,
    });
  }

  async getNgoById(id: string, token?: string): Promise<ApiResponse> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request(`/ngos/${id}`, {
      method: 'GET',
      headers,
    });
  }



  async getCampaigns(filters?: {
    title?: string;
    status?: string;
    category?: string;
  }, token?: string): Promise<ApiResponse> {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // Construir query string com filtros
    const params = new URLSearchParams();
    if (filters?.title) params.append('title', filters.title);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/campaigns?${queryString}` : '/campaigns';
    
    return this.request(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async getCampaignById(id: string): Promise<ApiResponse> {
    return this.request(`/campaigns/${id}`, {
      method: 'GET',
    });
  }

  async donateToCampaign(campaignId: string, donationData: {
    amount: number;
    donorName?: string;
    donorEmail?: string;
    message?: string;
    anonymous: boolean;
  }): Promise<ApiResponse> {
    try {
      const response = await this.request(`/campaigns/${campaignId}/donate`, {
        method: 'POST',
        body: JSON.stringify(donationData),
      });
      
      return response;
    } catch (error) {
      console.error("Erro na requisição de doação:", error);
      return {
        error: "Erro ao conectar com o servidor. Tente novamente.",
      };
    }
  }

  // User endpoints (autenticados)
  async getProfile(token: string): Promise<ApiResponse> {
    return this.request('/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async joinProject(projectId: string, status: string = 'pending', notes?: string, token?: string): Promise<ApiResponse> {
    if (!token) {
      return { error: 'Token de autenticação é obrigatório para participar de projetos' };
    }

    // Validar status permitidos
    if (status !== 'pending' && status !== 'approved' && status !== 'rejected') {
      return { error: 'Status inválido. Use: pending, approved ou rejected' };
    }

    const headers: any = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const body = {
      id: projectId,
      status: status,
      notes: notes || 'Interesse em participar do projeto'
    };
    
    try {
      const url = `${API_BASE_URL}/projects/join`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      // Se o status for 201 (Created), consideramos sucesso mesmo sem JSON
      if (response.status === 201) {
        return { data: { success: true, message: 'Inscrição realizada com sucesso' } };
      }

      // Para outros status, tentamos ler o JSON
      if (response.ok) {
        try {
          const data = await response.json();
          return { data };
        } catch (jsonError) {
          // Se não conseguir ler JSON mas o status for OK, consideramos sucesso
          return { data: { success: true, message: 'Inscrição realizada com sucesso' } };
        }
      }

      // Para erros, tentamos ler a mensagem de erro
      try {
        const errorData = await response.json();
        return { error: errorData.message || `Erro ${response.status}: ${response.statusText}` };
      } catch (jsonError) {
        return { error: `Erro ${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erro de conexão' };
    }
  }

  async createProject(projectData: {
    title: string;
    description: string;
    location: string;
    cause: string;
    startDate: string;
    endDate: string;
    maxVolunteers: number;
  }, token: string): Promise<ApiResponse> {
    if (!token) {
      return { error: 'Token de autenticação é obrigatório para criar projetos' };
    }

    const headers: any = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    return this.request('/projects', {
      method: 'POST',
      headers,
      body: JSON.stringify(projectData),
    });
  }
}

export const apiService = new ApiService();
