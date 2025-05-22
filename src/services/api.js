import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//Verificar rol del funcionario
export const verificarFuncionario = async (id_empleado) => {
  const res = await api.get(`/verificar-funcionario`, {
    params: { id_empleado },
  });
  return res.data;
};

// Obtener todas las temáticas
export const obtenerTematicas = async () => {
  const res = await api.get("/tematicas");
  return res.data;
};

export default api;
