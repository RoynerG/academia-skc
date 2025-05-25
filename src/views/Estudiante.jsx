import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  obtenerTematicas,
  obtenerModulosPorTematica,
  obtenerModulosDesbloqueados,
} from "../services/api";
import TemasEstudiante from "./TemasEstudiante";
import ExamenEstudiante from "./ExamenEstudiante";
import RevisionResultados from "./RevisionResultados";

function Estudiante({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulosPorTematica, setModulosPorTematica] = useState({});
  const [modulosDesbloqueados, setModulosDesbloqueados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerTematicas().then((tematicas) => {
      setTematicas(tematicas);

      tematicas.forEach((t) => {
        obtenerModulosPorTematica(t.id).then((modulos) => {
          setModulosPorTematica((prev) => ({ ...prev, [t.id]: modulos }));
        });
      });
    });

    obtenerModulosDesbloqueados(usuario.id).then((modulos) => {
      const ids = modulos.map((m) => m.id);
      setModulosDesbloqueados(ids);
    });
  }, [usuario.id]);

  return (
    <div className="p-6">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 className="text-2xl font-bold mb-6">
                Bienvenido/a {usuario.nombre}
              </h1>
              {tematicas.map((t) => (
                <div key={t.id} className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">{t.nombre}</h2>
                  <ul className="space-y-2">
                    {(modulosPorTematica[t.id] || []).map((m) => {
                      const desbloqueado = modulosDesbloqueados.includes(m.id);

                      return (
                        <li
                          key={m.id}
                          className={`border p-3 rounded shadow flex justify-between items-center ${
                            desbloqueado ? "bg-white" : "bg-gray-200 opacity-60"
                          }`}
                        >
                          <div>
                            <span className="font-medium">{m.nombre}</span>
                            {!desbloqueado && (
                              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <span>🔒</span> <span>Módulo bloqueado</span>
                              </div>
                            )}
                          </div>

                          {desbloqueado && (
                            <button
                              className="bg-blue-600 text-white px-4 py-1 rounded"
                              onClick={() => navigate(`/modulo/${m.id}`)}
                            >
                              Explorar
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          }
        />
        <Route path="/modulo/:moduloId" element={<TemasEstudiante />} />
        <Route
          path="/modulo/:moduloId/examen/:examenId"
          element={<ExamenEstudiante />}
        />
        <Route path="/revision-resultados" element={<RevisionResultados />} />
      </Routes>
    </div>
  );
}

export default Estudiante;
