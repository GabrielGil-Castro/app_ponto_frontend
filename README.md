# Ponto App — Frontend

Interface web para sistema de registro de ponto. Desenvolvido com React e Vite.

## Stack

- React 19 + Vite
- React Router
- Axios
- date-fns
- CSS Modules

## Funcionalidades

- Login com JWT
- Dashboard do funcionário: bater ponto e ver registros
- Painel admin: gerenciar usuários e registros
- Rotas protegidas por perfil

## Como rodar localmente

### Pré-requisitos
- Node.js 23+
- Backend rodando em `http://localhost:3001`

### Setup
```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

### Variáveis de ambiente

Crie um arquivo `.env.production` na raiz do projeto:
```
VITE_API_URL=http://localhost:3001
```

## Estrutura
```
src/
├── context/       AuthContext — estado global de autenticação
├── pages/         Login, Dashboard, Admin
│   └── styles/    CSS Modules por página
├── services/      api.js — instância Axios configurada
├── App.jsx        Rotas e PrivateRoute
└── main.jsx       Providers
```

## Rodar em produção
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up --build
```

Acesse `http://localhost`
