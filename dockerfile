FROM node:lts-alpine as build-client

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm clean-install
# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY --chown=node:node . .

# build app for production with minification
RUN npm run build

RUN npm clean-install --only=production && npm cache clean --force


USER node
FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

COPY --from=build-client --chown=node:node /app/package*.json ./
COPY --from=build-client --chown=node:node /app/node_modules ./node_modules
COPY --from=build-client --chown=node:node /app/dist ./dist

CMD [ "http-server", "dist" ]
EXPOSE 3000

# First case
# FROM node:lts-alpine

# # install simple http server for serving static content
# RUN npm install -g http-server

# # make the 'app' folder the current working directory
# WORKDIR /app

# # copy both 'package.json' and 'package-lock.json' (if available)
# COPY package*.json ./

# # install project dependencies
# RUN npm install

# # copy project files and folders to the current working directory (i.e. 'app' folder)
# COPY . .

# # build app for production with minification
# RUN npm run build

# CMD [ "http-server", "dist" ]
# EXPOSE 3000