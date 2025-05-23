import { useEffect, useState } from "react";
import { obtenerTematicas, obtenerModulosPorTematica } from "../services/api";

function Estudiante({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulosPorTematica, setModulosPorTematica] = useState({});

  useEffect(() => {
    obtenerTematicas().then((tematicas) => {
      setTematicas(tematicas);
      tematicas.forEach((t) => {
        obtenerModulosPorTematica(t.id).then((modulos) => {
          setModulosPorTematica((prev) => ({ ...prev, [t.id]: modulos }));
        });
      });
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bienvenido/a {usuario.nombre}</h1>
      {tematicas.map((t) => (
        <div key={t.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t.nombre}</h2>
          <ul className="space-y-2">
            {(modulosPorTematica[t.id] || []).map((m) => (
              <li key={m.id} className="border p-3 rounded shadow bg-white">
                <div className="flex justify-between items-center">
                  <span>{m.nombre}</span>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
                    Explorar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Estudiante;
