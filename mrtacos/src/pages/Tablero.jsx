import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Boton, BotonEnlace } from "../components/Botones";
import ColumnaEtapa from "../components/ColumnaEtapa";
import PestanasMesas from "../components/PestanasMesas";
import { useOrdenes } from "../hooks/useOrdenes";
import { ETAPAS, MESAS } from "../data/opciones";
import { useAhora } from "../hooks/useAhora";
import { calcularTotales, formatoPrecio, ordenarPlatillos } from "../utils/platillos";

const Barra = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 16px;

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }

  p {
    flex: 1;
    margin: 0;
    color: var(--texto-secundario);
  }
`;

const Columnas = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    align-items: start;
  }
`;

const Mensaje = styled.p`
  padding: 24px;
  border: 1px dashed var(--borde-campo);
  border-radius: 10px;
  color: var(--texto-secundario);
  text-align: center;
`;

function Tablero() {
  const { numero } = useParams();
  const mesa = Number(numero);
  const { ordenes, cargando, cobrarMesa } = useOrdenes();
  const ahora = useAhora();
  const navigate = useNavigate();
  const [cobrando, setCobrando] = useState(false);

  if (!MESAS.includes(mesa)) {
    return <Navigate to="/mesa/1" replace />;
  }

  const platillos = ordenarPlatillos(ordenes.filter((o) => o.mesa === mesa));
  const todoTerminado =
    platillos.length > 0 && platillos.every((p) => p.etapa === "Terminado");
  const { total } = calcularTotales(platillos);

  const cobrar = async () => {
    setCobrando(true);
    const ticket = await cobrarMesa(mesa);
    setCobrando(false);
    if (ticket) navigate(`/log/${ticket.id}`);
  };

  return (
    <>
      <PestanasMesas ordenes={ordenes} ahora={ahora} />

      <Barra>
        <h1>Mesa {mesa}</h1>
        <p>Cuenta: {formatoPrecio(total)}</p>
        <BotonEnlace to={`/mesa/${mesa}/agregar`} $secundario>
          + Agregar platillos
        </BotonEnlace>
        {todoTerminado && (
          <Boton type="button" onClick={cobrar} disabled={cobrando}>
            {cobrando ? "Cobrando…" : "Cobrar"}
          </Boton>
        )}
      </Barra>

      {cargando ? (
        <Mensaje>Cargando órdenes…</Mensaje>
      ) : platillos.length === 0 ? (
        <Mensaje>La mesa está libre. Agrega platillos para abrir una orden.</Mensaje>
      ) : (
        <Columnas>
          {ETAPAS.map((etapa) => (
            <ColumnaEtapa
              key={etapa}
              etapa={etapa}
              platillos={platillos.filter((p) => p.etapa === etapa)}
              ahora={ahora}
            />
          ))}
        </Columnas>
      )}
    </>
  );
}

export default Tablero;
