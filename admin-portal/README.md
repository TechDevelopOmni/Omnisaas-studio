# studio.IA Admin Portal

Frontend administrativo isolado da jornada do cliente final.

## Objetivo

Este projeto concentra a operacao interna da plataforma:

- login administrativo;
- dashboard interno;
- gestao de departamentos e especialidades;
- gestao de agentes do catalogo;
- operacao de clientes;
- leitura e edicao de configuracoes globais da API.

## Stack

- React
- TypeScript
- Vite
- React Router

## API compartilhada

O portal usa a mesma API `.NET 8` do repositorio:

- base default: `http://localhost:5202/api`

Se quiser mudar:

```powershell
$env:VITE_API_URL="http://localhost:5202/api"
npm run dev
```

## Como rodar

```powershell
cd .\admin-portal
npm install
npm run dev
```

## Credenciais de seed

- `admin@studioia.com` / `123Qwe`
- `suporte@studioia.com` / `123Qwe`
