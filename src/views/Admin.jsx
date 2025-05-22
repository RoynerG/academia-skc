import { useEffect, useState } from "react";
import { obtenerTematicas, obtenerModulosPorTematica } from "../services/api";

function Admin({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [tematicaSeleccionada, setTematicaSeleccionada] = useState(null);
  const [cargandoTematicas, setCargandoTematicas] = useState(true);
  const [cargandoModulos, setCargandoModulos] = useState(false);

  useEffect(() => {
    obtenerTematicas()
      .then(setTematicas)
      .catch((err) => console.error("Error cargando temáticas:", err))
      .finally(() => setCargandoTematicas(false));
  }, []);

  const seleccionarTematica = (tematica) => {
    setTematicaSeleccionada(tematica);
    setModulos([]);
    setCargandoModulos(true);
    obtenerModulosPorTematica(tematica.id)
      .then(setModulos)
      .catch((err) => console.error("Error cargando módulos:", err))
      .finally(() => setCargandoModulos(false));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Panel Admin - {usuario.nombre}
      </h1>

      <h2 className="text-lg font-semibold mb-2">Lineas temáticas:</h2>
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
          {cargandoModulos ? (
            <p className="text-gray-600">Cargando módulos...</p>
          ) : modulos.length === 0 ? (
            <p className="text-gray-600">No hay módulos para esta temática.</p>
          ) : (
            <ul className="space-y-2">
              {modulos.map((m) => (
                <li key={m.id} className="bg-white border rounded p-3 shadow">
                  {m.nombre}
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
