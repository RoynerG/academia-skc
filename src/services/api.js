import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const verificarFuncionario = async (id_empleado) => {
  const res = await api.get(`/verificar-funcionario`, {
    params: { id_empleado },
  });
  return res.data;
};

export default api;
