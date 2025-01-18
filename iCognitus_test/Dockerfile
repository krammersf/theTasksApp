# Use a imagem oficial do .NET SDK para compilar e publicar o aplicativo
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copie os arquivos de projeto e restaure as dependências
COPY *.csproj ./
RUN dotnet restore

# Copie o restante dos arquivos e compile o aplicativo
COPY . ./
RUN dotnet publish -c Release -o out

# Use a imagem oficial do .NET Runtime para executar o aplicativo
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Exponha a porta que o aplicativo está escutando
EXPOSE 80

# Defina o comando de entrada para executar o aplicativo
ENTRYPOINT ["dotnet", "SeuProjeto.dll"]