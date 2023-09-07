# Utiliza una imagen de Node.js como base
FROM node:14

# Establece el directorio de trabajo en la aplicación
WORKDIR /app

# Copia el archivo package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia los archivos de la aplicación al contenedor Docker
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Expone el puerto 80
EXPOSE 3000

# Inicia la aplicación
CMD [ "npm", "start" ]
