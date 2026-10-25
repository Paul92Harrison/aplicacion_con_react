import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { MESAS } from "../data/opciones";
import { tieneAlerta } from "../utils/temporizador";

const Lista = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
`;

const Pestana = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border: 1px solid var(--borde);
  border-radius: 10px;
  color: var(--texto-secundario);
  background-color: var(--superficie);
  text-decoration: none;

  strong {
    color: var(--texto);
    font-size: 1.4rem;
  }

  small {
    font-size: 0.75rem;
  }

  &.active {
    border-color: var(--vino-claro);
    background-color: var(--vino-fondo);
  }
`;

const Punto = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--vino-claro);
  box-shadow: 0 0 0 3px var(--vino-fondo);
`;

function PestanasMesas({ ordenes, ahora }) {
  return (
    <nav aria-label="Mesas">
      <Lista>
        {MESAS.map((mesa) => {
          const deLaMesa = ordenes.filter((o) => o.mesa === mesa);
          const conAlerta = deLaMesa.some((o) => tieneAlerta(o, ahora));
          return (
            <li key={mesa}>
              <Pestana to={`/mesa/${mesa}`}>
                <small>Mesa</small>
                <strong>{mesa}</strong>
                <small>{deLaMesa.length === 0 ? "Libre" : "Ocupada"}</small>
                {conAlerta && (
                  <Punto>
                    <span className="solo-lectores">con alerta</span>
                  </Punto>
                )}
              </Pestana>
            </li>
          );
        })}
      </Lista>
    </nav>
  );
}

export default PestanasMesas;
