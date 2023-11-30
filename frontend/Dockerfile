FROM node:18.18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

# This is for documentation purposes only.
# document the intended port usage
ENV PORT 3000 
EXPOSE $PORT 

LABEL name="frontend"

CMD [ "npm", "start" ]
