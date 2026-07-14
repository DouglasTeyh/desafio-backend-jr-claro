# Desafio Backend Claro

Projeto desenvolvido para o desafio técnico de Desenvolvedor Java Júnior. O foco inicial foi entregar os requisitos obrigatórios bem estruturados antes de partir para os diferenciais.

## Como rodar o projeto

1. Entre na pasta `backend`: `cd backend`
2. Suba a aplicação usando o Maven Wrapper: `.\mvnw spring-boot:run` (ou `./mvnw` no Linux/Mac)
3. A API vai rodar na porta `8080`.

O banco de dados já sobe com 3 pedidos iniciais pra facilitar os testes da interface.

## Algumas decisões que tomei

- **Banco em Memória (H2):** Como a persistência era livre, optei pelo H2. Ele sobe junto com a aplicação, o que facilita bastante na hora de avaliar o código, já que não exige configuração de banco externo.
- **Regras de Negócio no Service:** Centralizei o controle do limite de 5 pedidos e a validação das mudanças de status no `PedidoService`. Achei melhor tirar essa responsabilidade do Controller, que ficou só com a parte de receber e devolver as respostas HTTP.
- **Autenticação Básica (Dummy):** O endpoint `/api/auth/login` está lá e validando os campos, mas aceitando qualquer credencial não-vazia por enquanto. O objetivo foi garantir que o fluxo do frontend funcione logo de cara. O JWT real eu planejo adicionar depois como diferencial.
- **Tratamento de Erros:** Usei `ResponseStatusException` pra lançar os erros com os códigos HTTP (400, 404, 422) nos lugares certos. É uma abordagem mais simples e direta do que montar um `@ControllerAdvice` completo pra um app pequeno.
- **Logs:** Coloquei logs com SLF4J nas ações de criação, alteração e exclusão. Ajuda a ter um rastro claro do que acontece no sistema.
