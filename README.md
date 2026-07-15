# Desafio Backend Claro

Projeto desenvolvido para o desafio técnico de Desenvolvedor Java Júnior. A solução implementa uma API RESTful em Spring Boot, uma interface Single Page Application (SPA) em Angular e infraestrutura de observabilidade com Grafana e Prometheus.

## Estrutura do Projeto

- `/backend`: API construída com Java 17, Spring Boot 3 e banco em memória (H2).
- `/frontend`: Aplicação web construída com Angular 17, Angular Material e Chart.js.
- `/grafana`: Configurações de provisionamento (Datasource e Dashboards) do Grafana.

## Execução com Docker

A infraestrutura utiliza Docker Compose para rodar todos os serviços.

1. Na raiz do projeto, execute:
   ```bash
   docker-compose up -d --build
   ```
2. Acesse os serviços nos seguintes endereços:
   - Frontend: http://localhost:4200
   - Swagger: http://localhost:8080/swagger-ui.html
   - Grafana: http://localhost:3000 (Credenciais: admin / admin)
   - Prometheus: http://localhost:9090

Nota: O banco H2 inicia com 3 pedidos pré-cadastrados (DatabaseSeeder) para testes.

## Telas da Aplicação

### 1. Login e Validação
![Login](./docs/Captura%20de%20tela%202026-07-15%20002309.png)
A tela de login possui validação no cliente. Se o e-mail for inválido, exibe erro e desabilita o botão, evitando chamadas desnecessárias à API. Com os dados corretos, o acesso é liberado (demonstrado em `./docs/Captura de tela 2026-07-15 002327.png`).

### 2. Dashboard de Monitoramento
![Dashboard](./docs/Captura%20de%20tela%202026-07-15%20002420.png)
O Dashboard exibe:
- Vagas ocupadas (3/5), indicando a regra de limite.
- Contadores de pedidos por status.
- Gráficos (Chart.js) com os dados atuais. No topo direito, o indicador "API Status: UP" confirma que o backend responde no endpoint /actuator/health.

### 3. Listagem de Pedidos
![Listagem](./docs/Captura%20de%20tela%202026-07-15%20002503.png)
A listagem consome a API e inclui paginação. Estão disponíveis botões de transição de status e exclusão. Regras de transição inválidas (como pausar um pedido já pausado) são validadas pela API.

### 4. Cadastro de Pedido
![Cadastro](./docs/Captura%20de%20tela%202026-07-15%20002455.png)
Formulário com validação de campos. Se houver tentativa de criar o 6º pedido, a API retorna HTTP 400 (Bad Request) e a interface exibe a mensagem de erro retornada pelo backend através de um toast.

### 5. Documentação da API
![Swagger UI](./docs/Captura%20de%20tela%202026-07-15%20002944.png)
Integração com springdoc-openapi. As rotas estão disponíveis para testes diretos e consulta.

### 6. Observabilidade
#### Grafana (Dashboard de Métricas)
![Grafana](./docs/Captura%20de%20tela%202026-07-15%20002714.png)

#### Prometheus (Coleta de Métricas)
![Prometheus](./docs/Captura%20de%20tela%202026-07-15%20002734.png)

#### Spring Boot Actuator (/actuator/health)
![Actuator](./docs/Captura%20de%20tela%202026-07-15%20002745.png)
Dashboard customizado provisionado via Docker. Ele reflete as métricas de negócio (total cadastrado e status dos pedidos). O Prometheus coleta os dados via Spring Boot Actuator (/actuator/prometheus).

## Premissas e Decisões Técnicas

1. Separação de Responsabilidades (SOLID): A validação do limite de pedidos e transição de status foi isolada na camada Service. O Controller funciona apenas como roteador HTTP, facilitando testes.
2. Tratamento de Exceções: A aplicação utiliza ResponseStatusException para retornar códigos semânticos (ex: HTTP 400 e 422) em regras de negócio violadas, em vez de retornar HTTP 500.
3. Observabilidade: Foi integrado o Micrometer para métricas de negócio na classe PedidoMetrics. Os dados populam o Grafana diretamente, sem consultas extras ao banco.
4. Testes: O backend inclui testes com JUnit para controllers e services. O frontend possui testes com Jasmine.
5. Segurança (JWT): Foi implementada autenticação baseada em JWT. O backend gera o token no login e o valida em rotas privadas usando um filtro de servlet personalizado (JwtFilter). No frontend, o token é guardado e anexado em cada requisição de API usando um HttpInterceptorFn, com as rotas internas protegidas por Route Guard (CanActivateFn).
6. Usabilidade e UX: A listagem de pedidos inclui paginação, ordenação, busca textual por nome do cliente e filtro por status. Além disso, indicadores de carregamento visual (spinners) são mostrados no cadastro e listagem durante operações assíncronas.

## Trade-offs

Durante o desenvolvimento, algumas escolhas foram necessárias dado o escopo do desafio técnico:

1. Banco de Dados: Optou-se pelo H2 em memória em vez de um banco relacional como PostgreSQL. Isso facilita a execução para avaliação do projeto sem exigir configurações pesadas, embora um banco robusto fosse a escolha real para escalabilidade.
2. Atualização em Tempo Real: O dashboard do frontend atualiza via polling a cada 5 segundos com RxJS, em vez de WebSockets. Para o escopo de 5 pedidos, o polling resolve o problema sem a complexidade de manter conexões ativas no servidor.
3. Gerenciamento de Estado: O frontend não utiliza NgRx ou Redux. Como o objetivo principal era o backend, o estado é mantido nos services, evitando complexidade desnecessária no projeto Angular.

## Execução Sem Docker

Caso prefira executar as aplicações separadamente:

Backend:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## O que faria diferente com mais tempo

- **Banco de dados persistente:** Substituiria o H2 por PostgreSQL, adicionando migrations com Flyway para controle de versão do schema.
- **Testes de integração:** Adicionaria testes de integração no backend com `@SpringBootTest` e `TestRestTemplate`, cobrindo o fluxo completo de criação e transição de status em banco real.
- **Server-Sent Events no dashboard:** Substituiria o polling de 5 segundos por SSE (ou WebSocket), onde o backend notifica o frontend apenas quando um pedido é criado, atualizado ou excluído, eliminando requisições desnecessárias e reduzindo a carga no servidor.
