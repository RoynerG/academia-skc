import { obtenerResultadosEstudiantes } from "../services/api";
import { useEffect, useState } from "react";

function ResultadosEstudiantes() {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    obtenerResultadosEstudiantes().then(setResultados);
  }, []);

  console.log(resultados);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">📊 Resultados de Estudiantes</h2>
      {resultados.length === 0 ? (
        <p className="text-gray-600">No hay resultados registrados aún.</p>
      ) : (
        <table className="w-full table-auto border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Estudiante</th>
              <th className="p-2 border">Módulo</th>
              <th className="p-2 border">Nota</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Intento</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2 border">{r.funcionario}</td>
                <td className="p-2 border">{r.modulo}</td>
                <td className="p-2 border">{r.nota}</td>
                <td className="p-2 border">
                  {r.aprobado == "1" ? "✅ Aprobado" : "❌ No aprobado"}
                </td>
                <td className="p-2 border">{r.intento}</td>
                <td className="p-2 border">
                  {new Date(r.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResultadosEstudiantes;
