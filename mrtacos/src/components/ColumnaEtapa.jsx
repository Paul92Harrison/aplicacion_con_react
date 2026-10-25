import styled from "styled-components";
import TarjetaPlatillo from "./TarjetaPlatillo";

const Columna = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--borde);
  border-top: 4px solid var(--vino);
  border-radius: 10px;
  background-color: var(--superficie);

  h2 {
    display: flex;
    justify-content: space-between;
    margin: 0 0 12px;
    font-size: 1.05rem;
  }

  h2 span {
    color: var(--texto-secundario);
    font-weight: 400;
  }
`;

const Lista = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Vacio = styled.p`
  margin: 0;
  color: var(--texto-secundario);
  font-size: 0.9rem;
`;

function ColumnaEtapa({ etapa, platillos, ahora }) {
  const idTitulo = `columna-${etapa}`;

  return (
    <Columna aria-labelledby={idTitulo}>
      <h2 id={idTitulo}>
        {etapa} <span>{platillos.length}</span>
      </h2>
      {platillos.length === 0 ? (
        <Vacio>Sin platillos</Vacio>
      ) : (
        <Lista>
          {platillos.map((platillo) => (
            <TarjetaPlatillo key={platillo.id} platillo={platillo} ahora={ahora} />
          ))}
        </Lista>
      )}
    </Columna>
  );
}

export default ColumnaEtapa;
