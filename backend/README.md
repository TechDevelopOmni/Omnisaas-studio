# studio.IA Backend

API em `.NET 8` criada para substituir o mock atual do frontend.

## Stack

- ASP.NET Core Web API
- Swagger / OpenAPI
- Entity Framework Core
- SQLite
- Services como camada principal de regra de negocio

## Estrutura

- `Controllers`: endpoints HTTP
- `Contracts`: requests e responses
- `Data`: `DbContext` e seed inicial
- `Entities`: entidades persistidas no banco
- `Services`: logica principal da aplicacao

## Como rodar

```powershell
dotnet run --project .\StudioIA.Api\StudioIA.Api.csproj
```

## URL local padrao

- Swagger: `https://localhost:<porta>/swagger`
- Health: `https://localhost:<porta>/api/health`

## Credenciais mock seed

- `admin@studioia.com` / `123Qwe`
- `suporte@studioia.com` / `123Qwe`
- `cliente@studioia.com` / `123Qwe`
