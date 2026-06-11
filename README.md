# 🏀 Basketball Hub Brasil

Todos os jogos de basquete em um só lugar.
NBA, WNBA, NBB, NCAA, EuroLeague e muito mais.

## Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **API:** API-Sports Basketball
- **Deploy:** Vercel

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local e adicione sua chave da API-Sports

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `API_SPORTS_KEY` | Chave da API-Sports Basketball |

Obtenha sua chave em: https://www.api-sports.io/

## Fases de Implementação

- [x] **Fase 1** — Fundação do projeto
- [ ] **Fase 2** — Integração API-Sports
- [ ] **Fase 3** — Calendário horizontal
- [ ] **Fase 4** — Lista de jogos por liga
- [ ] **Fase 5** — Card de jogo
- [ ] **Fase 6** — Jogos ao vivo (atualização 30s)
- [ ] **Fase 7** — Onde assistir
- [ ] **Fase 8** — Landing page profissional
- [ ] **Fase 9** — Deploy e SEO

## Definição de Sucesso do MVP

- [ ] Usuário consegue escolher uma data
- [ ] Usuário consegue visualizar jogos daquela data
- [ ] Usuário consegue visualizar placares ao vivo
- [ ] Usuário consegue visualizar próximos jogos
- [ ] Usuário consegue saber onde assistir
- [ ] Funciona em smartphone, tablet e desktop
- [ ] Deploy na Vercel
