FROM node:18-alpine

WORKDIR /home/BE

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build-src

CMD [ "npm", "run", "build" ]

# docker build -t node_be .
# docker run -d -p 8080:8080 node_be
