# The Tasks App Project

Este projeto consiste num backend desenvolvido em .NET (c#) e um frontend desenvolvido em Angular.

## Estrutura do Projeto
 
## Backend

O backend foi desenvolvido utilizando .NET.
Para configurar e rodar o backend, siga os passos abaixo:

1. Crie um novo projeto web API:
    ```sh
    cd iCognitus_test
    ```

2. Adicione os pacotes necessários:
    ```sh
    dotnet restore
    ```

3. Crie e atualize o banco de dados:
    ```sh
    dotnet ef database update
    ```

4. Compile e rode o projeto:
    ```sh
    dotnet build
    dotnet run
    ```

5. Acesse a documentação da API:
    ```
    http://localhost:5288/swagger/index.html
    ```

## Frontend

O frontend foi desenvolvido utilizando Angular. Para configurar e rodar o frontend, siga os passos abaixo:

1. Instale as dependências:
    ```sh
    cd Frontend-iCognitus
    npm install
    ```

2. Rode o servidor de desenvolvimento:
    ```sh
    ng serve
    ```

3. Acesse a aplicação:
    ```
    http://localhost:4200
    ```


## Demonstração

Um vídeo demonstrativo do funcionamento do projeto está disponível aqui.


## Contribuição

krammersf