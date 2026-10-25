import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import IconoFilete from "./IconoFilete";

const Barra = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid var(--vino);
  background-color: var(--superficie);
`;

const Contenido = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 16px;
`;

const Marca = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--texto);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-decoration: none;
`;

const Menu = styled.nav`
  display: flex;
  gap: 4px;

  a {
    padding: 8px 12px;
    border-radius: 8px;
    color: var(--texto-secundario);
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    color: var(--texto);
  }

  a.active {
    color: var(--texto);
    background-color: var(--vino-fondo);
  }
`;

function Encabezado() {
  return (
    <Barra>
      <Contenido>
        <Marca to="/">
          <IconoFilete tamano={36} />
          Mr. Tacos
        </Marca>
        <Menu aria-label="Principal">
          <NavLink to="/mesa">Mesas</NavLink>
          <NavLink to="/log">Log</NavLink>
        </Menu>
      </Contenido>
    </Barra>
  );
}

export default Encabezado;
