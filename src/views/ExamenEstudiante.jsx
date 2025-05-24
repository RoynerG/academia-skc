import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerPreguntasPorExamen,
  obtenerExamenesPorModulo,
} from "../services/api";
import Swal from "sweetalert2";

function ExamenEstudiante() {
  const { examenId, moduloId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [examen, setExamen] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "¿Estás seguro de que deseas salir del examen? Tu progreso se perderá.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    obtenerPreguntasPorExamen(examenId).then(setPreguntas);
    obtenerExamenesPorModulo(moduloId).then((lista) => {
      const e = lista.find((ex) => ex.id == examenId);
      if (e) {
        setExamen(e);
        const duracionEnSegundos = e.duracion * 60;
        setTiempoRestante(duracionEnSegundos);
      }
    });
  }, [examenId, moduloId]);

  useEffect(() => {
    if (tiempoRestante === null) return;
    if (tiempoRestante <= 0) {
      Swal.fire(
        "Tiempo agotado",
        "Tu examen ha finalizado automáticamente.",
        "warning"
      );
      handleFinalizar();
      return;
    }
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tiempoRestante]);

  const handleChange = (preguntaId, value) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: value }));
  };

  const handleFinalizar = () => {
    navigate("/revision-resultados", {
      state: {
        preguntas,
        respuestas,
      },
    });
  };

  const actual = preguntas[preguntaActual];

  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Examen</h1>
        {tiempoRestante !== null && (
          <div className="text-red-600 font-mono text-lg">
            ⏱ Tiempo restante: {formatoTiempo(tiempoRestante)}
          </div>
        )}
      </div>

      {preguntas.length === 0 ? (
        <p className="text-gray-600">Cargando preguntas...</p>
      ) : (
        <div className="space-y-6">
          <div className="border p-4 rounded bg-white shadow">
            <p className="font-semibold mb-2">
              Pregunta {preguntaActual + 1} de {preguntas.length}:{" "}
              {actual.enunciado}
            </p>

            {actual.tipo === "seleccion_multiple" && (
              <div className="space-y-2">
                {["a", "b", "c", "d"].map((letra) => (
                  <label key={letra} className="block">
                    <input
                      type="radio"
                      name={`pregunta-${actual.id}`}
                      value={letra.toUpperCase()}
                      checked={respuestas[actual.id] === letra.toUpperCase()}
                      onChange={(e) => handleChange(actual.id, e.target.value)}
                    />{" "}
                    {actual[`opcion_${letra}`]}
                  </label>
                ))}
              </div>
            )}

            {actual.tipo === "verdadero_falso" && (
              <div className="space-x-4">
                {["Verdadero", "Falso"].map((val) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name={`pregunta-${actual.id}`}
                      value={val}
                      checked={respuestas[actual.id] === val}
                      onChange={(e) => handleChange(actual.id, e.target.value)}
                    />{" "}
                    {val}
                  </label>
                ))}
              </div>
            )}

            {actual.tipo === "abierta" && (
              <textarea
                className="border w-full p-2 rounded"
                placeholder="Escribe tu respuesta..."
                value={respuestas[actual.id] || ""}
                onChange={(e) => handleChange(actual.id, e.target.value)}
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setPreguntaActual((prev) => Math.max(prev - 1, 0))}
              disabled={preguntaActual === 0}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              ← Anterior
            </button>

            {preguntaActual < preguntas.length - 1 ? (
              <button
                onClick={() => setPreguntaActual((prev) => prev + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleFinalizar}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Finalizar examen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamenEstudiante;
