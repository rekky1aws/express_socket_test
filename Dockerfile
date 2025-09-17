# Image Node officielle
FROM node:20

# Crée un répertoire pour l’app dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste de l’app (app.js, public/, etc.)
COPY . .

# Expose le port utilisé par Express
EXPOSE 3000

# Démarre le serveur
CMD ["node", "app.js"]