# The Tasks App Project

Este projeto consiste num backend desenvolvido em dotNET (c#) e um frontend desenvolvido em Angular.

## Estrutura do Projeto

O backend foi desenvolvido utilizando dotNET (c#).
O frontend foi desenvolvido utilizando Angular.
 
## Backend

Para configurar e rodar o backend, siga os passos abaixo:

1. Clone este projecto e de o nome theTasksApp

2. Entre no project:
    ```sh
    cd theTasksApp
    ```

3. Entre no backend :
    ```sh
    cd Backend-theTasksApp
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

Para configurar e rodar o frontend, siga os passos abaixo:

1. Entre no Frontend
    ```sh
    cd Frontend-theTasksApp
    ```

1. Instale as dependências:
    ```sh
    npm install
    ```

2. Rode o servidor:
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