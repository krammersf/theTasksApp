# Use a imagem oficial do Node.js para compilar o aplicativo Angular
FROM node:18 AS build
WORKDIR /app

# Copie os arquivos de projeto e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante dos arquivos e compile o aplicativo
COPY . ./
RUN npm run build --prod

# Use uma imagem do Nginx para servir o aplicativo Angular
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exponha a porta que o Nginx está escutando
EXPOSE 80