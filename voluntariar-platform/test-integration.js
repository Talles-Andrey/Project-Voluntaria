// Script de teste para verificar a integração com o backend
// Execute com: node test-integration.js

const API_BASE_URL = 'http://localhost:3333/api';

async function testBackendConnection() {
  console.log('🧪 Testando conexão com o backend...\n');

  try {
    // Teste 1: Verificar se o servidor está rodando
    console.log('1️⃣ Testando se o servidor está rodando...');
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Teste Usuário',
        email: 'teste@exemplo.com',
        password: '123456',
        city: 'São Paulo',
        state: 'SP',
        userType: 'volunteer',
        skills: ['Organização'],
        experience: 'Teste de experiência',
        preferredCauses: ['Educação']
      }),
    });

    if (response.status === 400) {
      console.log('✅ Servidor está rodando! (Erro 400 esperado para email duplicado)');
    } else if (response.status === 201) {
      console.log('✅ Servidor está rodando! Usuário criado com sucesso!');
    } else {
      console.log(`⚠️ Servidor respondeu com status: ${response.status}`);
    }

    // Teste 2: Verificar documentação Swagger
    console.log('\n2️⃣ Testando acesso à documentação Swagger...');
    try {
      const swaggerResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/api`);
      if (swaggerResponse.ok) {
        console.log('✅ Documentação Swagger acessível!');
      } else {
        console.log('⚠️ Documentação Swagger não acessível');
      }
    } catch (error) {
      console.log('❌ Erro ao acessar Swagger:', error.message);
    }

    // Teste 3: Verificar estrutura da resposta
    console.log('\n3️⃣ Testando estrutura da resposta...');
    const responseData = await response.json();
    console.log('📋 Estrutura da resposta:', JSON.stringify(responseData, null, 2));

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   - Verifique se o backend está rodando na porta 3000');
    console.log('   - Verifique se o banco de dados está configurado');
    console.log('   - Verifique se as variáveis de ambiente estão corretas');
  }
}

async function testFrontendConfig() {
  console.log('\n🌐 Testando configuração do frontend...\n');

  try {
    // Verificar se o arquivo .env.local existe
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      console.log('✅ Arquivo .env.local encontrado');
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('NEXT_PUBLIC_API_URL=http://localhost:3000/api')) {
        console.log('✅ URL da API configurada corretamente');
      } else {
        console.log('⚠️ URL da API pode estar incorreta');
      }
    } else {
      console.log('❌ Arquivo .env.local não encontrado');
      console.log('💡 Crie o arquivo com: NEXT_PUBLIC_API_URL=http://localhost:3000/api');
    }

  } catch (error) {
    console.log('❌ Erro ao verificar configuração do frontend:', error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de integração...\n');
  
  await testBackendConnection();
  await testFrontendConfig();
  
  console.log('\n✨ Testes concluídos!');
  console.log('\n📚 Para mais informações, consulte o arquivo INTEGRATION_README.md');
}

runTests().catch(console.error);
