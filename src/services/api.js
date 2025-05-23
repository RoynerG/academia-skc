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

// Crear una nueva temática
export const crearTematica = async (nombre) => {
  const res = await api.post("/tematicas", { nombre });
  return res.data;
};

// Crear un nuevo módulo
export const crearModulo = async ({ nombre, id_tematica }) => {
  const res = await api.post("/modulos", { nombre, id_tematica });
  return res.data;
};

// Crear un nuevo tema
export const crearTema = async ({
  nombre,
  id_modulo,
  contenido,
  competencias,
  recursos,
}) => {
  const res = await api.post("/temas", {
    nombre,
    id_modulo,
    contenido,
    competencias,
    recursos,
  });
  return res.data;
};

//Actualizar tema
export const actualizarTema = async (id, data) => {
  const res = await api.put(`/temas/${id}`, data);
  return res.data;
};

//Eliminar tema
export const eliminarTema = async (id) => {
  const res = await api.delete(`/temas/${id}`);
  return res.data;
};

//Actualizar modulo
export const actualizarModulo = async (id, data) => {
  const res = await api.put(`/modulos/${id}`, data);
  return res.data;
};

//Eliminar modulo
export const eliminarModulo = async (id) => {
  const res = await api.delete(`/modulos/${id}`);
  return res.data;
};

//Obtener examen de modulos
export const obtenerExamenesPorModulo = async (id_modulo) => {
  const res = await api.get(`/examenes/modulo/${id_modulo}`);
  return res.data;
};

//Crear examen
export const crearExamen = async (data) => {
  const res = await api.post(`/examenes`, data);
  return res.data;
};

//Obtener preguntas del examen
export const obtenerPreguntasPorExamen = async (id_examen) => {
  const res = await api.get(`/preguntas/examen/${id_examen}`);
  return res.data;
};

//Crear pregunta
export const crearPregunta = async (data) => {
  const res = await api.post(`/preguntas`, data);
  return res.data;
};

// Actualizar pregunta
export const actualizarPregunta = async (id, data) => {
  const res = await api.put(`/preguntas/${id}`, data);
  return res.data;
};

// Eliminar pregunta
export const eliminarPregunta = async (id) => {
  const res = await api.delete(`/preguntas/${id}`);
  return res.data;
};

// Cambiar estado del examen (activo/inactivo)
export const cambiarEstadoExamen = async (id, activo) => {
  const res = await api.put(`/examenes/${id}/estado`, { activo });
  return res.data;
};

export default api;
