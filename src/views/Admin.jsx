import { useEffect, useState } from "react";
import {
  obtenerTematicas,
  obtenerModulosPorTematica,
  obtenerTemasPorModulo,
  crearTematica,
  crearModulo,
  crearTema,
  actualizarTema,
  eliminarTema,
  eliminarModulo,
  actualizarModulo,
  obtenerExamenesPorModulo,
  crearExamen,
  obtenerPreguntasPorExamen,
  crearPregunta,
  eliminarPregunta,
  actualizarPregunta,
  cambiarEstadoExamen,
  obtenerResumenPorModulo,
} from "../services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import ResultadosEstudiantes from "./ResultadosEstudiantes";

function Admin({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [tematicaSeleccionada, setTematicaSeleccionada] = useState(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarTemas, setMostrarTemas] = useState(false);
  const [mostrarModalCrearTema, setMostrarModalCrearTema] = useState(false);
  const [cargandoTematicas, setCargandoTematicas] = useState(true);
  const [cargandoModulos, setCargandoModulos] = useState(false);
  const [cargandoTemas, setCargandoTemas] = useState(false);
  const [contenido, setContenido] = useState("");
  const [recursos, setRecursos] = useState("");
  const [competencias, setCompetencias] = useState("");
  const [mostrarModalEditarTema, setMostrarModalEditarTema] = useState(false);
  const [temaEditando, setTemaEditando] = useState(null);
  const [mostrarModalEditarModulo, setMostrarModalEditarModulo] =
    useState(false);
  const [moduloEditando, setModuloEditando] = useState(null);
  const [mostrarModalVistaModulo, setMostrarModalVistaModulo] = useState(false);
  const [moduloVista, setModuloVista] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [mostrarModalCrearExamen, setMostrarModalCrearExamen] = useState(false);
  const [preguntas, setPreguntas] = useState([]);
  const [examenSeleccionado, setExamenSeleccionado] = useState(null);
  const [mostrarModalPreguntas, setMostrarModalPreguntas] = useState(false);
  const [mostrarModalCrearPregunta, setMostrarModalCrearPregunta] =
    useState(false);
  const [tipoPregunta, setTipoPregunta] = useState("seleccion_multiple");
  const [preguntaEditando, setPreguntaEditando] = useState(null);
  const [mostrarModalEditarPregunta, setMostrarModalEditarPregunta] =
    useState(false);
  const [mostrarVistaPreviaExamen, setMostrarVistaPreviaExamen] =
    useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resumenModulo, setResumenModulo] = useState(null);
  const [moduloObservaciones, setModuloObservaciones] = useState("");
  const [moduloCompetencias, setModuloCompetencias] = useState("");
  const [moduloActividades, setModuloActividades] = useState("");
  const [moduloObjetivos, setModuloObjetivos] = useState("");
  const [mostrarModalCrearModulo, setMostrarModalCrearModulo] = useState(false);

  useEffect(() => {
    obtenerTematicas()
      .then(setTematicas)
      .catch((err) => console.error("Error cargando temáticas:", err))
      .finally(() => setCargandoTematicas(false));
  }, []);

  useEffect(() => {
    if (moduloEditando) {
      setModuloObservaciones(moduloEditando.observaciones || "");
      setModuloCompetencias(moduloEditando.competencias || "");
      setModuloActividades(moduloEditando.actividades || "");
      setModuloObjetivos(moduloEditando.objetivos || "");
    } else {
      // limpia cuando se cierra el modal
      setModuloObservaciones("");
      setModuloCompetencias("");
      setModuloActividades("");
      setModuloObjetivos("");
    }
  }, [moduloEditando]);

  const seleccionarTematica = (tematica) => {
    if (tematicaSeleccionada?.id === tematica.id) {
      setTematicaSeleccionada(null);
      setModulos([]);
      setModuloSeleccionado(null);
      setTemas([]);
      setMostrarTemas(false);
      return;
    }
    setTematicaSeleccionada(tematica);
    setModuloSeleccionado(null);
    setTemas([]);
    setModulos([]);
    setMostrarTemas(false);
    setCargandoModulos(true);
    obtenerModulosPorTematica(tematica.id)
      .then(setModulos)
      .catch((err) => console.error("Error cargando módulos:", err))
      .finally(() => setCargandoModulos(false));
  };

  const seleccionarModulo = (modulo) => {
    if (moduloSeleccionado?.id === modulo.id) {
      setModuloSeleccionado(null);
      setTemas([]);
      setMostrarTemas(false);
      setExamenes([]);
      return;
    }
    setModuloSeleccionado(modulo);
    setTemas([]);
    setMostrarTemas(true);
    setCargandoTemas(true);
    obtenerTemasPorModulo(modulo.id)
      .then(setTemas)
      .catch((err) => console.error("Error cargando temas:", err))
      .finally(() => setCargandoTemas(false));

    obtenerExamenesPorModulo(modulo.id)
      .then(setExamenes)
      .catch((err) => console.error("Error cargando exámenes:", err));

    obtenerResumenPorModulo(modulo.id)
      .then(setResumenModulo)
      .catch((err) => console.error("Error cargando resumen:", err));
  };

  const handleCrearTema = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      contenido,
      competencias,
      recursos,
      id_modulo: moduloSeleccionado.id,
    };
    crearTema(data).then(() => {
      form.reset();
      setContenido("");
      setRecursos("");
      setCompetencias("");
      setMostrarModalCrearTema(false);
      return obtenerTemasPorModulo(moduloSeleccionado.id).then(setTemas);
    });
  };

  return (
    <div className="p-6">
      <a
        href="https://sucasainmobiliaria.com.co/mi-cuenta/"
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded inline-flex items-center"
      >
        ← Regresar al inicio
      </a>
      <h1 className="text-2xl font-bold mb-4">
        Panel Admin - {usuario.nombre}
      </h1>

      <h2 className="text-lg font-semibold mb-2">Temáticas:</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const nombre = e.target.nombre.value;
          if (!nombre) return;
          crearTematica(nombre).then(() => {
            e.target.reset();
            return obtenerTematicas().then(setTematicas);
          });
        }}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nueva temática"
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </form>

      {cargandoTematicas ? (
        <p className="text-gray-600">Cargando temáticas...</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {tematicas.map((t) => (
            <li
              key={t.id}
              className={`cursor-pointer p-3 border rounded hover:bg-gray-100 ${
                tematicaSeleccionada?.id === t.id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => seleccionarTematica(t)}
            >
              {t.nombre}
            </li>
          ))}
        </ul>
      )}

      {tematicaSeleccionada && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Módulos de: {tematicaSeleccionada.nombre}
          </h2>
          <button
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setMostrarModalCrearModulo(true)}
          >
            + Agregar nuevo módulo
          </button>

          {mostrarModalCrearModulo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => {
                    setMostrarModalCrearModulo(false);
                    setModuloObservaciones("");
                    setModuloCompetencias("");
                    setModuloActividades("");
                    setModuloObjetivos("");
                  }}
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Crear nuevo módulo</h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const nombre = e.target.nombre.value;
                    const data = {
                      nombre,
                      id_tematica: tematicaSeleccionada.id,
                      observaciones: moduloObservaciones,
                      competencias: moduloCompetencias,
                      actividades: moduloActividades,
                      objetivos: moduloObjetivos,
                    };

                    await crearModulo(data);
                    setMostrarModalCrearModulo(false);
                    e.target.reset();
                    setModuloObservaciones("");
                    setModuloCompetencias("");
                    setModuloActividades("");
                    setModuloObjetivos("");

                    await obtenerModulosPorTematica(
                      tematicaSeleccionada.id
                    ).then(setModulos);
                  }}
                  className="space-y-4"
                >
                  <input
                    name="nombre"
                    placeholder="Nombre del módulo"
                    className="w-full border p-2 rounded"
                    required
                  />

                  <div className="space-y-2 mb-12">
                    <label className="font-semibold block">Observaciones</label>
                    <ReactQuill
                      theme="snow"
                      value={moduloObservaciones}
                      onChange={setModuloObservaciones}
                      className="bg-white h-28"
                    />
                  </div>

                  <div className="space-y-2 mb-12">
                    <label className="font-semibold block">Competencias</label>
                    <ReactQuill
                      theme="snow"
                      value={moduloCompetencias}
                      onChange={setModuloCompetencias}
                      className="bg-white h-28"
                    />
                  </div>

                  <div className="space-y-2 mb-12">
                    <label className="font-semibold block">Actividades</label>
                    <ReactQuill
                      theme="snow"
                      value={moduloActividades}
                      onChange={setModuloActividades}
                      className="bg-white h-28"
                    />
                  </div>

                  <div className="space-y-2 mb-12">
                    <label className="font-semibold block">Objetivos</label>
                    <ReactQuill
                      theme="snow"
                      value={moduloObjetivos}
                      onChange={setModuloObjetivos}
                      className="bg-white h-28"
                    />
                  </div>

                  <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Crear módulo
                  </button>
                </form>
              </div>
            </div>
          )}

          {cargandoModulos ? (
            <p className="text-gray-600">Cargando módulos...</p>
          ) : modulos.length === 0 ? (
            <p className="text-gray-600">No hay módulos.</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {modulos.map((m) => (
                <li
                  key={m.id}
                  className={`cursor-pointer p-3 border rounded hover:bg-gray-100 ${
                    moduloSeleccionado?.id === m.id
                      ? "bg-green-100"
                      : "bg-white"
                  }`}
                  onClick={() => seleccionarModulo(m)}
                >
                  <div className="flex justify-between items-center">
                    <span>{m.nombre}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModuloEditando(m);
                          setMostrarModalEditarModulo(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar módulo"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirm = window.confirm(
                            "¿Eliminar este módulo?"
                          );
                          if (confirm) {
                            await eliminarModulo(m.id);
                            await obtenerModulosPorTematica(
                              tematicaSeleccionada.id
                            ).then(setModulos);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar módulo"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const temasDelModulo = await obtenerTemasPorModulo(
                            m.id
                          );
                          setModuloVista({ ...m, temas: temasDelModulo });
                          setMostrarModalVistaModulo(true);
                        }}
                        className="text-gray-600 hover:text-black text-sm underline ml-2"
                      >
                        👁 Vista previa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {moduloSeleccionado && mostrarTemas && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Temas del módulo: {moduloSeleccionado.nombre}
          </h2>

          <button
            className="mb-4 bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => setMostrarModalCrearTema(true)}
          >
            + Agregar nuevo tema
          </button>

          {cargandoTemas ? (
            <p className="text-gray-600">Cargando temas...</p>
          ) : temas.length === 0 ? (
            <p className="text-gray-600">No hay temas.</p>
          ) : (
            <ul className="space-y-2 mt-4">
              {temas.map((tema) => (
                <li
                  key={tema.id}
                  className="bg-white border rounded p-3 shadow relative"
                  onClick={() => setTemaSeleccionado(tema)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{tema.nombre}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemaEditando(tema);
                          setContenido(tema.contenido);
                          setCompetencias(tema.competencias);
                          setRecursos(tema.recursos);
                          setMostrarModalEditarTema(true);
                        }}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit size={16} />
                      </button>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirm = window.confirm(
                            "¿Estás seguro de que deseas eliminar este tema?"
                          );
                          if (confirm) {
                            await eliminarTema(tema.id);
                            await obtenerTemasPorModulo(
                              moduloSeleccionado.id
                            ).then(setTemas);
                          }
                        }}
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="text-sm text-gray-500 mt-1"
                    dangerouslySetInnerHTML={{ __html: tema.competencias }}
                  />
                </li>
              ))}
            </ul>
          )}
          <h2 className="text-lg font-semibold mt-6">Exámenes del módulo</h2>

          <button
            className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => setMostrarModalCrearExamen(true)}
          >
            + Crear examen
          </button>

          {examenes.length === 0 ? (
            <p className="text-gray-600">No hay exámenes registrados.</p>
          ) : (
            <ul className="space-y-2">
              {examenes.map((ex) => (
                <li
                  key={ex.id}
                  className="border p-3 rounded shadow-sm bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        onClick={async () => {
                          setExamenSeleccionado(ex);
                          const data = await obtenerPreguntasPorExamen(ex.id);
                          setPreguntas(data);
                          setMostrarModalPreguntas(true);
                        }}
                        className="font-semibold text-indigo-700 hover:underline cursor-pointer"
                      >
                        {ex.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Duración: {ex.duracion} min
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                        onClick={async () => {
                          setExamenSeleccionado(ex);
                          const data = await obtenerPreguntasPorExamen(ex.id);
                          setPreguntas(data);
                          setMostrarVistaPreviaExamen(true);
                        }}
                      >
                        👁 Vista previa
                      </button>

                      <label className="flex items-center gap-2 text-sm mt-1 sm:mt-0">
                        <input
                          type="checkbox"
                          checked={
                            ex.activo === 1 ||
                            ex.activo === true ||
                            ex.activo === "1"
                          }
                          onChange={async () => {
                            const nuevoEstado = !ex.activo;
                            await cambiarEstadoExamen(ex.id, nuevoEstado);
                            setExamenes((prev) =>
                              prev.map((e) =>
                                e.id === ex.id
                                  ? { ...e, activo: nuevoEstado }
                                  : e
                              )
                            );
                          }}
                        />
                        {ex.activo ? (
                          <span className="text-green-600">Activo</span>
                        ) : (
                          <span className="text-red-600">Inactivo</span>
                        )}
                      </label>
                    </div>
                  </div>
                </li>
              ))}
              {resumenModulo && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                  <h3 className="font-bold text-lg mb-2">
                    📈 Resumen del examen del módulo
                  </h3>
                  {resumenModulo.total === 0 || resumenModulo.total == null ? (
                    <p className="text-gray-600 text-sm">
                      Aún no hay resultados registrados para este módulo.
                    </p>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      <li>Aprobados: {resumenModulo.aprobados}</li>
                      <li>No aprobados: {resumenModulo.no_aprobados}</li>
                      <li>
                        Promedio:{" "}
                        {parseFloat(resumenModulo.promedio || 0).toFixed(2)}
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </ul>
          )}
        </>
      )}

      {mostrarModalCrearTema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setMostrarModalCrearTema(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Agregar nuevo tema</h2>
            <form onSubmit={handleCrearTema} className="space-y-4">
              <input
                name="nombre"
                placeholder="Nombre"
                className="w-full border p-2 rounded"
              />

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Contenido</label>
                <ReactQuill
                  theme="snow"
                  value={contenido}
                  onChange={setContenido}
                  className="bg-white h-40 mb-2"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Competencias</label>
                <ReactQuill
                  theme="snow"
                  value={competencias}
                  onChange={setCompetencias}
                  className="bg-white h-32 mb-2"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Recursos</label>
                <ReactQuill
                  theme="snow"
                  value={recursos}
                  onChange={setRecursos}
                  className="bg-white h-40 mb-2"
                />
              </div>

              <div className="pt-2">
                <button className="bg-purple-600 text-white px-4 py-2 rounded">
                  Guardar tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalCrearExamen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setMostrarModalCrearExamen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Crear nuevo examen</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                  id_modulo: moduloSeleccionado.id,
                  nombre: form.nombre.value,
                  instrucciones: form.instrucciones.value,
                  duracion: parseInt(form.duracion.value),
                };
                await crearExamen(data);
                setMostrarModalCrearExamen(false);
                form.reset();
                const nuevos = await obtenerExamenesPorModulo(
                  moduloSeleccionado.id
                );
                setExamenes(nuevos);
              }}
              className="space-y-4"
            >
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Nombre del examen
              </label>
              <input
                name="nombre"
                placeholder="Escribe el nombre del examen"
                className="w-full border p-2 rounded"
                required
              />
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Instrucciones para el estudiante
              </label>
              <textarea
                name="instrucciones"
                placeholder="Escriba las instrucciones para el estudiante"
                className="w-full border p-2 rounded"
              />
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Duracion del examen
              </label>
              <input
                name="duracion"
                type="number"
                placeholder="Duración en minutos"
                className="w-full border p-2 rounded"
                required
              />

              <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                Guardar examen
              </button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalCrearPregunta && examenSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setMostrarModalCrearPregunta(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Crear nueva pregunta</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;

                const data = {
                  id_examen: examenSeleccionado.id,
                  enunciado: form.enunciado.value,
                  tipo: tipoPregunta,
                  opcion_a: form.opcion_a?.value || null,
                  opcion_b: form.opcion_b?.value || null,
                  opcion_c: form.opcion_c?.value || null,
                  opcion_d: form.opcion_d?.value || null,
                  respuesta_correcta: form.respuesta_correcta.value,
                  puntos: parseInt(form.puntos.value || 1),
                };

                await crearPregunta(data);
                const nuevas = await obtenerPreguntasPorExamen(
                  examenSeleccionado.id
                );
                setPreguntas(nuevas);
                setMostrarModalCrearPregunta(false);
                form.reset();
              }}
              className="space-y-4"
            >
              <select
                value={tipoPregunta}
                onChange={(e) => setTipoPregunta(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="seleccion_multiple">Selección múltiple</option>
                <option value="verdadero_falso">Verdadero / Falso</option>
                <option value="abierta">Respuesta abierta</option>
              </select>

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enunciado
              </label>
              <input
                name="enunciado"
                placeholder="Escribe el enunciado de la pregunta"
                className="w-full border p-2 rounded"
                required
              />

              {tipoPregunta === "seleccion_multiple" && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Opción A
                  </label>
                  <input
                    name="opcion_a"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <label className="block text-sm font-semibold">
                    Opción B
                  </label>
                  <input
                    name="opcion_b"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <label className="block text-sm font-semibold">
                    Opción C
                  </label>
                  <input
                    name="opcion_c"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <label className="block text-sm font-semibold">
                    Opción D
                  </label>
                  <input
                    name="opcion_d"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <label className="block text-sm font-semibold">
                    Respuesta correcta
                  </label>
                  <input
                    name="respuesta_correcta"
                    placeholder="Respuesta correcta (A/B/C/D)"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              )}

              {tipoPregunta === "verdadero_falso" && (
                <select
                  name="respuesta_correcta"
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Selecciona la respuesta correcta</option>
                  <option value="Verdadero">Verdadero</option>
                  <option value="Falso">Falso</option>
                </select>
              )}

              {tipoPregunta === "abierta" && (
                <input
                  name="respuesta_correcta"
                  placeholder="Respuesta correcta esperada"
                  className="w-full border p-2 rounded"
                  required
                />
              )}

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Puntos otorgados
              </label>
              <input
                name="puntos"
                type="number"
                min="1"
                placeholder="Cantidad de puntos que vale la pregunta"
                className="w-full border p-2 rounded"
              />

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Guardar pregunta
              </button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalPreguntas && examenSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarModalPreguntas(false);
                setPreguntas([]);
              }}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">
              Preguntas del examen: {examenSeleccionado.nombre}
            </h2>

            <button
              className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setMostrarModalPreguntas(false);
                setMostrarModalCrearPregunta(true);
              }}
            >
              + Agregar pregunta
            </button>

            {preguntas.length === 0 ? (
              <p className="text-gray-600">No hay preguntas registradas.</p>
            ) : (
              <ul className="space-y-3">
                {preguntas.map((p) => (
                  <li key={p.id} className="border p-3 rounded shadow-sm">
                    <p className="font-semibold">{p.enunciado}</p>
                    <p className="text-sm text-gray-600">Tipo: {p.tipo}</p>
                    <p className="text-sm text-gray-600">Puntaje: {p.puntos}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => {
                          setPreguntaEditando(p);
                          setMostrarModalPreguntas(false);
                          setTipoPregunta(p.tipo);
                          setMostrarModalEditarPregunta(true);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={async () => {
                          Swal.fire({
                            title: "¿Deseas eliminar esta pregunta?",
                            text: "Esta acción no se puede deshacer",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "Cancelar",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              await eliminarPregunta(p.id);
                              const nuevas = await obtenerPreguntasPorExamen(
                                examenSeleccionado.id
                              );
                              setPreguntas(nuevas);
                              Swal.fire(
                                "Eliminada",
                                "La pregunta ha sido eliminada.",
                                "success"
                              );
                            }
                          });
                        }}
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {mostrarModalEditarTema && temaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarModalEditarTema(false);
                setTemaEditando(null);
                setContenido("");
                setCompetencias("");
                setRecursos("");
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Editar tema</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                  nombre: form.nombre.value,
                  contenido,
                  competencias,
                  recursos,
                };
                await actualizarTema(temaEditando.id, data);
                setMostrarModalEditarTema(false);
                setTemaEditando(null);
                form.reset();
                await obtenerTemasPorModulo(moduloSeleccionado.id).then(
                  setTemas
                );
              }}
              className="space-y-4"
            >
              <input
                name="nombre"
                defaultValue={temaEditando.nombre}
                placeholder="Nombre"
                className="w-full border p-2 rounded"
              />

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Contenido</label>
                <ReactQuill
                  theme="snow"
                  value={contenido}
                  onChange={setContenido}
                  className="bg-white h-40 mb-2"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Competencias</label>
                <ReactQuill
                  theme="snow"
                  value={competencias}
                  onChange={setCompetencias}
                  className="bg-white h-32 mb-2"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Recursos</label>
                <ReactQuill
                  theme="snow"
                  value={recursos}
                  onChange={setRecursos}
                  className="bg-white h-40 mb-2"
                />
              </div>

              <div className="pt-2 mb-12">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Actualizar tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalEditarModulo && moduloEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarModalEditarModulo(false);
                setModuloEditando(null);
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Editar módulo</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const nombre = e.target.nombre.value;

                const data = {
                  nombre,
                  observaciones: moduloObservaciones,
                  competencias: moduloCompetencias,
                  actividades: moduloActividades,
                  objetivos: moduloObjetivos,
                };

                await actualizarModulo(moduloEditando.id, data);
                setMostrarModalEditarModulo(false);
                setModuloEditando(null);

                await obtenerModulosPorTematica(tematicaSeleccionada.id).then(
                  setModulos
                );
              }}
              className="space-y-4"
            >
              <input
                name="nombre"
                defaultValue={moduloEditando.nombre}
                placeholder="Nombre del módulo"
                className="w-full border p-2 rounded"
                required
              />

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Observaciones</label>
                <ReactQuill
                  theme="snow"
                  value={moduloObservaciones}
                  onChange={setModuloObservaciones}
                  className="bg-white h-28"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Competencias</label>
                <ReactQuill
                  theme="snow"
                  value={moduloCompetencias}
                  onChange={setModuloCompetencias}
                  className="bg-white h-28"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Actividades</label>
                <ReactQuill
                  theme="snow"
                  value={moduloActividades}
                  onChange={setModuloActividades}
                  className="bg-white h-28"
                />
              </div>

              <div className="space-y-2 mb-12">
                <label className="font-semibold block">Objetivos</label>
                <ReactQuill
                  theme="snow"
                  value={moduloObjetivos}
                  onChange={setModuloObjetivos}
                  className="bg-white h-28"
                />
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Actualizar módulo
              </button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalEditarPregunta && preguntaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarModalEditarPregunta(false);
                setPreguntaEditando(null);
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Editar pregunta</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                  enunciado: form.enunciado.value,
                  tipo: tipoPregunta,
                  opcion_a: form.opcion_a?.value || null,
                  opcion_b: form.opcion_b?.value || null,
                  opcion_c: form.opcion_c?.value || null,
                  opcion_d: form.opcion_d?.value || null,
                  respuesta_correcta: form.respuesta_correcta.value,
                  puntos: parseInt(form.puntos.value || 1),
                };
                await actualizarPregunta(preguntaEditando.id, data);
                const nuevas = await obtenerPreguntasPorExamen(
                  examenSeleccionado.id
                );
                setPreguntas(nuevas);
                setMostrarModalEditarPregunta(false);
                setPreguntaEditando(null);
              }}
              className="space-y-4"
            >
              <select
                value={tipoPregunta}
                onChange={(e) => setTipoPregunta(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="seleccion_multiple">Selección múltiple</option>
                <option value="verdadero_falso">Verdadero / Falso</option>
                <option value="abierta">Respuesta abierta</option>
              </select>

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enunciado
              </label>
              <input
                name="enunciado"
                defaultValue={preguntaEditando.enunciado}
                className="w-full border p-2 rounded"
                required
              />

              {tipoPregunta === "seleccion_multiple" && (
                <div className="space-y-2">
                  <label className="block font-semibold">Opción A</label>
                  <input
                    name="opcion_a"
                    defaultValue={preguntaEditando.opcion_a}
                    className="w-full border p-2 rounded"
                  />
                  <label className="block font-semibold">Opción B</label>
                  <input
                    name="opcion_b"
                    defaultValue={preguntaEditando.opcion_b}
                    className="w-full border p-2 rounded"
                  />
                  <label className="block font-semibold">Opción C</label>
                  <input
                    name="opcion_c"
                    defaultValue={preguntaEditando.opcion_c}
                    className="w-full border p-2 rounded"
                  />
                  <label className="block font-semibold">Opción D</label>
                  <input
                    name="opcion_d"
                    defaultValue={preguntaEditando.opcion_d}
                    className="w-full border p-2 rounded"
                  />
                  <label className="block font-semibold">
                    Respuesta correcta
                  </label>
                  <input
                    name="respuesta_correcta"
                    defaultValue={preguntaEditando.respuesta_correcta}
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}

              {tipoPregunta === "verdadero_falso" && (
                <select
                  name="respuesta_correcta"
                  defaultValue={preguntaEditando.respuesta_correcta}
                  className="w-full border p-2 rounded"
                >
                  <option value="Verdadero">Verdadero</option>
                  <option value="Falso">Falso</option>
                </select>
              )}

              {tipoPregunta === "abierta" && (
                <input
                  name="respuesta_correcta"
                  defaultValue={preguntaEditando.respuesta_correcta}
                  placeholder="Respuesta correcta esperada"
                  className="w-full border p-2 rounded"
                />
              )}

              <label className="block font-semibold">Puntos otorgados</label>
              <input
                name="puntos"
                type="number"
                defaultValue={preguntaEditando.puntos}
                min="1"
                className="w-full border p-2 rounded"
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Actualizar pregunta
              </button>
            </form>
          </div>
        </div>
      )}

      {temaSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setTemaSeleccionado(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">Vista previa del tema</h2>
            <h3 className="text-lg font-semibold">{temaSeleccionado.nombre}</h3>
            <div className="mt-2">
              <div
                className="prose mb-5"
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.contenido }}
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Competencias:</h4>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: temaSeleccionado.competencias,
                }}
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Recursos:</h4>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }}
              />
            </div>
          </div>
        </div>
      )}

      {mostrarModalVistaModulo && moduloVista && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarModalVistaModulo(false);
                setModuloVista(null);
              }}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">{moduloVista.nombre}</h3>
            {moduloVista.observaciones && (
              <div className="mb-4">
                <h4 className="font-semibold">Observaciones:</h4>
                <div
                  className="prose text-sm"
                  dangerouslySetInnerHTML={{
                    __html: moduloVista.observaciones,
                  }}
                />
              </div>
            )}
            {moduloVista.competencias && (
              <div className="mb-4">
                <h4 className="font-semibold">Competencias:</h4>
                <div
                  className="prose text-sm"
                  dangerouslySetInnerHTML={{ __html: moduloVista.competencias }}
                />
              </div>
            )}
            {moduloVista.actividades && (
              <div className="mb-4">
                <h4 className="font-semibold">Actividades:</h4>
                <div
                  className="prose text-sm"
                  dangerouslySetInnerHTML={{ __html: moduloVista.actividades }}
                />
              </div>
            )}
            {moduloVista.objetivos && (
              <div className="mb-4">
                <h4 className="font-semibold">Objetivos:</h4>
                <div
                  className="prose text-sm"
                  dangerouslySetInnerHTML={{ __html: moduloVista.objetivos }}
                />
              </div>
            )}

            {moduloVista.temas.length === 0 ? (
              <p className="text-gray-600">Este módulo no tiene temas aún.</p>
            ) : (
              <ul className="space-y-3">
                {moduloVista.temas.map((tema) => (
                  <li key={tema.id} className="border rounded p-3">
                    <h4 className="font-semibold text-gray-800">
                      {tema.nombre}
                    </h4>
                    <div
                      className="text-sm text-gray-600 mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: tema.competencias }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {mostrarVistaPreviaExamen && examenSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setMostrarVistaPreviaExamen(false);
                setExamenSeleccionado(null);
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {examenSeleccionado.nombre}
            </h2>
            {examenSeleccionado.instrucciones && (
              <div className="mb-4 text-sm text-gray-700 whitespace-pre-line">
                {examenSeleccionado.instrucciones}
              </div>
            )}

            <div className="space-y-4">
              {preguntas.map((p, index) => (
                <div key={p.id} className="border rounded p-4 bg-gray-50">
                  <p className="font-semibold mb-2">
                    {index + 1}. {p.enunciado}
                  </p>
                  {p.tipo === "seleccion_multiple" && (
                    <ul className="list-disc pl-6 text-sm">
                      <li>A. {p.opcion_a}</li>
                      <li>B. {p.opcion_b}</li>
                      <li>C. {p.opcion_c}</li>
                      <li>D. {p.opcion_d}</li>
                    </ul>
                  )}
                  {p.tipo === "verdadero_falso" && (
                    <p className="text-sm text-gray-700">☐ Verdadero ☐ Falso</p>
                  )}
                  {p.tipo === "abierta" && (
                    <p className="text-sm text-gray-700">
                      ________________________
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-10">
        <button
          onClick={() => setMostrarResultados(!mostrarResultados)}
          className="bg-orange-600 text-white px-4 py-2 rounded mb-4"
        >
          {mostrarResultados
            ? "🔽 Ocultar resultados"
            : "📊 Ver resultados de estudiantes"}
        </button>

        {mostrarResultados && <ResultadosEstudiantes />}
      </div>
    </div>
  );
}

export default Admin;
