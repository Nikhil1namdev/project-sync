import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/`
})
const googleAuth =(code)=>api.get(`/google?code=${code}`);
export default googleAuth