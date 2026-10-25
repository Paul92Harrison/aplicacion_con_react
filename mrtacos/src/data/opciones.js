export const MESAS = [1, 2, 3, 4, 5];

export const ETAPAS = ["Ordenado", "Entregado", "Terminado"];

// "minutos" es el temporizador que arranca al pasar a Entregado.
// Las bebidas no llevan temporizador.
export const TIEMPOS = {
  entrada: { nombre: "Entrada", plural: "Entradas", minutos: 10, orden: 1 },
  fuerte: { nombre: "Plato fuerte", plural: "Platos fuertes", minutos: 20, orden: 2 },
  postre: { nombre: "Postre", plural: "Postres", minutos: 10, orden: 3 },
  bebida: { nombre: "Bebida", plural: "Bebidas", minutos: null, orden: 4 },
};

// Los precios del menú ya incluyen IVA
export const IVA = 0.16;
