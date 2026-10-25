import { useContext } from "react";
import { OrdenesContext } from "../context/OrdenesContext";

export function useOrdenes() {
  const context = useContext(OrdenesContext);
  if (!context) {
    throw new Error("useOrdenes debe usarse dentro de <OrdenesProvider>");
  }
  return context;
}
