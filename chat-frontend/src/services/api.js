import axios from 'axios';

export default axios.create({
  baseURL: '/chat-backend',
  headers: {
    Accept: 'application/json',
  },
});