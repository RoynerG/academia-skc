import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerTemasPorModulo,
  obtenerExamenesPorModulo,
  obtenerTematicas,
  obtenerModulosPorTematica,
} from "../services/api";
import Acordeon from "../components/Acordeon";

function TemasEstudiante() {
  const { moduloId } = useParams();
  const navigate = useNavigate();
  const [temas, setTemas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [nombreModulo, setNombreModulo] = useState("");
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);

  useEffect(() => {
    obtenerTemasPorModulo(moduloId).then(setTemas);

    obtenerExamenesPorModulo(moduloId).then((lista) => {
      const activos = lista.filter((e) => e.estado === "activo");
      setExamenes(activos);
    });

    obtenerTematicas().then((tematicas) => {
      tematicas.forEach((t) => {
        obtenerModulosPorTematica(t.id).then((modulos) => {
          const m = modulos.find((m) => m.id == moduloId);
          if (m) setNombreModulo(m.nombre);
        });
      });
    });
  }, [moduloId]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Temas del Módulo: {nombreModulo}
      </h1>

      <ul className="space-y-2">
        {temas.map((t) => (
          <li
            key={t.id}
            onClick={() => setTemaSeleccionado(t)}
            className="cursor-pointer border p-4 rounded bg-white shadow hover:bg-blue-50 transition-all"
          >
            <h3 className="font-semibold">{t.nombre}</h3>
            <p className="text-sm text-gray-500 mt-1 italic">
              Haz clic para ver el contenido
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">Exámenes disponibles</h2>

      <ul className="space-y-2">
        {examenes.map((e) => (
          <li
            key={e.id}
            className="border p-4 rounded bg-white shadow flex justify-between items-center"
          >
            <span>{e.nombre}</span>
            <button className="bg-green-600 text-white px-4 py-1 rounded">
              Iniciar examen
            </button>
          </li>
        ))}
      </ul>

      {temaSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setTemaSeleccionado(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {temaSeleccionado.nombre}
            </h2>

            <div className="mb-4">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.contenido }}
              />
            </div>

            <Acordeon title="Competencias">
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: temaSeleccionado.competencias,
                }}
              />
            </Acordeon>

            <Acordeon title="Recursos">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: temaSeleccionado.recursos }}
              />
            </Acordeon>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemasEstudiante;
