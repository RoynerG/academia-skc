import { useEffect, useState } from "react";
import {
  obtenerTematicas,
  obtenerModulosPorTematica,
  obtenerTemasPorModulo,
  crearTematica,
  crearModulo,
  crearTema,
} from "../services/api";

function Admin({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [tematicaSeleccionada, setTematicaSeleccionada] = useState(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [cargandoTematicas, setCargandoTematicas] = useState(true);
  const [cargandoModulos, setCargandoModulos] = useState(false);
  const [cargandoTemas, setCargandoTemas] = useState(false);

  useEffect(() => {
    obtenerTematicas()
      .then(setTematicas)
      .catch((err) => console.error("Error cargando temáticas:", err))
      .finally(() => setCargandoTematicas(false));
  }, []);

  const seleccionarTematica = (tematica) => {
    setTematicaSeleccionada(tematica);
    setModuloSeleccionado(null);
    setTemas([]);
    setModulos([]);
    setCargandoModulos(true);
    obtenerModulosPorTematica(tematica.id)
      .then(setModulos)
      .catch((err) => console.error("Error cargando módulos:", err))
      .finally(() => setCargandoModulos(false));
  };

  const seleccionarModulo = (modulo) => {
    setModuloSeleccionado(modulo);
    setTemas([]);
    setCargandoTemas(true);
    obtenerTemasPorModulo(modulo.id)
      .then(setTemas)
      .catch((err) => console.error("Error cargando temas:", err))
      .finally(() => setCargandoTemas(false));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Panel Admin - {usuario.nombre}
      </h1>

      <h2 className="text-lg font-semibold mb-2">Lineas temáticas:</h2>

      {/* Formulario crear linea temática */}
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
          placeholder="Nueva linea temática"
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </form>

      {cargandoTematicas ? (
        <p className="text-gray-600">Cargando lineas temáticas...</p>
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

          {/* Formulario crear módulo */}
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

      {moduloSeleccionado && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Temas del módulo: {moduloSeleccionado.nombre}
          </h2>

          {/* Formulario crear tema */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const data = {
                nombre: form.nombre.value,
                contenido: form.contenido.value,
                competencias: form.competencias.value,
                recursos: form.recursos.value,
                id_modulo: moduloSeleccionado.id,
              };
              crearTema(data).then(() => {
                form.reset();
                return obtenerTemasPorModulo(moduloSeleccionado.id).then(
                  setTemas
                );
              });
            }}
            className="mt-4 space-y-2"
          >
            <h3 className="font-semibold">Agregar nuevo tema</h3>
            <input
              name="nombre"
              placeholder="Nombre"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="contenido"
              placeholder="Contenido"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="competencias"
              placeholder="Competencias"
              className="w-full border p-2 rounded"
            />
            <textarea
              name="recursos"
              placeholder="Recursos"
              className="w-full border p-2 rounded"
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Agregar tema
            </button>
          </form>

          {cargandoTemas ? (
            <p className="text-gray-600">Cargando temas...</p>
          ) : temas.length === 0 ? (
            <p className="text-gray-600">No hay temas.</p>
          ) : (
            <ul className="space-y-2 mt-4">
              {temas.map((tema) => (
                <li
                  key={tema.id}
                  className="bg-white border rounded p-3 shadow"
                >
                  <h3 className="font-semibold">{tema.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {tema.competencias}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
