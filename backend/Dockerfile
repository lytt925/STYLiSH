FROM node:18.18-alpine

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

# This is for documentation purposes only.
# document the intended port usage
ENV PORT 4000 
EXPOSE $PORT 

LABEL name="backend"

CMD [ "npm", "start" ]
