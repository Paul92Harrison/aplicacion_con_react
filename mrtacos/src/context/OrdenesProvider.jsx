import { useEffect, useState } from "react";
import * as api from "../services/api";
import { fechaISO } from "../utils/fechas";
import { agruparPlatillos, calcularTotales } from "../utils/platillos";
import { OrdenesContext } from "./OrdenesContext";

const ERROR_CONEXION =
  "No se pudo conectar con la API. Revisa que esté corriendo con npm run api.";

function OrdenesProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.obtenerMenu(), api.obtenerOrdenes()])
      .then(([menuApi, ordenesApi]) => {
        setMenu(menuApi);
        setOrdenes(ordenesApi);
      })
      .catch(() => setError(ERROR_CONEXION))
      .finally(() => setCargando(false));
  }, []);

  // seleccion: [{ platillo, cantidad }]. Cada unidad se guarda por separado
  // para poder cambiarla de etapa de forma individual.
  const agregarPlatillos = async (mesa, seleccion) => {
    const ingreso = new Date().toISOString();
    const nuevas = seleccion.flatMap(({ platillo, cantidad }) =>
      Array.from({ length: cantidad }, () => ({
        mesa,
        menuId: platillo.id,
        nombre: platillo.nombre,
        tipo: platillo.tipo,
        precio: platillo.precio,
        etapa: "Ordenado",
        ingreso,
        entregadoEn: null,
        alertaQuitada: false,
      }))
    );

    try {
      const creadas = [];
      for (const orden of nuevas) {
        creadas.push(await api.crearOrden(orden));
      }
      setOrdenes((prev) => [...prev, ...creadas]);
      return true;
    } catch {
      setError(ERROR_CONEXION);
      return false;
    }
  };

  const actualizar = async (id, cambios) => {
    try {
      const actualizada = await api.actualizarOrden(id, cambios);
      setOrdenes((prev) => prev.map((o) => (o.id === id ? actualizada : o)));
    } catch {
      setError(ERROR_CONEXION);
    }
  };

  const cambiarEtapa = (id, etapa) => {
    const cambios = { etapa };
    if (etapa === "Entregado") {
      // Aquí arranca el temporizador
      cambios.entregadoEn = new Date().toISOString();
      cambios.alertaQuitada = false;
    }
    if (etapa === "Ordenado") {
      cambios.entregadoEn = null;
      cambios.alertaQuitada = false;
    }
    return actualizar(id, cambios);
  };

  const quitarAlerta = (id) => actualizar(id, { alertaQuitada: true });

  const eliminarPlatillo = async (id) => {
    try {
      await api.borrarOrden(id);
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
    } catch {
      setError(ERROR_CONEXION);
    }
  };

  // Crea el ticket de la mesa y la deja libre
  const cobrarMesa = async (mesa) => {
    const platillos = ordenes.filter((o) => o.mesa === mesa);
    const fecha = fechaISO();

    try {
      const ticketsDelDia = await api.obtenerTickets(fecha);
      const ticket = await api.crearTicket({
        fecha,
        folio: ticketsDelDia.length + 1,
        mesa,
        apertura: platillos.map((p) => p.ingreso).sort()[0],
        cierre: new Date().toISOString(),
        platillos: agruparPlatillos(platillos),
        ...calcularTotales(platillos),
      });
      for (const platillo of platillos) {
        await api.borrarOrden(platillo.id);
      }
      setOrdenes((prev) => prev.filter((o) => o.mesa !== mesa));
      return ticket;
    } catch {
      setError(ERROR_CONEXION);
      return null;
    }
  };

  return (
    <OrdenesContext.Provider
      value={{
        menu,
        ordenes,
        cargando,
        error,
        setError,
        agregarPlatillos,
        cambiarEtapa,
        quitarAlerta,
        eliminarPlatillo,
        cobrarMesa,
      }}
    >
      {children}
    </OrdenesContext.Provider>
  );
}

export default OrdenesProvider;
