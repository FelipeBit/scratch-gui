import axios from 'axios';

const api = axios.create({
    baseURL: 'http://18.188.92.227:3000/' // 'http://localhost:3333'
});

export default api;
