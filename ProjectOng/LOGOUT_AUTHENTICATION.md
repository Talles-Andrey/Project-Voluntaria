# Sistema de Autenticação para Logout

## 🎯 **Problema Resolvido**

O endpoint de logout precisa estar autenticado, mas deve funcionar para **dois tipos de usuário**:
- ✅ **Voluntários** (`userType: 'volunteer'`)
- ✅ **ONGs** (`userType: 'ngo'`)

## 🔧 **Solução Implementada**

### **1. LogoutAuthGuard Personalizado**
```typescript
@Injectable()
export class LogoutAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Valida o token JWT
    // Aceita apenas 'volunteer' ou 'ngo'
    // Rejeita outros tipos de usuário
  }
}
```

### **2. Características do Guard**
- ✅ **Valida token JWT** (mesmo que outros guards)
- ✅ **Aceita ambos os tipos** (volunteer e ngo)
- ✅ **Rejeita tipos inválidos** com erro 403
- ✅ **Adiciona payload ao request** para uso posterior

## 🚀 **Como Funciona**

### **Fluxo de Autenticação:**
1. **Cliente envia** token no header Authorization
2. **LogoutAuthGuard valida** o token JWT
3. **Verifica userType** (deve ser 'volunteer' ou 'ngo')
4. **Se válido**: permite acesso ao endpoint
5. **Se inválido**: retorna erro 401/403

### **Códigos de Status:**
- **200**: Logout realizado com sucesso
- **400**: Token não fornecido
- **401**: Token inválido/expirado
- **403**: Tipo de usuário inválido

## 📡 **Exemplos de Uso**

### **Logout de Voluntário:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Token deve conter:**
```json
{
  "sub": "user-id",
  "email": "volunteer@example.com",
  "userType": "volunteer"
}
```

### **Logout de ONG:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Token deve conter:**
```json
{
  "sub": "ngo-id",
  "email": "ong@example.com",
  "userType": "ngo"
}
```

## 🛡️ **Segurança**

### **O que é validado:**
- ✅ **Formato do token** (Bearer + token)
- ✅ **Assinatura JWT** (não foi adulterado)
- ✅ **Expiração** (não expirou)
- ✅ **Tipo de usuário** (volunteer ou ngo)

### **O que é rejeitado:**
- ❌ **Tokens sem Bearer**
- ❌ **Tokens expirados**
- ❌ **Tokens inválidos**
- ❌ **Tipos de usuário desconhecidos**

## 🔍 **Swagger Documentation**

No Swagger, o endpoint agora mostra:
- ✅ **🔒 Autenticação requerida** (ícone de cadeado)
- ✅ **Header Authorization** obrigatório
- ✅ **Tipos de resposta** documentados
- ✅ **Códigos de erro** claros

## 🎉 **Benefícios da Solução**

1. **Segurança**: Endpoint protegido contra acesso não autorizado
2. **Flexibilidade**: Funciona para ambos os tipos de usuário
3. **Clareza**: Erros específicos para cada tipo de problema
4. **Documentação**: Swagger mostra claramente os requisitos
5. **Manutenibilidade**: Guard específico e reutilizável

## 🔄 **Comparação com Outras Abordagens**

### **❌ Abordagem 1: Sem Autenticação**
- Problema: Qualquer um pode fazer logout
- Risco: Ataques de negação de serviço

### **❌ Abordagem 2: Guard Genérico**
- Problema: Aceita qualquer tipo de usuário
- Risco: Tokens inválidos ou de tipos desconhecidos

### **✅ Abordagem 3: Guard Específico (Implementada)**
- Vantagem: Segurança + Flexibilidade
- Vantagem: Validação específica para logout
- Vantagem: Fácil de manter e estender

## 🚀 **Próximos Passos (Opcionais)**

Para produção, considere:
- **Rate Limiting**: Limitar tentativas de logout
- **Logs de Auditoria**: Registrar todos os logouts
- **Métricas**: Monitorar padrões de logout
- **Cache**: Otimizar validação de tokens
