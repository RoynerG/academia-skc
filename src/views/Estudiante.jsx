function Estudiante({ usuario }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Bienvenido estudiante, {usuario.nombre}
      </h1>
      <p className="mt-2">
        Aquí se cargará el contenido, exámenes y resultados.
      </p>
    </div>
  );
}
export default Estudiante;
