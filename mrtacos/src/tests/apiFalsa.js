import { vi } from "vitest";
import db from "../../db.json";

// Imita a json-server en memoria para que las pruebas no dependan de la API real
export function crearApiFalsa({ ordenes = [], tickets = [] } = {}) {
  const datos = {
    menu: structuredClone(db.menu),
    ordenes: structuredClone(ordenes),
    tickets: structuredClone(tickets),
  };
  let siguienteId = 1;

  const responder = (cuerpo, status = 200) => ({
    ok: status < 400,
    status,
    json: async () => structuredClone(cuerpo),
  });

  const fetchFalso = vi.fn(async (url, opciones = {}) => {
    const { pathname, searchParams } = new URL(url);
    const [, recurso, id] = pathname.split("/");
    const metodo = opciones.method ?? "GET";
    const lista = datos[recurso];
    if (!lista) return responder({}, 404);

    if (metodo === "GET" && !id) {
      let resultado = lista;
      searchParams.forEach((valor, campo) => {
        resultado = resultado.filter((e) => String(e[campo]) === valor);
      });
      return responder(resultado);
    }

    if (metodo === "POST") {
      const nuevo = { ...JSON.parse(opciones.body), id: `id${siguienteId++}` };
      lista.push(nuevo);
      return responder(nuevo, 201);
    }

    const indice = lista.findIndex((e) => e.id === id);
    if (indice === -1) return responder({}, 404);

    if (metodo === "PATCH") {
      lista[indice] = { ...lista[indice], ...JSON.parse(opciones.body) };
      return responder(lista[indice]);
    }
    if (metodo === "DELETE") {
      const [borrado] = lista.splice(indice, 1);
      return responder(borrado);
    }
    return responder(lista[indice]);
  });

  return { datos, fetchFalso };
}
