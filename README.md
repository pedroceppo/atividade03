# Cadastro de Fornecedor

Sistema de cadastro de fornecedores com login/logout, feito em Node.js puro.

## Rodar localmente

```bash
node servidor.js
```

Acesse: http://localhost:3000

**Usuários para login:**
- admin / 1234
- joao / abc123

---

## Subir no GitHub

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

---

## Deploy no Vercel

1. Acesse https://vercel.com e faça login com sua conta GitHub
2. Clique em **Add New Project**
3. Selecione o repositório que você criou
4. Clique em **Deploy** — o Vercel detecta o `vercel.json` automaticamente

> Atenção: no Vercel, a lista de fornecedores e as sessões ficam na memória da função serverless e são resetadas a cada novo deploy ou após inatividade. Para persistir os dados, seria necessário usar um banco de dados.
