import axios from "@/utils/axios";
export const login = (data?: any) => axios.post('/worker/login', data);