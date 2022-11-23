# Instruções para rodar backend

## Requerimentos e recomendações

- Docker instalado na máquina
- Ler este arquivo como preview de um markdown pra melhor compreensão

## Passo a passo

  1. Crie um arquivo .env na raiz do projeto
  2. Copie as seguinte variáveis para o arquivo .env:

  ```
    JWT_SECRET_KEY=LQcdm9cNVS9KPon5p/GKhcRBtvw0CBlxgQS5Lxx1CLM
    DB_MAIN_HOST=postgres
    DB_MAIN_PORT=5432
    DB_MAIN_USER=postgres
    DB_MAIN_PASSWORD=westeros
    DB_MAIN_DATABASE=postgres
  ```

  3. Com um terminal aberto na pasta raiz do projeto. Tecle o seguinte comando:

  ```
    docker-compose up -d
  ```

  4. Após por volta de 2 ou 4 minutos, o servidor do backend estará rodando na porta 3000. O servidor do banco
  de dados estará rodando na porta 5432.

## Observações do projeto

- O projeto está armazendo os valores das transações em centavos, assim também como o valor default da conta do usuário ao ser cadastrada. Tal abordagem se faz necessária por causa de um erro de arredondamento do JavaScript, basta executar no console do navegador 1.2 - 1.0 para exemplo prático. [Para mais informações](https://www.crojach.com/blog/2020/4/6/using-cents-for-money-values).

- [Repositório do projeto](https://github.com/NicholasTavares/ng-back)
