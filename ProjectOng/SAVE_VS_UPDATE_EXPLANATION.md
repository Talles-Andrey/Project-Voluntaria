# Save() vs Update() - Por que Update() é a Solução Correta

## 🎯 **Problema Identificado**

Você estava certo! O problema era usar `save()` em vez de `update()` para modificar dados existentes.

## 🔍 **Diferença entre Save() e Update()**

### **❌ Save() - O que estava acontecendo:**
```typescript
// 1. Carrega a entidade do banco
const campaign = await this.campaignsRepository.findOne({ where: { id } });

// 2. Modifica a entidade em memória
campaign.currentAmount += amount;
campaign.numberOfDonations++;

// 3. Tenta salvar (mas pode não detectar mudanças)
await this.campaignsRepository.save(campaign);
```

**Problemas com Save():**
- ❌ **Pode não detectar** mudanças em campos calculados
- ❌ **Problemas com tipos** decimal vs number
- ❌ **Relacionamentos** podem interferir
- ❌ **Validações** podem falhar silenciosamente

### **✅ Update() - A solução correta:**
```typescript
// 1. Atualiza diretamente no banco
const updateResult = await this.campaignsRepository.update(id, {
  numberOfDonations: (campaign.numberOfDonations || 0) + 1,
  currentAmount: (campaign.currentAmount || 0) + amount,
});

// 2. Verifica se funcionou
if (updateResult.affected && updateResult.affected > 0) {
  console.log('Update successful!');
}
```

**Vantagens do Update():**
- ✅ **Executa SQL direto** no banco
- ✅ **Bypass** problemas do TypeORM
- ✅ **Garantia** de que a operação acontece
- ✅ **Retorna** quantas linhas foram afetadas

## 🚀 **Como Funciona Agora**

### **1. Logs Antes da Atualização**
```typescript
console.log('=== BEFORE UPDATE ===');
console.log('Campaign ID:', campaign.id);
console.log('Current Amount:', campaign.currentAmount);
console.log('Number of Donations:', campaign.numberOfDonations);
console.log('New Donation Amount:', amount);
```

### **2. Atualização Direta no Banco**
```typescript
const updateResult = await this.campaignsRepository.update(id, {
  numberOfDonations: (campaign.numberOfDonations || 0) + 1,
  currentAmount: (campaign.currentAmount || 0) + amount,
});
```

### **3. Verificação do Resultado**
```typescript
if (updateResult.affected && updateResult.affected > 0) {
  console.log('=== UPDATE SUCCESSFUL ===');
  console.log('Rows affected:', updateResult.affected);
  
  // Recarregar para confirmar mudanças
  const updatedCampaign = await this.campaignsRepository.findOne({ where: { id } });
  console.log('Updated Current Amount:', updatedCampaign?.currentAmount);
}
```

## 📡 **SQL Gerado**

### **Save() (problemático):**
```sql
-- TypeORM pode gerar SQL complexo ou não detectar mudanças
SELECT * FROM campaigns WHERE id = ?;
-- Modificações em memória
-- Pode não gerar UPDATE se não detectar mudanças
```

### **Update() (solução):**
```sql
-- SQL direto e simples
UPDATE campaigns 
SET numberOfDonations = ?, currentAmount = ? 
WHERE id = ?;
```

## 🔧 **Outras Alternativas**

### **1. QueryBuilder**
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

### **2. Raw Query**
```typescript
await this.campaignsRepository.query(
  'UPDATE campaigns SET currentAmount = currentAmount + $1 WHERE id = $2',
  [amount, id]
);
```

### **3. Update() (Recomendado)**
```typescript
await this.campaignsRepository.update(id, {
  currentAmount: (campaign.currentAmount || 0) + amount
});
```

## 🎯 **Por que Update() é Melhor**

### **Para Modificações Simples:**
- ✅ **Mais direto** e confiável
- ✅ **SQL otimizado** pelo TypeORM
- ✅ **Controle total** sobre os campos
- ✅ **Retorna resultado** da operação

### **Para Criações:**
- ✅ **Save()** é melhor para novas entidades
- ✅ **Update()** é melhor para modificações

## 📝 **Regra Geral**

```typescript
// ✅ Para CRIAR: use save()
const newCampaign = new Campaign(...);
await this.campaignsRepository.save(newCampaign);

// ✅ Para MODIFICAR: use update()
await this.campaignsRepository.update(id, { field: newValue });

// ✅ Para DELETAR: use delete()
await this.campaignsRepository.delete(id);
```

## 🚀 **Resultado Esperado**

Agora com `update()`:
- ✅ **Campanha é atualizada** corretamente no banco
- ✅ **Logs mostram** valores antes e depois
- ✅ **Resultado é verificado** via `affected` rows
- ✅ **Dados são confirmados** recarregando a entidade

## 💡 **Dica Importante**

**Sempre use:**
- `save()` → Para **criar** novas entidades
- `update()` → Para **modificar** entidades existentes
- `delete()` → Para **remover** entidades

**Nunca use `save()` para modificar dados existentes** - é uma armadilha comum! 🎯
