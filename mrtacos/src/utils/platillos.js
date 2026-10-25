import { IVA, TIEMPOS } from "../data/opciones";

// Primero por tiempo de comida y después por hora de ingreso
export function ordenarPlatillos(platillos) {
  return [...platillos].sort(
    (a, b) =>
      TIEMPOS[a.tipo].orden - TIEMPOS[b.tipo].orden ||
      a.ingreso.localeCompare(b.ingreso)
  );
}

// Junta los platillos iguales para el ticket: 2 x Guacamole, etc.
export function agruparPlatillos(platillos) {
  const grupos = [];
  ordenarPlatillos(platillos).forEach((platillo) => {
    const grupo = grupos.find((g) => g.nombre === platillo.nombre);
    if (grupo) {
      grupo.cantidad += 1;
      grupo.importe += platillo.precio;
    } else {
      grupos.push({
        nombre: platillo.nombre,
        tipo: platillo.tipo,
        precio: platillo.precio,
        cantidad: 1,
        importe: platillo.precio,
      });
    }
  });
  return grupos;
}

// El IVA ya viene incluido en el precio, solo se desglosa
export function calcularTotales(platillos) {
  const total = platillos.reduce((suma, p) => suma + p.precio, 0);
  const subtotal = Math.round((total / (1 + IVA)) * 100) / 100;
  const iva = Math.round((total - subtotal) * 100) / 100;
  return { subtotal, iva, total };
}

export function formatoPrecio(cantidad) {
  return cantidad.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}
