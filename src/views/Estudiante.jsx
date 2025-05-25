import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  obtenerTematicas,
  obtenerModulosPorTematica,
  obtenerModulosDesbloqueados,
  obtenerModulosAprobados,
} from "../services/api";
import TemasEstudiante from "./TemasEstudiante";
import ExamenEstudiante from "./ExamenEstudiante";
import RevisionResultados from "./RevisionResultados";
import { generarCertificado } from "../utils/generarCertificadoLandscape";

function Estudiante({ usuario }) {
  const [tematicas, setTematicas] = useState([]);
  const [modulosPorTematica, setModulosPorTematica] = useState({});
  const [modulosDesbloqueados, setModulosDesbloqueados] = useState([]);
  const [modulosAprobados, setModulosAprobados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!usuario?.id_empleado) return;

    obtenerTematicas().then((tematicas) => {
      setTematicas(tematicas);
      tematicas.forEach((t) => {
        obtenerModulosPorTematica(t.id).then((modulos) => {
          setModulosPorTematica((prev) => ({ ...prev, [t.id]: modulos }));
        });
      });
    });

    obtenerModulosDesbloqueados(usuario.id_empleado).then((res) => {
      const lista = res.data || res;
      const ids = lista.map((m) => m.id);
      setModulosDesbloqueados(ids);
    });

    obtenerModulosAprobados(usuario.id_empleado).then((res) => {
      const lista = res.data || res;
      const ids = lista.map((m) => m.id_modulo);
      setModulosAprobados(ids);
    });
  }, [usuario?.id_empleado, location.key]);

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
                      const aprobado = modulosAprobados.includes(m.id);

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

                          <div className="flex gap-2">
                            {desbloqueado && (
                              <button
                                className="bg-blue-600 text-white px-4 py-1 rounded"
                                onClick={() => navigate(`/modulo/${m.id}`)}
                              >
                                Explorar
                              </button>
                            )}
                            {aprobado && (
                              <button
                                onClick={() =>
                                  generarCertificado(m.nombre, usuario.nombre)
                                }
                                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                              >
                                📄 Certificado
                              </button>
                            )}
                          </div>
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
          element={<ExamenEstudiante usuario={usuario} />}
        />
        <Route path="/revision-resultados" element={<RevisionResultados />} />
      </Routes>
    </div>
  );
}

export default Estudiante;
