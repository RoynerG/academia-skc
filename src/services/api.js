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

// Obtener módulos filtrados por id_tematica
export const obtenerModulosPorTematica = async (id_tematica) => {
  const res = await api.get("/modulos");
  // Asumiendo que la API no filtra por backend, filtramos en frontend:
  return res.data.filter((modulo) => modulo.id_tematica == id_tematica);
};

// Obtener temas por módulo
export const obtenerTemasPorModulo = async (id_modulo) => {
  const res = await api.get("/temas");
  return res.data.filter((tema) => tema.id_modulo == id_modulo);
};

export default api;
