# Frontend - Desafio Claro

Este projeto contém a aplicação frontend do Desafio Claro, desenvolvida em Angular 17.

## Instruções de Execução

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`. É necessário que a API (backend) esteja em execução na porta `8080` para o funcionamento correto das telas.

## Decisões Técnicas

- **Angular 17 (Standalone Components)**: O projeto utiliza a arquitetura standalone para reduzir a complexidade, eliminando a necessidade de NgModules e simplificando a injeção de dependências.
- **Angular Material**: A biblioteca foi utilizada para garantir a consistência visual e acelerar o desenvolvimento de componentes como tabelas, formulários e alertas.
- **Gráficos**: A renderização dos gráficos (barras e pizza) foi implementada utilizando Chart.js através da biblioteca `ng2-charts` (versão 5, para manter compatibilidade com as dependências do Angular 17).
- **Formulários Reativos (Reactive Forms)**: Aplicados no login e cadastro para centralizar a lógica de validação no TypeScript, permitindo validações síncronas de formato de e-mail, limites de tamanho e valores mínimos.
- **Atualização de Dados (Polling)**: O dashboard utiliza uma estratégia de polling com RxJS, consultando a API a cada 5 segundos. Isso garante que os dados dos gráficos e cards sejam atualizados de forma automática, sem a necessidade de recarregar a página.
