# Solução para Atualização de Campanha

## 🎯 **Problema Identificado**

O campo `currentAmount` da campanha não estava sendo atualizado no banco de dados, mesmo após chamar `save()`.

## 🔍 **Possíveis Causas Investigadas**

### **1. Problema com TypeORM save()**
- O método `save()` pode não estar detectando mudanças
- Pode haver problemas com o mapeamento de tipos

### **2. Problema com tipo decimal**
- Campo `decimal(10,2)` no banco vs `number` no TypeScript
- Conversões automáticas podem estar falhando

### **3. Problema com relacionamentos**
- A entidade pode não estar sendo carregada corretamente
- Dados podem estar sendo sobrescritos

## 🛠️ **Solução Implementada**

### **Raw Query SQL (Mais Confiável)**
```typescript
const updateResult = await this.campaignsRepository.query(
  'UPDATE campaigns SET numberOfDonations = numberOfDonations + 1, currentAmount = currentAmount + $1 WHERE id = $2 RETURNING *',
  [amount, id],
);
```

### **Por que Raw Query?**
- ✅ **Controle total** sobre a operação SQL
- ✅ **Bypass** problemas do TypeORM
- ✅ **Garantia** de que a atualização acontece
- ✅ **Retorna** os dados atualizados

## 🔧 **Como Funciona Agora**

### **1. Logs Detalhados**
```typescript
console.log('=== BEFORE UPDATE ===');
console.log('Campaign ID:', campaign.id);
console.log('Current Amount:', campaign.currentAmount);
console.log('Number of Donations:', campaign.numberOfDonations);
console.log('New Donation Amount:', amount);
```

### **2. Atualização via SQL**
```sql
UPDATE campaigns 
SET numberOfDonations = numberOfDonations + 1, 
    currentAmount = currentAmount + $1 
WHERE id = $2 
RETURNING *;
```

### **3. Verificação do Resultado**
```typescript
if (updateResult && updateResult.length > 0) {
  console.log('Updated Current Amount:', updateResult[0].currentamount);
  console.log('Updated Number of Donations:', updateResult[0].numberofdonations);
}
```

## 📡 **Como Testar**

### **1. Fazer uma Doação**
```bash
curl -X POST http://localhost:3000/api/campaigns/{campaign-id}/donate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "donorName": "Test User",
    "donorEmail": "test@example.com",
    "message": "Test donation",
    "anonymous": false
  }'
```

### **2. Verificar Logs no Console**
```
=== BEFORE UPDATE ===
Campaign ID: uuid-here
Current Amount: 100.00
Number of Donations: 5
New Donation Amount: 50.00

Raw Query Update Result: [{...}]

=== AFTER UPDATE ===
Updated Current Amount: 150.00
Updated Number of Donations: 6

Donation saved successfully
```

### **3. Verificar Banco de Dados**
```sql
SELECT id, title, currentAmount, numberOfDonations, status 
FROM campaigns 
WHERE id = 'campaign-id';
```

## 🚨 **Se Ainda Não Funcionar**

### **Verificar Constraints do Banco**
```sql
-- Verificar se há constraints que impedem a atualização
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'campaigns';

-- Verificar se há triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'campaigns';
```

### **Verificar Permissões**
```sql
-- Verificar se o usuário tem permissão para UPDATE
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'campaigns';
```

### **Verificar Dados da Campanha**
```sql
-- Verificar se a campanha existe e seus valores atuais
SELECT * FROM campaigns WHERE id = 'campaign-id';

-- Verificar se há valores NULL ou inválidos
SELECT id, title, currentAmount, numberOfDonations
FROM campaigns 
WHERE currentAmount IS NULL OR numberOfDonations IS NULL;
```

## 💡 **Alternativas Adicionais**

### **1. QueryBuilder com Raw SQL**
```typescript
await this.campaignsRepository
  .createQueryBuilder()
  .update(Campaign)
  .set({
    numberOfDonations: () => 'numberOfDonations + 1',
    currentAmount: () => `currentAmount + ${amount}`
  })
  .where('id = :id', { id })
  .execute();
```

### **2. Transação Explícita**
```typescript
const queryRunner = this.campaignsRepository.manager.connection.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  await queryRunner.query(
    'UPDATE campaigns SET currentAmount = currentAmount + $1 WHERE id = $2',
    [amount, id]
  );
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();
}
```

## 🎯 **Resultado Esperado**

Após a implementação:
- ✅ **Logs mostram** valores antes e depois da atualização
- ✅ **Raw query executa** com sucesso
- ✅ **Banco de dados** reflete as mudanças
- ✅ **Campanha é atualizada** corretamente
- ✅ **Doação é salva** com sucesso

## 🔍 **Debugging Adicional**

Se ainda houver problemas, adicione mais logs:

```typescript
// Verificar se a campanha foi encontrada
console.log('Campaign found:', campaign);

// Verificar o tipo de dados
console.log('Amount type:', typeof amount);
console.log('CurrentAmount type:', typeof campaign.currentAmount);

// Verificar se há valores undefined/null
console.log('Amount value:', amount);
console.log('CurrentAmount value:', campaign.currentAmount);
```

## 🚀 **Próximos Passos**

1. **Testar** o endpoint com as melhorias implementadas
2. **Verificar logs** para confirmar que as atualizações estão funcionando
3. **Verificar banco** para confirmar que os dados foram salvos
4. **Se ainda não funcionar**, investigar constraints e permissões do banco
