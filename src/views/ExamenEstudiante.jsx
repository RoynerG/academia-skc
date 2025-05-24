import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPreguntasPorExamen } from "../services/api";

function ExamenEstudiante() {
  const { examenId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);

  useEffect(() => {
    obtenerPreguntasPorExamen(examenId).then(setPreguntas);
  }, [examenId]);

  const handleChange = (preguntaId, value) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: value }));
  };

  const handleFinalizar = () => {
    console.log("Respuestas enviadas:", respuestas);
    alert("¡Examen finalizado! Revisa la consola para ver las respuestas.");
    navigate(-1);
  };

  const actual = preguntas[preguntaActual];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Examen</h1>

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
