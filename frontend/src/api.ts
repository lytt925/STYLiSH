import axios from 'axios';

const NODE_ENV = process.env.NODE_ENV;

const instance = axios.create({
  baseURL: NODE_ENV === 'development'
    ? `http://localhost:4000/api/1.0`
    : `https://44.217.27.217/api/1.0`,
});

// instance.get('/healthcheck').then((data) => console.log(data));

export default instance;
