import { useEffect, useState } from "react";
import { obtenerTematicas } from "../services/api";

function Admin({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerTematicas()
      .then((res) => setTematicas(res))
      .catch((err) => console.error("Error cargando temáticas:", err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Panel Admin - {usuario.nombre}
      </h1>

      {cargando ? (
        <p className="text-gray-600">Cargando temáticas...</p>
      ) : tematicas.length === 0 ? (
        <p className="text-gray-600">No hay temáticas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {tematicas.map((t) => (
            <li key={t.id} className="bg-white border rounded shadow p-4">
              <h2 className="text-lg font-semibold">{t.nombre}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
