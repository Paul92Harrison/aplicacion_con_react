// API local levantada con json-server (npm run api)
const API_URL = "http://localhost:3000";

async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} en ${ruta}`);
  }
  return respuesta.json();
}

export const obtenerMenu = () => pedir("/menu");

export const obtenerOrdenes = () => pedir("/ordenes");

export const crearOrden = (orden) =>
  pedir("/ordenes", { method: "POST", body: JSON.stringify(orden) });

export const actualizarOrden = (id, cambios) =>
  pedir(`/ordenes/${id}`, { method: "PATCH", body: JSON.stringify(cambios) });

export const borrarOrden = (id) => pedir(`/ordenes/${id}`, { method: "DELETE" });

export const obtenerTickets = (fecha) => pedir(`/tickets?fecha=${fecha}`);

export const obtenerTicket = (id) => pedir(`/tickets/${id}`);

export const crearTicket = (ticket) =>
  pedir("/tickets", { method: "POST", body: JSON.stringify(ticket) });
