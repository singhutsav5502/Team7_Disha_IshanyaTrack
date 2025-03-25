import axios from 'axios';

export const API_BASE_URL = "https://team7.pythonanywhere.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
