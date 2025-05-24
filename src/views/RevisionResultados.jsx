import { useLocation, useNavigate } from "react-router-dom";

function RevisionResultados() {
  const navigate = useNavigate();
  const location = useLocation();
  const { preguntas = [], respuestas = {} } = location.state || {};

  if (!preguntas.length) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Revisión de resultados</h1>
        <p className="text-gray-600">No hay datos para mostrar.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  let puntajeTotal = 0;
  let puntajeMaximo = 0;

  const resultados = preguntas.map((p) => {
    const r = respuestas[p.id];
    let estado = "pendiente";
    let puntos = 0;
    const maxPuntos = p.puntos || 1;
    puntajeMaximo += maxPuntos;

    if (p.tipo !== "abierta") {
      if (r) {
        if (r === p.respuesta_correcta) {
          estado = "correcta";
          puntos = maxPuntos;
        } else {
          estado = "incorrecta";
        }
      }
    } else {
      if (r?.trim()) {
        estado = "pendiente";
        puntos = maxPuntos;
      }
    }

    puntajeTotal += puntos;

    return { ...p, respuestaEstudiante: r, estado, puntosObtenidos: puntos };
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Revisión de resultados</h1>
      <p className="mb-6 text-lg">
        Puntaje obtenido: <strong>{puntajeTotal}</strong> / {puntajeMaximo}
      </p>
      <ul className="space-y-6">
        {resultados.map((p, index) => (
          <li key={p.id} className="border p-4 rounded shadow bg-white">
            <p className="font-semibold mb-2">
              {index + 1}. {p.enunciado}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Tu respuesta:</strong>{" "}
              {p.respuestaEstudiante || "No respondida"}
            </p>
            <p
              className={`font-semibold ${
                p.estado === "correcta"
                  ? "text-green-600"
                  : p.estado === "incorrecta"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {p.estado === "correcta"
                ? `✔ Correcta (${p.puntosObtenidos} pts)`
                : p.estado === "incorrecta"
                ? `✘ Incorrecta — Correcta: ${p.respuesta_correcta}`
                : `⧗ Pendiente de revisión (${p.puntosObtenidos} pts)`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RevisionResultados;
