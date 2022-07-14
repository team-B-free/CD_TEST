FROM node:16

WORKDIR /Users/adasddasd12/Desktop/vsProj/03-GameDuo/03-GameDuo/

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "start"]