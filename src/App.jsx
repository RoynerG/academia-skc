import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Estudiante from "./views/Estudiante";
import Admin from "./views/Admin";
import { verificarFuncionario } from "./services/api";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id_empleado = params.get("id_empleado");

    if (!id_empleado) {
      setCargando(false);
      return;
    }

    verificarFuncionario(id_empleado)
      .then((res) => {
        setUsuario(res.funcionario);
      })
      .catch(() => {
        setUsuario(null);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Cargando...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <a
          href="https://sucasainmobiliaria.com.co/mi-cuenta/"
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded inline-flex items-center"
        >
          ← Regresar al inicio
        </a>
        <p>Acceso denegado o inválido</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {usuario.rol_academia?.toLowerCase() === "estudiante" ? (
          <Route path="*" element={<Estudiante usuario={usuario} />} />
        ) : (
          <Route path="*" element={<Admin usuario={usuario} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
