import styled, { css, keyframes } from "styled-components";
import { useOrdenes } from "../hooks/useOrdenes";
import { ETAPAS, TIEMPOS } from "../data/opciones";
import { formatoReloj, hora } from "../utils/fechas";
import { tieneAlerta, tiempoRestante } from "../utils/temporizador";

const pulso = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(226, 120, 138, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(226, 120, 138, 0);
  }
`;

const Tarjeta = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--borde);
  border-left: 4px solid var(--vino);
  border-radius: 8px;
  background-color: var(--superficie-alta);

  ${(props) =>
    props.$alerta &&
    css`
      border-color: var(--vino-claro);
      background-color: var(--vino-fondo);
      animation: ${pulso} 1.5s ease-in-out infinite;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`;

const Fila = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--texto-secundario);
`;

const Etiqueta = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--texto);
  background-color: var(--vino-oscuro);
  font-weight: 600;
`;

const Nombre = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const Reloj = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(props) => (props.$vencido ? "var(--vino-claro)" : "var(--texto)")};

  small {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--texto-secundario);
  }
`;

const Alerta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background-color: var(--vino);
  font-weight: 600;

  button {
    padding: 6px 10px;
    border: 1px solid #fff;
    border-radius: 6px;
    color: #fff;
    background: transparent;
    cursor: pointer;
  }
`;

const Controles = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  label {
    display: flex;
    flex: 1;
    flex-direction: column;
    font-size: 0.8rem;
    color: var(--texto-secundario);
  }

  select {
    min-height: 40px;
    padding: 6px;
    border: 1px solid var(--borde-campo);
    border-radius: 6px;
  }
`;

const BotonQuitar = styled.button`
  min-height: 40px;
  padding: 6px 10px;
  border: 1px solid var(--borde-campo);
  border-radius: 6px;
  color: var(--texto-secundario);
  background: transparent;
  cursor: pointer;
`;

function TarjetaPlatillo({ platillo, ahora }) {
  const { cambiarEtapa, quitarAlerta, eliminarPlatillo } = useOrdenes();
  const tiempo = TIEMPOS[platillo.tipo];
  const restante = tiempoRestante(platillo, ahora);
  const alerta = tieneAlerta(platillo, ahora);
  const mostrarReloj = platillo.etapa === "Entregado" && restante !== null;
  const idSelector = `etapa-${platillo.id}`;

  return (
    <Tarjeta $alerta={alerta} aria-label={platillo.nombre}>
      <Fila>
        <Etiqueta>{tiempo.nombre}</Etiqueta>
        <span>Ingreso {hora(platillo.ingreso)}</span>
      </Fila>
      <Nombre>{platillo.nombre}</Nombre>

      {mostrarReloj && (
        <Reloj role="timer" $vencido={restante <= 0}>
          {restante > 0 ? formatoReloj(restante) : `+${formatoReloj(restante)}`}
          <small>{restante > 0 ? "para revisar la mesa" : "tiempo cumplido"}</small>
        </Reloj>
      )}

      {alerta && (
        <Alerta role="alert">
          ¡Revisa la mesa!
          <button type="button" onClick={() => quitarAlerta(platillo.id)}>
            Quitar alerta
          </button>
        </Alerta>
      )}

      <Controles>
        <label htmlFor={idSelector}>
          Etapa
          <select
            id={idSelector}
            value={platillo.etapa}
            onChange={(e) => cambiarEtapa(platillo.id, e.target.value)}
          >
            {ETAPAS.map((etapa) => (
              <option key={etapa} value={etapa}>
                {etapa}
              </option>
            ))}
          </select>
        </label>
        {platillo.etapa === "Ordenado" && (
          <BotonQuitar
            type="button"
            onClick={() => eliminarPlatillo(platillo.id)}
            aria-label={`Quitar ${platillo.nombre} de la orden`}
          >
            Quitar
          </BotonQuitar>
        )}
      </Controles>
    </Tarjeta>
  );
}

export default TarjetaPlatillo;
