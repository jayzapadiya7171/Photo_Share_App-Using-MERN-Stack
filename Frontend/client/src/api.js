import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 👈 critical for HTTP-only cookies
});

export default API;
