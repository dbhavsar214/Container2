FROM node:14

# Create app director
WORKDIR /container2

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 6001
CMD [ "node", "index.js" ]
