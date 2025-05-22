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
} from "../services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";

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

  useEffect(() => {
    obtenerTematicas()
      .then(setTematicas)
      .catch((err) => console.error("Error cargando temáticas:", err))
      .finally(() => setCargandoTematicas(false));
  }, []);

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const nombre = e.target.nombre.value;
              if (!nombre) return;
              crearModulo({
                nombre,
                id_tematica: tematicaSeleccionada.id,
              }).then(() => {
                e.target.reset();
                return obtenerModulosPorTematica(tematicaSeleccionada.id).then(
                  setModulos
                );
              });
            }}
            className="mb-4 flex gap-2"
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nuevo módulo"
              className="border p-2 rounded w-full"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Agregar
            </button>
          </form>

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
                  {m.nombre}
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
              <h4 className="font-semibold">Contenido:</h4>
              <div
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.contenido }}
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Competencias:</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: temaSeleccionado.competencias,
                }}
              />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Recursos:</h4>
              <div
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
