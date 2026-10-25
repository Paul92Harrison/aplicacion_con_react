import { TIEMPOS } from "../data/opciones";

// Milisegundos que faltan para que se cumpla el tiempo (negativo si ya pasó).
// Se calcula con la hora guardada en entregadoEn, así sigue igual tras recargar.
export function tiempoRestante(platillo, ahora) {
  const minutos = TIEMPOS[platillo.tipo].minutos;
  if (!minutos || !platillo.entregadoEn) return null;
  const duracion = minutos * 60 * 1000;
  const fin = new Date(platillo.entregadoEn).getTime() + duracion;
  // "ahora" se actualiza cada segundo, así que justo al entregar podría
  // quedar un poco atrás; nunca se muestra más del tiempo completo
  return Math.min(fin - ahora, duracion);
}

export function tieneAlerta(platillo, ahora) {
  const restante = tiempoRestante(platillo, ahora);
  return (
    platillo.etapa === "Entregado" &&
    restante !== null &&
    restante <= 0 &&
    !platillo.alertaQuitada
  );
}
