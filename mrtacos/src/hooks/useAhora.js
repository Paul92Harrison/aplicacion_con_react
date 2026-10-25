import { useEffect, useState } from "react";

// Devuelve la hora actual en milisegundos y se actualiza cada segundo
export function useAhora(intervalo = 1000) {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), intervalo);
    return () => clearInterval(id);
  }, [intervalo]);

  return ahora;
}
