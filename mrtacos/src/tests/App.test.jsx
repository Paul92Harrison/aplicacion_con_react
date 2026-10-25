import { expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import OrdenesProvider from "../context/OrdenesProvider";
import { fechaISO } from "../utils/fechas";
import { crearApiFalsa } from "./apiFalsa";

function renderizarApp(ruta, datosIniciales) {
  const api = crearApiFalsa(datosIniciales);
  vi.stubGlobal("fetch", api.fetchFalso);
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <OrdenesProvider>
        <App />
      </OrdenesProvider>
    </MemoryRouter>
  );
  return api.datos;
}

function hace(minutos) {
  return new Date(Date.now() - minutos * 60 * 1000).toISOString();
}

function orden(datos) {
  return {
    mesa: 1,
    etapa: "Ordenado",
    ingreso: hace(30),
    entregadoEn: null,
    alertaQuitada: false,
    ...datos,
  };
}

const guacamole = { menuId: "guacamole", nombre: "Guacamole", tipo: "entrada", precio: 120 };
const tacos = { menuId: "tacos", nombre: "Orden de 3 tacos de carne asada", tipo: "fuerte", precio: 150 };
const flan = { menuId: "flan", nombre: "Flan", tipo: "postre", precio: 100 };
const jamaica = { menuId: "jamaica", nombre: "Agua de jamaica", tipo: "bebida", precio: 40 };

test("agrega platillos a una mesa y aparecen en la columna Ordenado", async () => {
  const usuario = userEvent.setup();
  const datos = renderizarApp("/mesa/2/agregar");

  const agregarGuacamole = await screen.findByLabelText("Agregar uno de Guacamole");
  await usuario.click(agregarGuacamole);
  await usuario.click(agregarGuacamole);
  await usuario.click(screen.getByLabelText("Agregar uno de Agua de jamaica"));
  expect(screen.getByText("Total a agregar: $280.00")).toBeInTheDocument();

  await usuario.click(screen.getByRole("button", { name: "Agregar a la mesa 2" }));

  const columna = await screen.findByRole("region", { name: /Ordenado/ });
  expect(within(columna).getAllByRole("listitem")).toHaveLength(3);
  expect(datos.ordenes).toHaveLength(3);
  expect(datos.ordenes.every((o) => o.mesa === 2)).toBe(true);
});

test("ordena los platillos por tiempo de comida y luego por hora de ingreso", async () => {
  renderizarApp("/mesa/1", {
    ordenes: [
      orden({ ...flan, id: "a", ingreso: hace(5) }),
      orden({ ...guacamole, id: "b", ingreso: hace(2) }),
      orden({ ...jamaica, id: "c", ingreso: hace(20) }),
      orden({ ...tacos, id: "d", ingreso: hace(10) }),
      orden({ ...guacamole, id: "e", nombre: "Frijoles puercos", ingreso: hace(8) }),
    ],
  });

  const columna = await screen.findByRole("region", { name: /Ordenado/ });
  const nombres = within(columna)
    .getAllByRole("listitem")
    .map((tarjeta) => tarjeta.getAttribute("aria-label"));

  expect(nombres).toEqual([
    "Frijoles puercos",
    "Guacamole",
    "Orden de 3 tacos de carne asada",
    "Flan",
    "Agua de jamaica",
  ]);
});

test("el temporizador sigue desde la hora guardada y alerta al cumplirse", async () => {
  const usuario = userEvent.setup();
  const datos = renderizarApp("/mesa/1", {
    ordenes: [
      orden({ ...guacamole, id: "a", etapa: "Entregado", entregadoEn: hace(4) }),
      orden({ ...flan, id: "b", etapa: "Entregado", entregadoEn: hace(11) }),
    ],
  });

  const guacamoleTarjeta = await screen.findByRole("listitem", { name: "Guacamole" });
  expect(within(guacamoleTarjeta).getByRole("timer")).toHaveTextContent(/^(06:00|05:5\d)/);
  expect(within(guacamoleTarjeta).queryByRole("alert")).not.toBeInTheDocument();

  const flanTarjeta = screen.getByRole("listitem", { name: "Flan" });
  expect(within(flanTarjeta).getByRole("alert")).toHaveTextContent("¡Revisa la mesa!");
  expect(screen.getByText("con alerta")).toBeInTheDocument();

  await usuario.click(within(flanTarjeta).getByRole("button", { name: "Quitar alerta" }));

  expect(within(flanTarjeta).queryByRole("alert")).not.toBeInTheDocument();
  expect(within(flanTarjeta).getByRole("timer")).toBeInTheDocument();
  expect(datos.ordenes[1].alertaQuitada).toBe(true);
});

test("el botón Cobrar aparece solo con todo terminado y genera el ticket", async () => {
  const usuario = userEvent.setup();
  const datos = renderizarApp("/mesa/3", {
    ordenes: [
      orden({ ...guacamole, id: "a", mesa: 3, etapa: "Terminado" }),
      orden({ ...tacos, id: "b", mesa: 3, etapa: "Entregado", entregadoEn: hace(1) }),
      orden({ ...flan, id: "c", mesa: 4 }),
    ],
  });

  const tarjeta = await screen.findByRole("listitem", { name: tacos.nombre });
  expect(screen.queryByRole("button", { name: "Cobrar" })).not.toBeInTheDocument();

  await usuario.selectOptions(within(tarjeta).getByLabelText("Etapa"), "Terminado");
  await usuario.click(await screen.findByRole("button", { name: "Cobrar" }));

  const ticket = await screen.findByRole("article", { name: "Ticket 1" });
  expect(within(ticket).getByText("$232.76")).toBeInTheDocument();
  expect(within(ticket).getByText("$37.24")).toBeInTheDocument();
  expect(within(ticket).getByText("$270.00")).toBeInTheDocument();

  expect(datos.tickets).toHaveLength(1);
  expect(datos.tickets[0]).toMatchObject({ mesa: 3, folio: 1, total: 270, fecha: fechaISO() });
  // Solo queda la orden de la otra mesa
  expect(datos.ordenes.map((o) => o.id)).toEqual(["c"]);
});

test("el log muestra los tickets del día elegido", async () => {
  const ticketBase = {
    mesa: 1,
    apertura: hace(60),
    cierre: hace(5),
    platillos: [],
    subtotal: 103.45,
    iva: 16.55,
    total: 120,
  };
  renderizarApp("/log", {
    tickets: [
      { ...ticketBase, id: "t1", folio: 1, fecha: fechaISO() },
      { ...ticketBase, id: "t2", folio: 1, mesa: 5, fecha: "2026-01-15", total: 540 },
    ],
  });

  expect(await screen.findByText("Mesa 1")).toBeInTheDocument();
  expect(screen.queryByText("Mesa 5")).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Día"), { target: { value: "2026-01-15" } });

  expect(await screen.findByText("Mesa 5")).toBeInTheDocument();
  expect(screen.queryByText("Mesa 1")).not.toBeInTheDocument();
});
