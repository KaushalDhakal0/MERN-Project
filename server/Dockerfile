FROM node:18
ENV PORT=8080
ENV MONGODB_CONNECTION_STRING="mongodb+srv://dbuser:<YOUR_PASSWORD>@cluster0.hh4refm.mongodb.net/"
ENV ACCESS_TOKEN_SECRET=asdfghjkl
ENV REFRESH_TOKEN_SECRET=asdfghhgfda
ENV API_KEY='574764568444274'
ENV API_SECRET='OlL_25J5tSiCUEDrDtOoX_D8i8I'
ENV CLOUD_NAME='dmzqv8ieu'

WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 8080
CMD ["node", "index.js"]
