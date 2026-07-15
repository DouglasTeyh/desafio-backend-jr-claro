# Desafio Backend Claro

Projeto desenvolvido para o desafio técnico. O repositório contém tanto a API REST (Spring Boot) quanto o Frontend (Angular), orquestrados via Docker para facilitar a execução.

## Estrutura do Projeto

- `/backend`: API construída com Java 17, Spring Boot 3 e banco em memória (H2).
- `/frontend`: SPA construída com Angular 17, usando Angular Material e Chart.js.
- `/grafana`: Arquivos de provisionamento automático do dashboard de métricas de negócio.

## Como rodar o projeto

A forma mais simples de testar toda a infraestrutura é via Docker Compose.

1. Na raiz do projeto, execute:
   ```bash
   docker-compose up -d --build
   ```
2. Acesse as interfaces no navegador:
   - **Frontend:** http://localhost:4200
   - **Swagger (Documentação da API):** http://localhost:8080/swagger-ui.html
   - **Grafana (Dashboards de Métricas):** http://localhost:3000 (usuário: `admin`, senha: `admin`)
   - **Prometheus (Coleta de Métricas):** http://localhost:9090

*Nota: O banco de dados H2 é inicializado automaticamente com 3 pedidos para facilitar os testes da interface.*

## Decisões Técnicas

- **Orquestração com Docker:** Empacotei a aplicação com Docker para padronizar o ambiente. O frontend é servido via Nginx para roteamento correto da SPA, e o backend roda com a imagem JRE 17 do Temurin.
- **Observabilidade (Prometheus/Grafana):** Como diferencial, expus endpoints do Micrometer no Spring Boot (`/actuator/prometheus`). Fui além das métricas da JVM e adicionei métricas de negócio customizadas (total de pedidos e contagem por status). O Grafana já sobe provisionado com essas informações na tela inicial.
- **Design no Frontend:** Utilize o Angular Material para componentização limpa. Implementei a comunicação com o backend mantendo pooling a cada 5 segundos nos gráficos e verificação da saúde da API (`/actuator/health`), além de ordenação e paginação na lista de pedidos.
- **Regras de Negócio no Service:** O limite máximo de 5 pedidos simultâneos e o bloqueio de transições de status inválidas foram isolados na camada de `Service` do backend, mantendo os `Controllers` limpos.
- **Autenticação Simples:** Mantive a rota de `/login` validando formato de e-mail e ativando os controles da UI, conforme escopo inicial focado na usabilidade, deixando o backend focado no CRUD de pedidos.

## Desenvolvimento Local (Sem Docker)

Caso prefira rodar as aplicações isoladamente:

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```
