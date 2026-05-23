import axios from "axios";

const api=axios.create({
    baseURL:'http://localhost:5000/auth/'
})
const googleAuth =(code)=>api.get(`/google?code=${code}`);
export default googleAuth