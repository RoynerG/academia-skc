function Admin({ usuario }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido admin, {usuario.nombre}</h1>
      <p className="mt-2">
        Aquí podrás gestionar contenidos, exámenes y usuarios.
      </p>
    </div>
  );
}
export default Admin;
