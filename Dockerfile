# FROM node:20.16-alpine

# WORKDIR /react-app

# EXPOSE 3000

# COPY package.json package-lock.json ./

# RUN npm install --silent

# COPY . ./

# CMD ["npm", "run", "dev"]


FROM node:18-alpine

WORKDIR /react-vite-app

EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]
