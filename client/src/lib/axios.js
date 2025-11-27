import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/v1"
    : "https://mernecommercestore3-k23ue8zzd-kamrul-hasans-projects-8fdfd959.vercel.app/api/v1");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
